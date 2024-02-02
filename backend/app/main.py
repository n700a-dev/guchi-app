import time
from logging import getLogger
import logging
import sys


# GraphQL
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import Depends, FastAPI, HTTPException, status, Request
from starlette.middleware.cors import CORSMiddleware
from custom_schema import CustomSchema

# Logger
from utils.my_logger import FASTAPI_LOG, REQUEST_LOG, STRAWBERRY_LOG

# Security
from fastapi.security import OAuth2PasswordRequestForm
from auth import *

# Google OAuth
import google_oauth2

# DI
from container import Container

from presentation.gql.context import get_context
from presentation.gql.schema import Query, Mutation


ENV = os.environ.get("ENV")

schema = CustomSchema(query=Query, mutation=Mutation)

graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
)


# Logger
strawberry_logger = logging.getLogger(STRAWBERRY_LOG)
fastapi_logger = logging.getLogger(FASTAPI_LOG)
request_logger = logging.getLogger(REQUEST_LOG)


def create_app() -> FastAPI:
    app = FastAPI()
    container = Container()
    app.container = container
    if ENV == "production":
        strawberry_logger.info("start server")
        fastapi_logger.info("start server")
    return app


app = create_app()

# CORS
# https://qiita.com/satto_sann/items/0e1f5dbbe62efc612a78
# https://github.com/strawberry-graphql/strawberry/issues/1942#issuecomment-1146789802
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# graphql_endpoint
app.include_router(graphql_app, prefix="/graphql")
app.add_websocket_route("/graphql", graphql_app)
app.include_router(google_oauth2.router, prefix="/oauth2")


@app.middleware("http")
async def before_action(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    request_logger.info(f"{process_time:.3f}[sec], {response.status_code}, {str(request.url)}")
    return response


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        username = form_data.username
        password = form_data.password
        user = authenticate_user(username, password)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(user)
        return {"access_token": access_token, "token_type": BARERE}
    except Exception as e:
        fastapi_logger.exception(e)
        raise e
