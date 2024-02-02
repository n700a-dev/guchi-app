variable "vpc_id" {
  type        = string
  description = "VPC id"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Subnet ids where the ALB will be deployed"
}

variable "target_instance_id" {
  type        = string
  description = "Target instance id"
}

variable "frontend_cf_domain_name" {
  type = string
}

variable "frontend_cf_zone_id" {
  type = string
}

module "https_sg" {
  source      = "../security_group"
  name        = "guchi-app-prod-alb-https-sg"
  vpc_id      = var.vpc_id
  port        = 443
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_alb" "backend" {
  name                       = "guchi-app-prod-alb"
  load_balancer_type         = "application"
  internal                   = false
  idle_timeout               = 60
  enable_deletion_protection = false # !!! 有効化すること

  subnets = var.subnet_ids
  # access_logs {
  #   bucket = aws_s3_bucket.alb_logs.bucket
  #   enabled = true
  # }

  security_groups = [
    module.https_sg.security_group_id
  ]
}

# ALB
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_alb.backend.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.guchi_app_prod.arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.guchi_app_prod.arn
  }
}

resource "aws_lb_target_group" "guchi_app_prod" {
  name                 = "guchi-app-prod-tg"
  target_type          = "instance"
  vpc_id               = var.vpc_id
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 120

  health_check {
    path                = "/"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-299"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  depends_on = [aws_alb.backend]
}

resource "aws_lb_target_group_attachment" "guchi_app_prod" {
  count            = 1
  target_group_arn = aws_lb_target_group.guchi_app_prod.arn
  target_id        = var.target_instance_id
  port             = 80
}

output "alb_sg_id" {
  value = module.https_sg.security_group_id
}

output "alb_dns_name" {
  value = aws_alb.backend.dns_name
}

### Route53 ###

# Route53 Hosted Zone
data "aws_route53_zone" "guchi_app_prod" {
  name = "guchi-log.net"
}

# NS/SOA

#
# When creating Route 53 zones, the NS and SOA records for the zone are automatically created.
# Enabling the allow_overwrite argument will allow managing these records
# in a single Terraform run without the requirement for terraform import.
#
# resource "aws_route53_record" "imported_ns" {
#   zone_id = data.aws_route53_zone.guchi_app_prod.id
#   name    = data.aws_route53_zone.guchi_app_prod.name
#   records = [
#     "ns-1869.awsdns-41.co.uk.",
#     "ns-92.awsdns-11.com.",
#     "ns-1123.awsdns-12.org.",
#     "ns-699.awsdns-23.net."
#   ]
#   ttl             = 86400
#   type            = "NS"
#   allow_overwrite = true
# }

# resource "aws_route53_record" "imported_soa" {
#   zone_id = data.aws_route53_zone.guchi_app_prod.id
#   name    = data.aws_route53_zone.guchi_app_prod.name
#   records = [
#     "ns-1869.awsdns-41.co.uk. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
#   ]
#   ttl             = 900
#   type            = "SOA"
#   allow_overwrite = true
# }

# ACM - backend
resource "aws_acm_certificate" "guchi_app_prod" {
  domain_name = "guchi-log.net"
  subject_alternative_names = [
    "guchi-log.net",
    "*.guchi-log.net",
    # "*.stage.guchi-log.net"
  ]
  validation_method = "DNS"
}

resource "aws_route53_record" "acm_verification" {
  for_each = {
    for dvo in aws_acm_certificate.guchi_app_prod.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = data.aws_route53_zone.guchi_app_prod.zone_id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "acm_verification" {
  certificate_arn         = aws_acm_certificate.guchi_app_prod.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_verification : record.fqdn]
}

# ACM - frontend
provider "aws" {
  region = "us-east-1"
  alias  = "virginia"
}

resource "aws_acm_certificate" "guchi_app_frontend" {
  provider    = aws.virginia
  domain_name = "guchi-log.net"
  subject_alternative_names = [
    "guchi-log.net",
    "*.guchi-log.net",
  ]
  validation_method = "DNS"
}

resource "aws_route53_record" "acm_verification_frontend" {
  provider = aws.virginia
  for_each = {
    for dvo in aws_acm_certificate.guchi_app_frontend.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = data.aws_route53_zone.guchi_app_prod.zone_id
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "acm_verification_frontend" {
  provider                = aws.virginia
  certificate_arn         = aws_acm_certificate.guchi_app_frontend.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_verification_frontend : record.fqdn]
}

output "frontend_certification_arn" {
  value = aws_acm_certificate.guchi_app_frontend.arn
}

### 


# DNS
resource "aws_route53_record" "guchi_app_prod_backend" {
  allow_overwrite = true
  zone_id         = data.aws_route53_zone.guchi_app_prod.zone_id
  name            = "backend.${data.aws_route53_zone.guchi_app_prod.name}"
  type            = "A"

  alias {
    name                   = aws_alb.backend.dns_name
    zone_id                = aws_alb.backend.zone_id
    evaluate_target_health = true
  }
}


resource "aws_route53_record" "guchi_app_prod_frontend" {
  allow_overwrite = true
  zone_id         = data.aws_route53_zone.guchi_app_prod.zone_id
  name            = data.aws_route53_zone.guchi_app_prod.name
  type            = "A"

  alias {
    name                   = var.frontend_cf_domain_name
    zone_id                = var.frontend_cf_zone_id
    evaluate_target_health = false
  }
}
