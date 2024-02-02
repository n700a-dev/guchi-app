from logging import handlers, StreamHandler, Formatter, INFO, DEBUG, getLogger
import os
import sys

ENV = os.environ.get("ENV")

#################### GraphQL ####################

STRAWBERRY_LOG = "strawberry.execution"  # ライブラリのログ名なので変えてはいけない
LOG_FILE_PATH = "/var/log/gunicorn/strawberry.log"
FORMAT = Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
# https://github.com/strawberry-graphql/strawberry/blob/5b92d5638b44f7886f042e7da2e3680c92ceafb9/strawberry/utils/logging.py#L14-L17
strawberry_logger = getLogger(STRAWBERRY_LOG)

if ENV == "production":
    rotating_file_handler = handlers.RotatingFileHandler(
        LOG_FILE_PATH, mode="a", encoding="utf-8", maxBytes=10000, backupCount=10, delay=False
    )
    rotating_file_handler.setFormatter(FORMAT)
    strawberry_logger.addHandler(rotating_file_handler)
    strawberry_logger.setLevel(INFO)
else:
    stream_handler = StreamHandler(sys.stdout)
    strawberry_logger.addHandler(stream_handler)
    strawberry_logger.setLevel(DEBUG)


#################### FastAPI ####################

FASTAPI_LOG = "fastapi"
fastapi_logger = getLogger(FASTAPI_LOG)
LOG_FILE_PATH = "/var/log/gunicorn/fastapi.log"
FORMAT = Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")


if ENV == "production":
    rotating_file_handler = handlers.RotatingFileHandler(
        LOG_FILE_PATH, mode="a", encoding="utf-8", maxBytes=10000, backupCount=10, delay=False
    )
    rotating_file_handler.setFormatter(FORMAT)
    fastapi_logger.addHandler(rotating_file_handler)
    fastapi_logger.setLevel(INFO)
else:
    fastapi_logger.setLevel(DEBUG)


#################### HTTP Request ####################

REQUEST_LOG = "request"
request_logger = getLogger(REQUEST_LOG)
LOG_FILE_PATH = "/var/log/gunicorn/request.log"
FORMAT = Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

if ENV == "production":
    rotating_file_handler = handlers.RotatingFileHandler(
        LOG_FILE_PATH, mode="a", encoding="utf-8", maxBytes=10000, backupCount=10, delay=False
    )

    rotating_file_handler.setFormatter(FORMAT)
    request_logger.addHandler(rotating_file_handler)
    request_logger.setLevel(INFO)
