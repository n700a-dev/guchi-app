
variable "vpc_id" {}
variable "subnet_id" {}
variable "alb_sg_id" {}

variable "instance_type" {
  default = "t3.micro"
}

variable "ec2_to_rds_security_group_id" {
  type = string

}

module "security_group_http" {
  source      = "../security_group"
  name        = "guchi-app-prod-ec2-http-sg"
  vpc_id      = var.vpc_id
  port        = 80
  cidr_blocks = ["0.0.0.0/0"]
}

module "security_group_ssh" {
  source      = "../security_group"
  name        = "guchi-app-prod-ec2-ssh-sg"
  vpc_id      = var.vpc_id
  port        = 22
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group" "rds_to_ec2" {
  name        = "guchi-app-prod-rds-to-ec2-sg"
  description = "Security group for EC2 to accept inbound access from RDS"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ec2_to_rds_security_group_id]
  }

}

resource "aws_instance" "guchi_app_backend" {
  ami = "ami-******"
  tags = {
    Name = "guchi-app-prod-ec2-backend"
  }
  key_name = "keypair-guchi-app-ec2"
  vpc_security_group_ids = [
    module.security_group_http.security_group_id,
    module.security_group_ssh.security_group_id,
    aws_security_group.rds_to_ec2.id,
    var.alb_sg_id
  ]
  subnet_id     = var.subnet_id
  instance_type = var.instance_type
  user_data     = <<-EOF
    #!/bin/bash
    systemctl start guchi-app.service
  EOF
}

output "instance_id" {
  value = aws_instance.guchi_app_backend.id
}

output "rds_to_ec2_security_group_id" {
  value = aws_security_group.rds_to_ec2.id
}

