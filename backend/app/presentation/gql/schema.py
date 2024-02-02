import strawberry
from typing import List

from presentation.gql.is_authenticated import IsAuthenticated
from presentation.gql.types.user import User
from presentation.gql.types.post import DailyEmotionCount, Post, UploadCredential
from presentation.gql.types.posted_date import PostedDate
from presentation.gql.types.storage_credential import StrageCredential
from presentation.gql.types.boolean import MyBoolean


# Resolver: https://strawberry.rocks/docs/types/resolvers
# https://book.st-hakky.com/docs/sqlalchemy-filter-join/


@strawberry.type
class Query:
    # User
    current_user: User = strawberry.field(resolver=User.get_current_user, permission_classes=[IsAuthenticated])
    users: List[User] = strawberry.field(resolver=User.get_users, permission_classes=[IsAuthenticated])

    # PostedDate
    posted_dates: List[PostedDate] = strawberry.field(
        resolver=PostedDate.get_posted_dates, permission_classes=[IsAuthenticated]
    )
    posted_date: PostedDate = strawberry.field(
        resolver=PostedDate.get_posted_date, permission_classes=[IsAuthenticated]
    )

    # Post
    daily_posts: List[Post] = strawberry.field(resolver=Post.get_daily_posts, permission_classes=[IsAuthenticated])
    post_image_upload_credential: UploadCredential = strawberry.field(
        resolver=Post.get_image_upload_url, permission_classes=[IsAuthenticated]
    )
    post_count: int = strawberry.field(resolver=Post.get_post_count, permission_classes=[IsAuthenticated])
    daily_emotion_counts: List[DailyEmotionCount] = strawberry.field(
        resolver=Post.get_daily_emotion_counts, permission_classes=[IsAuthenticated]
    )

    # Strage
    strage_credential: StrageCredential = strawberry.field(
        resolver=StrageCredential.get_credential, permission_classes=[IsAuthenticated]
    )


@strawberry.type
class Mutation:
    # User
    withdraw_current_user: MyBoolean = strawberry.field(
        resolver=User.withdraw_current_user, permission_classes=[IsAuthenticated]
    )

    # Post
    create_post: MyBoolean = strawberry.field(resolver=Post.create_post, permission_classes=[IsAuthenticated])
    update_post: MyBoolean = strawberry.field(resolver=Post.update_post, permission_classes=[IsAuthenticated])
    delete_post: MyBoolean = strawberry.field(resolver=Post.delete_post, permission_classes=[IsAuthenticated])
