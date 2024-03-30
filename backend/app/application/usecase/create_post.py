from application.usecase.base_usecase import BaseUseCase
from domain.value_object.post_object import PostCreateInputObject
from domain.entity.post import PostEntity


class CreatePost(BaseUseCase):
    """グチを新規追加する。"""

    def __init__(self):
        super().__init__()
        # self.post_entity = self.resolve(PostEntity)

    def _execute(self, author_id, post: PostCreateInputObject) -> bool:        
        return PostEntity(self.session).create(author_id, post)
