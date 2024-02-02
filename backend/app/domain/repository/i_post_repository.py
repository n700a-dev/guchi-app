from datetime import date
from typing import List
from abc import ABCMeta, abstractmethod

from domain.value_object.post_object import PostObject, PostCreateInputObject


class IPostRepository(metaclass=ABCMeta):
    @abstractmethod
    def add(self, post: PostCreateInputObject):
        """グチを書き込む"""
        raise NotImplementedError

    @abstractmethod
    def get_daily_posts(self, author_id: int, target_date: date) -> List[PostObject]:
        """指定した日付のグチを取得する"""
        raise NotImplementedError
