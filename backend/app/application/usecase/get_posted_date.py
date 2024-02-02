from datetime import date
from typing import List


from domain.value_object.posted_date_object import PostedDateObject
from domain.entity.posted_date_repo import PostedDateRepository
from application.usecase.base_usecase import BaseUseCase

from infrastructure.db.setting import session

from utils.datetime_handler import end_of_the_month, start_of_the_month, to_date_stamp


class GetPostedDate(BaseUseCase):
    """グチをつぶやいた日一覧を取得する"""

    def __init__(self, author_id: int):
        self.author_id = author_id
        # self.posted_dates_query_service = self.resolve(PostedDatesQueryService)

    def execute(self, posted_date: str) -> PostedDateObject:
        # return self.posted_dates_query_service.get_posted_dates(self.author_id, self.year, self.month)

        pd = (
            session.query(PostedDateRepository)
            .filter(PostedDateRepository.author_id == self.author_id)
            .filter(
                PostedDateRepository.posted_date == posted_date
            )
            .one()
        )

        return PostedDateObject(
            author_id=pd.author_id,
            posted_date=pd.posted_date,
            diff_hour=pd.diff_hour,
            post_count=pd.post_count,
            start_of_day_ms=pd.start_of_day_ms,
            end_of_day_ms=pd.end_of_day_ms,
            updated_at_ms=pd.updated_at_ms,
        )
