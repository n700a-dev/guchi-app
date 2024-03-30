from abc import ABCMeta, abstractmethod

# DI Container
from container import Container

from infrastructure.db.setting import session

from logging import getLogger
from utils.my_logger import FASTAPI_LOG

fastapi_logger = getLogger(FASTAPI_LOG)

class BaseQueryService(metaclass=ABCMeta):
    """DDDのQueryServiceレイヤー

    QueryServiceレイヤーは、アクターがエンティティに対して行うアクションを明示します。
    全てのQueryServiceは、このクラスを継承する必要があります。
    """

    def __init__(self):
        self.session = session

    @abstractmethod
    def _execute(self):
        raise NotImplementedError

    def execute(self, *args, **kwargs):
        return self._execute(*args, **kwargs)

    def resolve(self, interface):
        """指定したインターフェースに対応する実装を返す

        Args:
            interface (I_Repository): リポジトリのインターフェース

        Returns:
            Repository: リポジトリの実装
        """
        return Container().resolve(interface)
