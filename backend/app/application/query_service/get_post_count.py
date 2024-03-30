from datetime import date
from typing import List

from application.query_service.base_query_service import BaseQueryService
from domain.value_object.post_object import PostObject

from infrastructure.db.model.post_model import PostModel
from infrastructure.db.setting import session


class GetPostCount(BaseQueryService):
    """グチの総数を取得する"""

    def __init__(self, author_id: int):
        self.author_id = author_id

    def _execute(self) -> List[PostObject]:
        return session.query(PostModel).filter(PostModel.author_id == self.author_id).count()
