import typing

from starlette.requests import Request
from starlette.websockets import WebSocket
from strawberry.permission import BasePermission
from strawberry.types import Info

from domain.entity.user import UserModel

# NOTE: フロントでこのメッセージを見て判断するので、変更しないこと！
USER_NOT_AUTHENTICATED = "User not authenticated"


class IsAuthenticated(BasePermission):
    message = USER_NOT_AUTHENTICATED

    def has_permission(self, _source: typing.Any, info: Info, **kwargs) -> bool:
        current_user: typing.Union[UserModel, None] = info.context.current_user

        if current_user:
            return True

        return False
