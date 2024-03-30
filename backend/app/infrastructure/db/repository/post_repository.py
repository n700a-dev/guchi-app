import datetime as dt
from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime

from domain.value_object.post_object import PostCreateInputObject, PostDeleteInputObject, PostUpdateInputObject
from infrastructure.db.model.post_model import PostModel
from utils.datetime_handler import to_utc_ms

class PostRepository:
    def __init__(self, session):
        self.session = session

    def get_by_created_at_ms(self, author_id: int, created_at_ms: int) -> PostModel:
        return (
            self.session.query(PostModel)
            .filter(PostModel.author_id == author_id)
            .filter(PostModel.created_at_ms == created_at_ms)
            .one()
        )
    
    def create(self, author_id, post: PostCreateInputObject) -> PostModel:
        self.session.add(
            PostModel(
                author_id=author_id,
                uploaded_at_ms=post.created_at_ms,
                created_at_ms=post.created_at_ms,
                updated_at_ms=post.updated_at_ms,
                posted_date=to_date_stamp(utc_ms_to_datetime(post.created_at_ms, post.diff_hour)),
                diff_hour=post.diff_hour,
                text=post.text,
                emotion=post.emotion,
                image_url=post.image_url,
            ),
        )

    def update(self, existing_post: PostModel, post: PostUpdateInputObject):
        existing_post.text = post.text
        existing_post.emotion = post.emotion
        existing_post.image_url = post.image_url
        existing_post.updated_at_ms = to_utc_ms(dt.datetime.now())

    def delete(self, existing_post: PostModel) -> bool:
        self.session.delete(existing_post)
        return True
