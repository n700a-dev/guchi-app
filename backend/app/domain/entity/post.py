from domain.value_object.post_object import PostCreateInputObject
from domain.repository.i_post_repository import IPostRepository
from domain.repository.i_posted_date_repository import IPostedDateRepository

from injector import inject


class PostEntity:
    """グチのエンティティ"""

    @inject
    def __init__(self, post_repo: IPostRepository, posted_date_repo: IPostedDateRepository):
        self.post_repo = post_repo
        self.posted_date_repo = posted_date_repo

    def add(self, post: PostCreateInputObject):
        """グチを投稿する"""

        self.post_repo.add(post)
        self.posted_date_repo.upsert(post)
        return True
