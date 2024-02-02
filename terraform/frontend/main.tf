variable "frontend_certification_arn" {
  type        = string
  description = "cloudfrontend certification arn"
}

# S3
resource "aws_s3_bucket" "frontend" {
  bucket = "guchi-app-frontend-prod"

  tags = {
    Name = "guchi-app-frontend-prod"
  }
}

resource "aws_s3_bucket_cors_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "frontend" {
  statement {
    sid     = "AllowCloudFrontAccessToS3Frontend"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    resources = [
      "${aws_s3_bucket.frontend.arn}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values = [
        aws_cloudfront_distribution.frontend.arn
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend.json
}

# Lambda@Edge
module "edge_lambda" {
  source = "./edge_lambda"
}

# CloudFront
resource "aws_cloudfront_cache_policy" "frontend" {
  name        = "frontend-cache-policy"
  comment     = "Caching Next.js static files."
  default_ttl = 50
  max_ttl     = 100
  min_ttl     = 1
  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
      cookies {}
    }
    headers_config {
      header_behavior = "none"
      headers {}
    }
    query_strings_config {
      query_string_behavior = "none"
      query_strings {}
    }
  }
}

resource "aws_cloudfront_origin_request_policy" "cors_s3origin" {
  name    = "Custom-CORS-S3Origin"
  comment = "Custom CORS settings for S3 Origin"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

# resource "aws_cloudfront_response_header_policy" "frontend" {
#   name    = "guchi-app-frontend-prod-response-header-policy"
#   comment = "Response header policy for S3 guchi-app-frontend-prod"
# }

resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "example"
  description                       = "Example Policy"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Distribution for guchi-app-frontend-prod"
  price_class         = "PriceClass_200"
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
    origin_id                = aws_s3_bucket.frontend.id
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.frontend.id
    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = aws_cloudfront_cache_policy.frontend.id
    compress               = true
    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = "${module.edge_lambda.frontend_lambda_arn}:1"
      include_body = false
    }
  }
  viewer_certificate {
    acm_certificate_arn      = var.frontend_certification_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  aliases = ["guchi-log.net"]
}

output "frontend_cf_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_cf_zone_id" {
  value = aws_cloudfront_distribution.frontend.hosted_zone_id
}

