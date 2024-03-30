import strawberry
from datetime import date
from typing import Optional
import datetime as dt
from sqlalchemy import insert

from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime
from application.usecase.create_post import CreatePost
from application.usecase.update_post import UpdatePost
from application.usecase.delete_post import DeletePost
from application.query_service.get_post_count import GetPostCount
from application.query_service.get_daily_posts import GetDailyPosts
from application.query_service.get_daily_emotion_count import GetDailyEmotionCounts

from presentation.gql.types.boolean import BooleanType
from domain.value_object.post_object import (
    PostCreateInputObject,
    PostDeleteInputObject,
    PostObject,
    PostUpdateInputObject,
)
from domain.value_object.posted_date_object import PostedDateInputObject
from domain.value_object.daily_emotion_count import DailyEmotionCountObject
from presentation.gql.context import Info
from infrastructure.db.setting import session
from infrastructure.s3.upload_singner import UploadSigner


@strawberry.input
class TPostArg:
    text: str
    emotion: Optional[str] = None
    imageUrl: Optional[str] = None
    createdAtMs: str  # 作成日時（unix秒に変換する）... 32bitを超えるのでstrで受け取る
    updatedAtMs: str  # 更新日時（unix秒に変換する）... 32bitを超えるのでstrで受け取る


@strawberry.input
class TPostCreateArg(TPostArg):
    diffHour: int
    postedDate: str


@strawberry.input
class TPostDeleteArg:
    createdAtMs: str


@strawberry.type
class DailyEmotionCount:
    postedDate: str
    emotion: Optional[str]
    emotionCount: int

    @classmethod
    def to_daily_emotion_count_return(cls, daily: DailyEmotionCountObject):
        return cls(
            postedDate=daily.posted_date,
            emotion=daily.emotion,
            emotionCount=daily.emotion_count,
        )


@strawberry.type
class UploadCredential:
    url: str
    fields: str  # JSON String


@strawberry.type
class Post:
    uploadedAtMs: Optional[str]  # insert時は不要
    text: Optional[str]
    emotion: Optional[str]
    imageUrl: Optional[str]
    createdAtMs: str  # 作成日時（unix秒に変換する）
    updatedAtMs: str  # 更新日時（unix秒に変換する）
    postedDate: str
    diffHour: int  # 時差

    @classmethod
    def to_post_return(cls, post: PostObject):
        return cls(
            uploadedAtMs=post.uploaded_at_ms,
            text=post.text,
            imageUrl=post.image_url,
            updatedAtMs=post.updated_at_ms,
            createdAtMs=post.created_at_ms,
            emotion=post.emotion,
            postedDate=post.posted_date,
            diffHour=post.diff_hour,
        )

    @classmethod
    async def get_daily_posts(cls, postedDate: str, info: Info):
        author_id = info.context.current_user.id
        return list(
            map(
                lambda post: cls.to_post_return(post),
                GetDailyPosts(author_id).execute(postedDate),
            )
        )

    @classmethod
    async def get_post_count(cls, info: Info):
        author_id = info.context.current_user.id
        return GetPostCount(author_id).execute()

    @classmethod
    async def get_daily_emotion_counts(cls, year: int, month: int, info: Info):
        author_id = info.context.current_user.id
        return list(
            map(
                lambda daily: DailyEmotionCount.to_daily_emotion_count_return(daily),
                GetDailyEmotionCounts(author_id).execute(year, month),
            )
        )

    @classmethod
    async def get_image_upload_url(cls, created_at_ms: str, updated_at_ms: str, info: Info) -> str:
        author_id = info.context.current_user.id
        result = UploadSigner().post_image_upload_url(author_id, created_at_ms, updated_at_ms)
        return UploadCredential(url=result["url"], fields=result["fields"])

    @classmethod
    def create_post(cls, input: TPostCreateArg, info: Info) -> BooleanType:
        author_id = info.context.current_user.id
        post = PostCreateInputObject(
            author_id=author_id,
            created_at_ms=input.createdAtMs,
            updated_at_ms=input.updatedAtMs,
            diff_hour=input.diffHour,
            posted_date=input.postedDate,
            text=input.text,
            emotion=input.emotion,
            image_url=input.imageUrl,
        )

        result = CreatePost().execute(author_id, post)
        return BooleanType(result)

    @classmethod
    def update_post(cls, input: TPostArg, info: Info) -> BooleanType:
        author_id = info.context.current_user.id

        post = PostUpdateInputObject(
            author_id=author_id,
            created_at_ms=input.createdAtMs,
            updated_at_ms=input.updatedAtMs,
            text=input.text,
            emotion=input.emotion,
            image_url=input.imageUrl,
        )
        result = UpdatePost().execute(author_id, post)

        return BooleanType(result)

    @classmethod
    def delete_post(cls, input: TPostDeleteArg, info: Info) -> BooleanType:
        author_id = info.context.current_user.id
        post = PostDeleteInputObject(author_id=author_id, created_at_ms=input.createdAtMs)

        result = DeletePost().execute(author_id, post)

        return BooleanType(result)
