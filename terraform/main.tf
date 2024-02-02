variable "rds_password" {
  type        = string
  description = "Password for RDS"
}

# tfstate
terraform {
  backend "s3" {
    region = "ap-northeast-1"
    bucket = "guchi-app-terraform"
    key    = "prod/terraform.tfstate"
  }
}

# VPC
resource "aws_vpc" "guchi_app_prod" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "guchi-app-prod-vpc"
  }
}

# Igw
resource "aws_internet_gateway" "public" {
  vpc_id = aws_vpc.guchi_app_prod.id

}

# Subnet
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.guchi_app_prod.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "guchi-app-prod-subnet-public-1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.guchi_app_prod.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true
  tags = {
    Name = "guchi-app-prod-subnet-public-2"
  }
}

resource "aws_subnet" "private_1" {
  vpc_id                  = aws_vpc.guchi_app_prod.id
  cidr_block              = "10.0.11.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = false
  tags = {
    Name = "guchi-app-prod-subnet-private-1"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id                  = aws_vpc.guchi_app_prod.id
  cidr_block              = "10.0.12.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = false
  tags = {
    Name = "guchi-app-prod-subnet-private-2"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.guchi_app_prod.id
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  gateway_id             = aws_internet_gateway.public.id
  destination_cidr_block = "0.0.0.0/0"
}

resource "aws_route_table" "private_1" {
  vpc_id = aws_vpc.guchi_app_prod.id
}

resource "aws_route_table" "private_2" {
  vpc_id = aws_vpc.guchi_app_prod.id
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private_1.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private_2.id
}

# EC2
module "ec2_instance" {
  source                       = "./backend"
  vpc_id                       = aws_vpc.guchi_app_prod.id
  subnet_id                    = aws_subnet.public_1.id
  ec2_to_rds_security_group_id = module.rds_instance.ec2_to_rds_security_group_id
  alb_sg_id                    = module.alb.alb_sg_id
}

# RDS
module "rds_instance" {
  source                 = "./rds"
  vpc_id                 = aws_vpc.guchi_app_prod.id
  vpc_security_group_ids = [aws_vpc.guchi_app_prod.default_security_group_id]
  subnet_ids = [
    aws_subnet.private_1.id,
    aws_subnet.private_2.id
  ]
  rds_to_ec2_security_group_id = module.ec2_instance.rds_to_ec2_security_group_id
  rds_password                 = var.rds_password
}

# ALB
module "alb" {
  source                  = "./alb"
  vpc_id                  = aws_vpc.guchi_app_prod.id
  subnet_ids              = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  target_instance_id      = module.ec2_instance.instance_id
  frontend_cf_domain_name = module.s3_frontend.frontend_cf_domain_name
  frontend_cf_zone_id     = module.s3_frontend.frontend_cf_zone_id
}

# S3
module "s3_frontend" {
  source                     = "./frontend"
  frontend_certification_arn = module.alb.frontend_certification_arn
}
