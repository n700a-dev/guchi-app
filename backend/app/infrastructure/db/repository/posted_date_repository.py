import datetime as dt
from typing import Optional

from domain.value_object.posted_date_object import PostedDateInputObject
from infrastructure.db.model.posted_date_model import PostedDateModel
from utils.datetime_handler import to_utc_ms

class PostedDateRepository:
    def __init__(self, session):
        self.session = session

    def __posted_date_scope(self, author_id: int, posted_date: str):
        return (
            self.session.query(PostedDateModel)
            .filter(PostedDateModel.author_id == author_id)
            .filter(PostedDateModel.posted_date == posted_date)
        )

    def get_by_posted_date(self, author_id: int, posted_date: str) -> PostedDateModel:
        return self.__posted_date_scope(author_id, posted_date).one()

    def find_by_posted_date(self, author_id: int, posted_date: str) -> PostedDateModel:
        return self.__posted_date_scope(author_id, posted_date).first()

    def create(self, posted_date: PostedDateInputObject):
        self.session.add(
            PostedDateModel(
                author_id=posted_date.author_id,
                start_of_day_ms=posted_date.start_of_day_ms,
                end_of_day_ms=posted_date.end_of_day_ms,
                posted_date=posted_date.posted_date,
                diff_hour=posted_date.diff_hour,
                post_count=1,
                updated_at_ms=to_utc_ms(dt.datetime.now()),
            ),
        )

    def update(self, existing_posted_date: PostedDateModel, post_count: Optional[int] = None):
        existing_posted_date.updated_at_ms = to_utc_ms(dt.datetime.now())
        if post_count:
            existing_posted_date.post_count = post_count

    def delete(self, existing_posted_date: PostedDateModel):
        self.session.delete(existing_posted_date)
