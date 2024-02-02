variable "vpc_id" {}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "VPC security group id"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Subnet ids where the RDS instance will be deployed"
}

variable "rds_to_ec2_security_group_id" {
  type        = string
  description = "Security group id for RDS to accept inbound access from EC2"
}

variable "rds_password" {
  type        = string
  description = "Password for RDS"
}

resource "aws_db_subnet_group" "rds" {
  name       = "example-subnet-group"
  subnet_ids = var.subnet_ids
}

data "aws_db_snapshot" "rds_20240727" {
  db_snapshot_identifier = "snapshot-20240128"
}

# https://github.com/terraform-aws-modules/terraform-aws-rds/blob/v6.3.1/examples/complete-postgres/main.tf
resource "aws_db_instance" "guchi_app_prod_rds" {
  identifier            = "guchi-app-prod-rds"
  engine                = "postgres"
  engine_version        = "14.10"
  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  availability_zone     = "ap-northeast-1a"
  # kms_key_id               = data.aws_kms_key.rds.arn # NOTE: これを指定するとforce replacementされる
  db_name                    = "pg"
  port                       = 5432
  username                   = "postgres"
  password                   = var.rds_password
  multi_az                   = false
  backup_retention_period    = 7
  backup_window              = "18:00-19:00"
  maintenance_window         = "mon:19:00-mon:20:00"
  auto_minor_version_upgrade = false
  deletion_protection        = true
  skip_final_snapshot        = false # 削除前にスナップショットを取得するか
  final_snapshot_identifier  = "guchi-app-prod-rds-final-snapshot"
  snapshot_identifier        = data.aws_db_snapshot.rds_20240727.id

  vpc_security_group_ids = concat(var.vpc_security_group_ids, [aws_security_group.ec2_to_rds.id])
  db_subnet_group_name   = aws_db_subnet_group.rds.name

  # https://stackoverflow.com/a/51487115
  lifecycle {
    ignore_changes = [snapshot_identifier]
  }

  tags = {
    Name        = "guchi-app-prod-rds"
    Environment = "production"
  }
}

resource "aws_security_group" "ec2_to_rds" {
  name        = "guchi-app-prod-ec2-to-rds-sg"
  description = "Security group for RDS to accept inbound access from EC2"
  vpc_id      = var.vpc_id

  # ingress {
  #   from_port       = 5432
  #   to_port         = 5432
  #   protocol        = "tcp"
  #   security_groups = [var.rds_to_ec2_security_group_id]
  # }
}

resource "aws_security_group_rule" "ec2_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ec2_to_rds.id
  source_security_group_id = var.rds_to_ec2_security_group_id
}


output "ec2_to_rds_security_group_id" {
  value = aws_security_group.ec2_to_rds.id
}
