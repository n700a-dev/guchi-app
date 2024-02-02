import datetime as dt
import yaml

from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime
from application.usecase.base_usecase import BaseUseCase
from domain.entity.post_repo import PostRepository
from domain.value_object.posted_date_object import PostedDateInputObject
from domain.value_object.post_object import PostCreateInputObject
from domain.entity.post import PostEntity
from domain.entity.posted_date_repo import PostedDateRepository

with open('./const.yaml','r') as file:
    MAX_REMOTE_DAILY_POST_COUNT = yaml.load(file, Loader=yaml.SafeLoader)["validation"]["post"]["max_remote_daily_post_count"]

class CreatePost(BaseUseCase):
    """グチを新規追加する。"""

    def __init__(self, session, author_id: int):
        self.author_id = author_id
        self.session = session
        # self.post_entity = self.resolve(PostEntity)

    def execute(self, post: PostCreateInputObject) -> bool:

        post_created_at = utc_ms_to_datetime(post.created_at_ms, post.diff_hour)
        posted_date = PostedDateInputObject(
            author_id=post.author_id,
            start_of_day_ms=to_utc_ms(start_of_the_day(post_created_at)),
            end_of_day_ms=to_utc_ms(end_of_the_day(post_created_at)),
            posted_date=to_date_stamp(post_created_at),
            diff_hour=post.diff_hour,
        )
        
        try:
            self.session.add(
                PostRepository(
                    author_id=post.author_id,
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

            existing_posted_date = (
                self.session.query(PostedDateRepository)
                .filter(PostedDateRepository.author_id == self.author_id)
                .filter(PostedDateRepository.posted_date == posted_date.posted_date)
                .first()
            )

            # もし本日の日付があれば update する
            if existing_posted_date:
                if (existing_posted_date.post_count >= MAX_REMOTE_DAILY_POST_COUNT):
                    raise RuntimeError(f"一日の投稿上限数: {MAX_REMOTE_DAILY_POST_COUNT}を超過しました")

                existing_posted_date.post_count += 1
                existing_posted_date.updated_at_ms = to_utc_ms(dt.datetime.now())

            # もし本日の日付がなければ insert する
            else:
                self.session.add(
                    PostedDateRepository(
                        author_id=posted_date.author_id,
                        start_of_day_ms=posted_date.start_of_day_ms,
                        end_of_day_ms=posted_date.end_of_day_ms,
                        posted_date=posted_date.posted_date,
                        diff_hour=posted_date.diff_hour,
                        post_count=1,
                        updated_at_ms=to_utc_ms(dt.datetime.now()),
                    ),
                )
            self.session.commit()
            return True

        except Exception as e:
            self.session.rollback()
            print(e)
            return False
