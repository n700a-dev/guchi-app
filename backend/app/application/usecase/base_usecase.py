from abc import ABCMeta, abstractmethod

# DI Container
from container import Container


class BaseUseCase(metaclass=ABCMeta):
    """DDDのUseCaseレイヤー

    UseCaseレイヤーは、アクターがエンティティに対して行うアクションを明示します。
    全てのUseCaseは、このクラスを継承する必要があります。
    """

    @abstractmethod
    def __init__(self):
        raise NotImplementedError

    @abstractmethod
    def execute(self):
        raise NotImplementedError

    def resolve(self, interface):
        """指定したインターフェースに対応する実装を返す

        Args:
            interface (I_Repository): リポジトリのインターフェース

        Returns:
            Repository: リポジトリの実装
        """
        return Container().resolve(interface)
