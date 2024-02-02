# Boto3 Document:
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

import boto3
import botocore
import os
import logging
import re

from schema import create_schema

logging.basicConfig(
    level=logging.INFO, format="%(filename)s: " "%(levelname)s: " "%(funcName)s(): " "%(lineno)d:\t" "%(message)s"
)
logger = logging.getLogger(__name__)

AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
REGION_NAME = os.environ["REGION_NAME"]
ENDPOINT_URL = os.environ["ENDPOINT_URL"]

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME,
)


def safe_create_table(method):
    """
    dynamodbテーブルの作成処理

    Args:
        method (function): テーブル作成用の関数

    Returns:
        None
    """

    try:
        method()
        print(f"table created: {method.__name__}")
    except botocore.exceptions.ClientError as error:
        if error.response["Error"]["Code"] == "ResourceInUseException":
            msg = error.response["Error"]["Message"]
            if re.search(r".*existing\stable", msg):
                logger.warning(msg)
        else:
            logger.warning(error.response["Error"]["Code"])
            print(error)


# テーブル作成
[safe_create_table(cmd) for cmd in create_schema(dynamodb)]
