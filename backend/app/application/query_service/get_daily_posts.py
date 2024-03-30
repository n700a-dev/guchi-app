from datetime import date
from typing import List

from application.query_service.base_query_service import BaseQueryService
from domain.value_object.post_object import PostObject

from infrastructure.db.model.post_model import PostModel
from infrastructure.db.setting import session


class GetDailyPosts(BaseQueryService):
    """日ごとのグチを取得する。"""

    def __init__(self, author_id: int):
        self.author_id = author_id
        # self.posts_query_service = self.resolve(PostsQueryService)

    def _execute(self, postedDate: str) -> List[PostObject]:
        posts = (
            session.query(PostModel)
            .filter(PostModel.author_id == self.author_id)
            .filter(PostModel.posted_date == postedDate)
            .order_by(PostModel.created_at_ms.desc())
            .all()
        )
        k = [
            PostObject(
                author_id=post.author_id,
                uploaded_at_ms=post.uploaded_at_ms,
                text=post.text,
                emotion=post.emotion,
                image_url=post.image_url,
                created_at_ms=post.created_at_ms,
                updated_at_ms=post.updated_at_ms,
                posted_date=post.posted_date,
                diff_hour=post.diff_hour,
            )
            for post in posts
        ]

        return k
