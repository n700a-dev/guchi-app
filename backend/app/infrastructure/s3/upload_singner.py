import boto3
from botocore.config import Config
import os
import json

MIN_IMAGE_UPLOAD_SIZE = 100  # 100Byte
MAX_IMAGE_UPLOAD_SIZE = 2000000  # 2MB


class UploadSigner:
    def __init__(self):
        self.bucket_name = os.environ["BUCKET_NAME_USER_DATA"]
        self.expiration_sec = int(os.environ["UPLOAD_EXPIRATION_SEC"])
        self.s3_client = boto3.client(
            "s3",
            config=Config(region_name=os.environ["REGION_NAME"], signature_version="s3v4"),
            aws_access_key_id=os.environ["*****"],
            aws_secret_access_key=os.environ["*****"],
        )

    def __generate_post_url(self, object_name: str) -> str:
        """署名付きURLを生成する"""
        response = self.s3_client.generate_presigned_post(
            Bucket=self.bucket_name,
            Key=object_name,
            Conditions=[["content-length-range", MIN_IMAGE_UPLOAD_SIZE, MAX_IMAGE_UPLOAD_SIZE]],
            ExpiresIn=self.expiration_sec,
        )

        return {"url": response["url"], "fields": json.dumps(response["*****"])}

    def post_image_upload_url(self, user_id: int, created_at_ms: str, updated_at_ms: str) -> str:
        """グチ画像投稿用の署名付きURLを生成する"""
        object_name = f"{user_id}/posts/{created_at_ms}/images/{updated_at_ms}.png"

        return self.__generate_post_url(object_name)
