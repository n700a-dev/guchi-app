import datetime as dt
import yaml
from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime

from domain.value_object.post_object import PostUpdateInputObject
from domain.repository.i_post_repository import IPostRepository
from domain.repository.i_posted_date_repository import IPostedDateRepository
from domain.value_object.posted_date_object import PostedDateInputObject
from domain.entity.posted_date import PostedDateEntity

from infrastructure.db.repository.post_repository import PostRepository
from infrastructure.db.repository.posted_date_repository import PostedDateRepository

from infrastructure.db.model.posted_date_model import PostedDateModel
from infrastructure.db.model.post_model import PostModel

# from injector import inject


class PostEntity:
    """グチのエンティティ"""

    def __init__(self, session):
        self.session = session
    
    def create(self, author_id: int, post: PostUpdateInputObject):
        """グチを新規追加する"""

        PostRepository(self.session).create(author_id, post)

        post_created_at = utc_ms_to_datetime(post.created_at_ms, post.diff_hour)
        posted_date = PostedDateInputObject(
            author_id=post.author_id,
            start_of_day_ms=to_utc_ms(start_of_the_day(post_created_at)),
            end_of_day_ms=to_utc_ms(end_of_the_day(post_created_at)),
            posted_date=to_date_stamp(post_created_at),
            diff_hour=post.diff_hour,
        )

        PostedDateEntity(self.session).increment(author_id, posted_date)

        return True

    def update(self, author_id: int, post: PostUpdateInputObject):
        """グチを更新する"""

        # 既存の投稿を取得
        existing_post = PostRepository(self.session).get_by_created_at_ms(author_id=author_id, created_at_ms=post.created_at_ms)

        # 既存の投稿を更新
        PostRepository(self.session).update(existing_post, post)

        # 集約内のエンティティを更新
        PostedDateEntity(self.session).update(author_id, existing_post.posted_date)

        return True

    def delete(self, author_id: int, post: PostUpdateInputObject):
        # 既存の投稿を取得
        existing_post = PostRepository(self.session).get_by_created_at_ms(author_id=author_id, created_at_ms=post.created_at_ms)

        # 既存の投稿を更新
        PostRepository(self.session).delete(existing_post)

        # 集約内のエンティティを更新
        PostedDateEntity(self.session).decrement(author_id, existing_post.posted_date)

        return True
