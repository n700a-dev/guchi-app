from datetime import date
from typing import List
from utils.datetime_handler import start_of_the_day, end_of_the_day

from domain.repository.i_post_repository import IPostRepository
from domain.value_object.post_object import PostObject
from infrastructure.dynamodb.base_repository import BaseRepository


class PostRepository(IPostRepository, BaseRepository):
    """application層のRepositoryInterfaceを継承し、処理の実装を行うクラス"""

    TABLE_NAME = "posts"

    def __init__(self):
        super().__init__()
        self.table = self.resource.Table(self.TABLE_NAME)

    def add(self, post: PostObject):
        self.table.put_item(
            Item={
                "authorId": post.author_id,
                "uploadedAtMs": post.uploaded_at_ms,
                "createdAt": post.created_at,
                "text": post.text,
                "emotion": post.emotion,
            }
        )

    def get_daily_posts(self, author_id: int, target_date: date) -> List[PostObject]:
        """指定した日付のグチを取得する"""

        response = self.table.query(
            IndexName="postCreatedAtGSIndex",
            KeyConditionExpression="authorId = :authorId AND createdAt BETWEEN :start AND :end",
            ExpressionAttributeValues={
                ":authorId": author_id,
                ":start": start_of_the_day(target_date).isoformat(),
                ":end": end_of_the_day(target_date).isoformat(),
            },
        )

        items = response.get("Items")

        posts_collection = list(
            map(
                lambda item: PostObject(
                    author_id=item["authorId"],
                    uploaded_at_ms=item["uploadedAtMs"],
                    text=item["text"],
                    created_at=item["createdAt"],
                    emotion=item["emotion"],
                ),
                items,
            )
        )

        return posts_collection
