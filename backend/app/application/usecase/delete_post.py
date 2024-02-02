import datetime as dt

from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime
from application.usecase.base_usecase import BaseUseCase
from domain.entity.post_repo import PostRepository
from domain.value_object.posted_date_object import PostedDateInputObject
from domain.value_object.post_object import PostDeleteInputObject, PostUpdateInputObject
from domain.entity.post import PostEntity
from domain.entity.posted_date_repo import PostedDateRepository


class DeletePost(BaseUseCase):
    """グチを新規追加する。"""

    def __init__(self, session, author_id: int):
        self.author_id = author_id
        self.session = session

    def execute(self, post: PostDeleteInputObject) -> bool:
        try:
            existing_post = (
                self.session.query(PostRepository)
                .filter(PostRepository.author_id == self.author_id)
                .filter(PostRepository.created_at_ms == post.created_at_ms)
                .one()
            )

            if not existing_post:
                raise Exception("post not found")

            existing_posted_date = (
                self.session.query(PostedDateRepository)
                .filter(PostedDateRepository.author_id == self.author_id)
                .filter(PostedDateRepository.posted_date == existing_post.posted_date)
                .one()
            )

            if not existing_post:
                raise Exception("posted date not found")

            self.session.delete(existing_post)

            if existing_posted_date.post_count == 1:
                self.session.delete(existing_posted_date)
            else:
                existing_posted_date.post_count = existing_posted_date.post_count - 1
                existing_posted_date.updated_at_ms = to_utc_ms(dt.datetime.now())

            self.session.commit()
            return True

        except Exception as e:
            self.session.rollback()
            print(e)
            return False
