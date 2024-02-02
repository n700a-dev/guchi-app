# PostEntityに代入するための値クラスを作る
# https://qiita.com/valusun/items/971c227d7f74c14d874b

from pydantic import BaseModel, Field
from typing import Optional
import re
import yaml

with open('./const.yaml','r') as file:
    validation = yaml.load(file, Loader=yaml.SafeLoader)["validation"]
    MAX_POST_TEXT_LENGTH = validation['post']["max_text_length"] 
    MAX_STRING_DEFAULT_LENGTH = validation['common']["max_string_default_length"]
    MIN_UNIX_MS = validation['common']["min_unix_ms"]
    MAX_UNIX_MS = validation['common']["max_unix_ms"]
    HOUR_24 = validation["common"]["hour_24"]
    DATE_FORMAT_REGEX = validation["common"]["date_format_regex"]



# 基底クラス
class BasePostObject(BaseModel):
    author_id: int
    text: Optional[str] = Field(None, max_length=MAX_POST_TEXT_LENGTH)
    emotion: Optional[str] = Field(None, max_lenght=MAX_STRING_DEFAULT_LENGTH)
    image_url: Optional[str] = Field(None, max_lenght=MAX_STRING_DEFAULT_LENGTH)
    created_at_ms: int = Field(..., ge=MIN_UNIX_MS, le=MAX_UNIX_MS)
    updated_at_ms: int = Field(..., ge=MIN_UNIX_MS, le=MAX_UNIX_MS)


# 出力用
class PostObject(BasePostObject):
    posted_date: str
    diff_hour: int
    uploaded_at_ms: int


# 入力用
class PostCreateInputObject(BasePostObject):
    diff_hour: int = Field(..., ge=-HOUR_24, le=HOUR_24)
    posted_date: str = Field(..., pattern=f"{DATE_FORMAT_REGEX}")

class PostUpdateInputObject(BasePostObject):
    pass

class PostDeleteInputObject(BaseModel):
    author_id: int
    created_at_ms: int
