from datetime import date
from typing import List

from application.usecase.base_usecase import BaseUseCase
from domain.entity.post_repo import PostRepository
from domain.value_object.post_object import PostObject

from infrastructure.db.setting import session


class GetPostCount(BaseUseCase):
    """グチの総数を取得する"""

    def __init__(self, author_id: int):
        self.author_id = author_id

    def execute(self) -> List[PostObject]:
        return session.query(PostRepository).filter(PostRepository.author_id == self.author_id).count()
