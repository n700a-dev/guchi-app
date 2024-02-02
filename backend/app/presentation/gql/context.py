import strawberry
from strawberry.types import Info as _Info
from strawberry.types.info import RootValueType
from strawberry.fastapi import BaseContext

from typing import Optional

from functools import cached_property
from utils.my_logger import strawberry_logger
from auth import get_current_user_from_token
from domain.entity.user import UserModel


class Context(BaseContext):
    @cached_property
    def current_user(self) -> Optional[UserModel]:
        try:
            if not self.request:
                return None
            authorization = self.request.headers.get("Authorization", None)
            if not authorization:
                return None
            return get_current_user_from_token(authorization)
        except Exception as e:
            strawberry_logger.exception(e)
            return None


Info = _Info[Context, RootValueType]


async def get_context() -> Context:
    return Context()
