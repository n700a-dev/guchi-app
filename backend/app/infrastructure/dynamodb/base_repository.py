# dynamodb boto3 使い方
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/client/transact_write_items.html
# https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/GettingStarted.WriteItem.html

# client vs resource vs session
# https://stackoverflow.com/questions/42809096/difference-in-boto3-between-resource-client-and-session

import os
import boto3

AWS_ACCESS_KEY_ID = os.environ["*****"]
AWS_SECRET_ACCESS_KEY = os.environ["*****"]
REGION_NAME = os.environ["REGION_NAME"]
ENDPOINT_URL = os.environ["ENDPOINT_URL"]


class BaseRepository:
    def __init__(self):
        dynamodb = boto3.resource(
            "dynamodb",
            endpoint_url=ENDPOINT_URL,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=REGION_NAME,
        )

        self.resource = dynamodb
