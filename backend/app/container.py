from injector import Injector

from utils.singleton import Singleton

from domain.repository.i_post_repository import IPostRepository
from domain.repository.i_posted_date_repository import IPostedDateRepository

from infrastructure.dynamodb.post_repository import PostRepository
from infrastructure.dynamodb.posted_date_repository import PostedDateRepository

# Injector Documentation
# https://injector.readthedocs.io/en/latest/api.html#injector.Injector.get
# https://qiita.com/Jazuma/items/9fa15b36f61f9d1e770c#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%A8%E5%85%B7%E8%B1%A1%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AE%E7%B4%90%E3%81%A5%E3%81%91%E3%82%92%E8%A8%98%E8%BF%B0%E3%81%99%E3%82%8B%E3%82%AF%E3%83%A9%E3%82%B9


class Container(Singleton):
    def __init__(self) -> None:
        self.injector = Injector(self.__class__.config)

    @classmethod
    def config(cls, binder):
        """インターフェースと実装を紐づける"""
        binder.bind(IPostRepository, PostRepository)
        binder.bind(IPostedDateRepository, PostedDateRepository)

    def resolve(self, interface):
        """指定したインターフェースに対応する実装を返す

        Args:
            interface (I_Repository): リポジトリのインターフェース

        Returns:
            Repository: リポジトリの実装
        """
        return self.injector.get(interface)
