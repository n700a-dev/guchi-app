import datetime as dt
import yaml
from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime

from domain.repository.i_post_repository import IPostRepository
from domain.repository.i_posted_date_repository import IPostedDateRepository
from domain.value_object.posted_date_object import PostedDateInputObject


from infrastructure.db.repository.posted_date_repository import PostedDateRepository
from infrastructure.db.model.posted_date_model import PostedDateModel

# from injector import inject

with open('./const.yaml','r') as file:
    MAX_REMOTE_DAILY_POST_COUNT = yaml.load(file, Loader=yaml.SafeLoader)["validation"]["post"]["max_remote_daily_post_count"]


class PostedDateEntity:
    """グチのエンティティ"""

    def __init__(self, session):
        self.session = session
    
    def increment(self, author_id: int, posted_date: PostedDateInputObject):
        """グチの投稿日を新規追加する"""

        existing_posted_date = PostedDateRepository(self.session).find_by_posted_date(
            author_id=author_id,
            posted_date=posted_date.posted_date
        )

        if existing_posted_date:
            if (existing_posted_date.post_count >= MAX_REMOTE_DAILY_POST_COUNT):
                raise RuntimeError(f"一日の投稿上限数: {MAX_REMOTE_DAILY_POST_COUNT}を超過しました")

            PostedDateRepository(self.session).update(existing_posted_date, post_count=existing_posted_date.post_count + 1)

        # もし本日の日付がなければ insert する
        else:
            PostedDateRepository(self.session).create(posted_date)

        return True

    def update(self, author_id: int, posted_date: str):
        """グチの投稿日を更新する"""

        existing_posted_date = PostedDateRepository(self.session).get_by_posted_date(author_id=author_id, posted_date=posted_date)

        PostedDateRepository(self.session).update(existing_posted_date)

        return True

    def decrement(self, author_id: int, posted_date: str):
        existing_posted_date = PostedDateRepository(self.session).get_by_posted_date(author_id=author_id, posted_date=posted_date)

        if existing_posted_date.post_count == 1:
            PostedDateRepository(self.session).delete(existing_posted_date)
        else:
            PostedDateRepository(self.session).update(existing_posted_date, post_count=existing_posted_date.post_count - 1)
        return True
