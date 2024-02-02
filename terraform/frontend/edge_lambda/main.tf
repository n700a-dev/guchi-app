provider "aws" {
  region = "us-east-1"
  alias  = "virginia"
}


# Lambda@edge
## AssumeRole
data "aws_iam_policy_document" "frontend_lambda_sts" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# ## Policy
resource "aws_iam_role" "frontend_lambda" {
  name               = "guchi-app-frontend-prod-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.frontend_lambda_sts.json
  inline_policy {
    name = "my_inline_policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "lambda:InvokeFunction",
            "lambda:GetFunction",
            "lambda:EnableReplication*",
            "iam:CreateServiceLinkedRole",
            "cloudfront:CreateDistribution",
            "cloudfront:UpdateDistribution",
          ]
          Effect   = "Allow"
          Resource = "*"
        },
      ]
    })
  }
}


## lambda execution
data "archive_file" "frontend_lambda" {
  source_file = "${path.module}/convert_cloud_front_path/index.mjs"
  output_path = "${path.module}/convert_cloud_front_path.zip"
  type        = "zip"
}

resource "aws_lambda_function" "frontend_lambda" {
  provider         = aws.virginia
  function_name    = "guchi-app-frontend-prod-convert-cloudfront-path"
  filename         = data.archive_file.frontend_lambda.output_path
  runtime          = "nodejs18.x"
  role             = aws_iam_role.frontend_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.frontend_lambda.output_base64sha256
  publish          = true # 公開しないとLambda@Edgeとして使えない
}

resource "aws_lambda_permission" "allow_cloudfront" {
  provider      = aws.virginia
  statement_id  = "allow-execution-edge-lambda-from-cloudfront"
  action        = "lambda:GetFunction"
  function_name = aws_lambda_function.frontend_lambda.function_name
  principal     = "edgelambda.amazonaws.com"
}

output "frontend_lambda_arn" {
  value = aws_lambda_function.frontend_lambda.arn
}
