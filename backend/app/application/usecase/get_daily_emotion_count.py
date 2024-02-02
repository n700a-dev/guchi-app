from datetime import date
from typing import List

from utils.datetime_handler import end_of_the_month, start_of_the_month, to_date_stamp
from application.usecase.base_usecase import BaseUseCase
from domain.value_object.daily_emotion_count import DailyEmotionCountObject
from domain.entity.post_repo import PostRepository
from domain.value_object.post_object import PostObject

from infrastructure.db.setting import session
from sqlalchemy import func


class GetDailyEmotionCounts(BaseUseCase):
    """日ごとの感情数を取得する。"""

    def __init__(self, author_id: int):
        self.author_id = author_id
        # self.posts_query_service = self.resolve(PostsQueryService)

    def execute(self, year: int, month: int) -> List[DailyEmotionCountObject]:
        print("取得する期間: ", year, month)

        start = to_date_stamp(start_of_the_month(year, month))
        end = to_date_stamp(end_of_the_month(year, month))

        daily_counts = (
            session.query(PostRepository.posted_date, PostRepository.emotion, func.count().label('emotion_count'))
            .filter(PostRepository.author_id == self.author_id)
            .filter(PostRepository.posted_date.between(start, end))
            .group_by(PostRepository.posted_date, PostRepository.emotion)
            .order_by(PostRepository.posted_date.asc())
            .all()
        )

        return [ DailyEmotionCountObject(
            posted_date=daily.posted_date,
            emotion=daily.emotion,
            emotion_count=daily.emotion_count,
        ) for daily in daily_counts]

