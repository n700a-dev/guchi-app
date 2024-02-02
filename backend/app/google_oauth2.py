from fastapi import APIRouter, Request, Depends, HTTPException, status, Query
from fastapi.security import OAuth2AuthorizationCodeBearer
from logging import getLogger
import httpx
import os
import datetime as dt

import cypher
from auth import BARERE, create_access_token
from utils.my_logger import FASTAPI_LOG

from domain.entity.user import UserModel
from infrastructure.db.setting import session

fastapi_logger = getLogger(FASTAPI_LOG)

router = APIRouter()

CLIENT_ID = os.getenv("*****")
CLIENT_SECRET = os.getenv("*****")
REDIRECT_URI = os.getenv("*****")
CHALLENGE_TOKEN_EXPIRE_MINUTES = int(os.environ["CHALLENGE_TOKEN_EXPIRE_MINUTES"])
AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


oauth2_scheme = OAuth2AuthorizationCodeBearer(authorizationUrl=AUTHORIZATION_URL, tokenUrl=TOKEN_URL)


@router.get("/login_info/")
def login_info(request: Request):
    try:
        oauth_url = (
            f"{AUTHORIZATION_URL}?response_type=code&client_id={CLIENT_ID}&"
            + f"redirect_uri={REDIRECT_URI}&scope=openid%20email%20profile&"
            + f"access_type=offline&prompt=consent"
        )

        expired_at = dt.datetime.utcnow() + dt.timedelta(minutes=CHALLENGE_TOKEN_EXPIRE_MINUTES)
        plain_token = {*****}
        challenge_token = cypher.encode(plain_token)

        fastapi_logger.debug(oauth_url)
        return {"oauth_url": oauth_url, "challenge_token": challenge_token}
    except Exception as e:
        fastapi_logger.exception(e)
        raise e


@router.post("/login/callback")
async def login_callback(code: str, challenge_token: str):
    try:
        validate_challenge_token(challenge_token)
        token_response_json = authorize_user(code)
        userinfo = get_user_info(*****)

        identifier = userinfo.get(*****)
        email = userinfo.get("email")
        name = userinfo.get("name")
        provider = "google"

        # https://www.sukerou.com/2018/12/sqlalchemy-onefirst.html
        user = active_user_filter(identifier=identifier, provider=provider).one_or_none()

        if not user:
            create_user(identifier=identifier, email=email, nickname=name, provider=provider)
            user = active_user_filter(identifier=identifier, provider=provider).one()

        access_token = create_access_token(user)
        return {"access_token": access_token, "token_type": BARERE}
    except Exception as e:
        fastapi_logger.exception(e)
        raise e


def active_user_filter(identifier, provider):
    """有効なユーザーの条件"""
    scope = (
        session.query(UserModel)
        .filter(UserModel.identifier == identifier)
        .filter(*****)
        .filter(*****)
    )
    return scope


def create_user(identifier, provider, email, nickname):
    """ユーザーを新規作成する"""
    try:
        user = UserModel(identifier=identifier, email=email, nickname=nickname, provider=provider)
        session.add(user)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e


def validate_challenge_token(challenge_token):
    """PKCE対策のため認証する"""
    try:
        plain_token = cypher.decode(challenge_token)

        expiration = dt.datetime.fromtimestamp(*****)
        if expiration < dt.datetime.now():
            fastapi_logger.warn("challenge_tokenの期限切れ")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="challenge_token is invalid",
            )
    except Exception as e:
        fastapi_logger.warn("challenge_token周りのエラー")
        fastapi_logger.warn(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="challenge_token is invalid",
        )


def authorize_user(code):
    """認証リクエスト"""
    with httpx.Client() as client:
        token_response = client.post(
            TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": REDIRECT_URI,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
            },
        )

    token_response_json = token_response.json()
    if token_response.is_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=token_response_json,
        )

    return token_response_json


def get_user_info(access_token):
    """認証ユーザー情報の取得"""
    with httpx.Client() as client:
        userinfo_response = client.get(f"{USER_INFO_URL}?access_token={access_token}")

    userinfo = userinfo_response.json()
    if userinfo_response.is_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=userinfo,
        )

    return userinfo


# PKCE
# https://blog.p1ass.com/posts/oauth-2-for-browser-apps/
# https://qiita.com/ist-n-m/items/992c67b803ff460818ec

# https://stackoverflow.com/questions/16501895/how-do-i-get-user-profile-using-google-access-token
# https://www.oauth.com/oauth2-servers/signing-in-with-google/verifying-the-user-info/ ☆

# Google ID トークンからユーザー情報を取得する
# https://developers.google.com/identity/openid-connect/openid-connect?hl=ja#obtainuserinfo
