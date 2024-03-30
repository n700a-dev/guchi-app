import datetime as dt

from utils.datetime_handler import end_of_the_day, start_of_the_day, to_date_stamp, to_utc_ms, utc_ms_to_datetime
from application.usecase.base_usecase import BaseUseCase
from domain.value_object.posted_date_object import PostedDateInputObject
from domain.value_object.post_object import PostDeleteInputObject, PostUpdateInputObject
from domain.entity.post import PostEntity

from infrastructure.db.model.posted_date_model import PostedDateModel
from infrastructure.db.model.post_model import PostModel

class DeletePost(BaseUseCase):
    """グチを新規追加する。"""

    def __init__(self):
        super().__init__()

    def _execute(self, author_id: int, post: PostDeleteInputObject) -> bool:
        return PostEntity(self.session).delete(author_id, post)

