from typing import List
from datetime import date
from injector import inject

from domain.value_object.posted_date_object import PostedDateObject
from domain.repository.i_posted_date_repository import IPostedDateRepository

# CQRS
# https://zenn.dev/ogakuzuko/scraps/b0bb89299e642e


class PostedDatesQueryService:
    """グチ投稿日のコレクションを取得するためのクエリサービス"""

    @inject
    def __init__(self, posted_date_repo: IPostedDateRepository):
        self.posted_date_repo = posted_date_repo

    def get_posted_dates(self, author_id: int, year: int, month: int) -> List[PostedDateObject]:
        """グチ投稿日の一覧を取得する

        Args:
            author_id (int): 投稿者ID
            year (int): 年
            month (int): 月
        Returns:
            List[PostedDateObject]: グチ投稿日のコレクション
        """

        return self.posted_date_repo.get_posted_dates(author_id, year, month)
