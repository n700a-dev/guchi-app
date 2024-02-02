import strawberry

from presentation.gql.context import Info
from infrastructure.s3.download_signer import DownloadSigner, StorageCredentialObject


@strawberry.type
class StrageCredential:
    expiredAtMs: str
    baseUrl: str
    accessQuery: str

    @classmethod
    def to_storage_credential_return(cls, cred: StorageCredentialObject):
        return cls(
            expiredAtMs=cred.expired_at_ms,
            baseUrl=cred.base_url,
            accessQuery=cred.access_query
        )

    @classmethod
    def get_credential(cls, info: Info):
        author_id = info.context.current_user.id
        return cls.to_storage_credential_return(DownloadSigner().get_credential(author_id))
