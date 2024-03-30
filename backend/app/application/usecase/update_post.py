from application.usecase.base_usecase import BaseUseCase
from domain.value_object.post_object import PostUpdateInputObject
from domain.entity.post import PostEntity

from infrastructure.db.model.post_model import PostModel
from infrastructure.db.model.posted_date_model import PostedDateModel

class UpdatePost(BaseUseCase):
    """グチを新規追加する。"""

    def __init__(self):
        super().__init__()

    def _execute(self, author_id: int, post: PostUpdateInputObject) -> bool:
        return PostEntity(self.session).update(author_id, post)

