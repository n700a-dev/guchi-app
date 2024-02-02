from typing import List
from datetime import date
from injector import inject

from domain.value_object.post_object import PostObject
from domain.repository.i_post_repository import IPostRepository

# CQRS
# https://zenn.dev/ogakuzuko/scraps/b0bb89299e642e


class PostsQueryService:
    """グチのコレクションを取得するためのクエリサービス"""

    @inject
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    def get_daily_posts(self, author_id, target_date: date) -> List[PostObject]:
        """指定した日付のグチを取得する

        Args:
            target_date (date): 指定した日付

        Returns:
            List[PostObject]: グチのコレクション
        """

        return self.post_repo.get_daily_posts(author_id, target_date)
