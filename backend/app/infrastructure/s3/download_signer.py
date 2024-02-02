import boto3
import os
from datetime import datetime, timedelta
import urllib.parse


from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from botocore.signers import CloudFrontSigner
from botocore.config import Config
from pydantic import BaseModel
import os

# Credentials
PRIVATE_KEY_PATH = os.environ["*****"]
CLOUD_FRONT_KEY_ID = os.environ["*****"]
CLOUD_FRONT_URL = os.environ["*****"]
EXPIRATION_MINUTE = os.environ["EXPIRATION_MINUTE"]


class StorageCredentialObject(BaseModel):
    base_url: str
    access_query: str
    expired_at_ms: int


class DownloadSigner:
    def __init__(self):
        pass

    def __rsa_signer(self, message):
        with open(PRIVATE_KEY_PATH, "rb") as key_file:
            private_key = serialization.load_pem_private_key(key_file.read(), password=None, backend=default_backend())
        return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())

    def get_credential(self, author_id: int) -> StorageCredentialObject:
        cloudfront_signer = CloudFrontSigner(CLOUD_FRONT_KEY_ID, self.__rsa_signer)

        url = urllib.parse.urljoin(CLOUD_FRONT_URL, f"{author_id}/*")

        expire_date = datetime.utcnow() + timedelta(minutes=int(EXPIRATION_MINUTE))

        policy = cloudfront_signer.build_policy(url, expire_date, date_greater_than=None)

        signed_url = cloudfront_signer.generate_presigned_url(url, date_less_than=None, policy=policy)

        return StorageCredentialObject(
            base_url=CLOUD_FRONT_URL,
            access_query=signed_url.split("?")[1],
            expired_at_ms=int(expire_date.timestamp() * 1000),
        )
