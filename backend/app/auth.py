import os
from logging import getLogger
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from typing import Union
from pydantic import BaseModel

from datetime import datetime, timedelta

import cypher

from domain.entity.user import UserModel
from infrastructure.db.setting import session

from utils.my_logger import FASTAPI_LOG

fastapi_logger = getLogger(FASTAPI_LOG)

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])
BARERE: str = "bearer"

pwd_context = CryptContext(schemes=["****"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


def from_authorization(authorization: str) -> Token:
    token = authorization.split("Bearer ")[1]
    return Token(access_token=token, token_type=BARERE)


class TokenData(BaseModel):
    id: int


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(nickname: str, password: str):
    """ユーザー認証する

    Args:
        nickname (str): ユーザー名
        password (str): パスワード

    Returns:
        User or None: 認証成功した場合はユーザーを返却する
    """

    try:
        user = ******
        if not verify_password(password, user.password):
            return None
        return user
    except Exception as e:
        fastapi_logger.exception(e)
        return None


def create_access_token(user: UserModel) -> str:
    if user.id is None:
        raise HTTPException(status_code=400, detail="Inavalid user (No id)")

    try:
        data = {*****}  # *****部分はコードを隠ぺいしています
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = data.copy()
        to_encode.update(*****)
        encoded_jwt = cypher.encode(to_encode)
        return encoded_jwt
    except Exception:
        raise HTTPException(status_code=400, detail="Inavalid user (Failed to create credentials)")


def get_current_user_from_token(authorization: str) -> UserModel:
    try:
        token = from_authorization(authorization).access_token
        payload = cypher.decode(token)
        id: str = payload.get(*****)
        if id is None:
            raise_credentials_exception()
    except Exception:
        raise_credentials_exception()

    user = session.query(UserModel).*****
    if user is None:
        raise_credentials_exception()
    if user.expired_at:
        raise HTTPException(status_code=400, detail="Invalid user (Expired)")

    return user


def raise_credentials_exception():
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
