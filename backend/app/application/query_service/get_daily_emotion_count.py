from datetime import date
from typing import List

from utils.datetime_handler import end_of_the_month, start_of_the_month, to_date_stamp
from application.usecase.base_usecase import BaseUseCase
from domain.value_object.daily_emotion_count import DailyEmotionCountObject
from domain.value_object.post_object import PostObject

from infrastructure.db.model.post_model import PostModel
from infrastructure.db.setting import session
from sqlalchemy import func


class GetDailyEmotionCounts(BaseUseCase):
    """日ごとの感情数を取得する。"""

    def __init__(self, author_id: int):
        self.author_id = author_id
        # self.posts_query_service = self.resolve(PostsQueryService)

    def execute(self, year: int, month: int) -> List[DailyEmotionCountObject]:
        print("取得する期間: ", year, month)
        print("start", start, "end", end)

        start = to_date_stamp(start_of_the_month(year, month))
        end = to_date_stamp(end_of_the_month(year, month))

        daily_counts = (
            session.query(PostModel.posted_date, PostModel.emotion, func.count().label('emotion_count'))
            .filter(PostModel.author_id == self.author_id)
            .filter(PostModel.posted_date.between(start, end))
            .group_by(PostModel.posted_date, PostModel.emotion)
            .order_by(PostModel.posted_date.asc())
            .all()
        )

        print("daily_counts", daily_counts)
        return [ DailyEmotionCountObject(
            posted_date=daily.posted_date,
            emotion=daily.emotion,
            emotion_count=daily.emotion_count,
        ) for daily in daily_counts]

