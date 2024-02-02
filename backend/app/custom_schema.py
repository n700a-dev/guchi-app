from strawberry.schema import Schema
from strawberry.types import ExecutionContext
from strawberry.utils.logging import StrawberryLogger
from graphql import GraphQLError
from typing import List, Optional
import os

ENV = os.environ.get("ENV")

# 特定のエラーのみロギング
# https://qiita.com/nassy20/items/534ee5e069e2ed35d093

class CustomSchema(Schema):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def is_log_target_error(self, error) -> bool:
        return error.original_error.__class__.__name__ != "PermissionError"

    def process_errors(self, errors: List[GraphQLError], execution_context: Optional[ExecutionContext] = None):
        if ENV == "production":
            # 本番環境の場合、認可エラーのメッセージを無視する
            log_target_errors = [error for error in errors if self.is_log_target_error(error)]
        else:
            log_target_errors = errors
        
        for log_target_error in log_target_errors:
            StrawberryLogger.error(log_target_error, execution_context)