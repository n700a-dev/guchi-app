import boto3
import botocore
from abc import ABCMeta, abstractmethod

from domain.value_object.post_object import PostObject


class IPostedDateRepository(metaclass=ABCMeta):
    @abstractmethod
    def upsert(self, post: PostObject):
        raise NotImplementedError

    @abstractmethod
    def get_posted_dates(self, author_id: int, year: int, month: int):
        raise NotImplementedError
