# PostEntityに代入するための値クラスを作る
# https://qiita.com/valusun/items/971c227d7f74c14d874b

from pydantic import BaseModel, Field
import yaml

with open('./const.yaml','r') as file:
    validation = yaml.load(file, Loader=yaml.SafeLoader)["validation"]
    MIN_UNIX_MS = validation['common']["min_unix_ms"]
    MAX_UNIX_MS = validation['common']["max_unix_ms"]
    HOUR_24 = validation["common"]["hour_24"]
    DATE_FORMAT_REGEX = validation["common"]["date_format_regex"]



# 基底クラス
class BasePostedDateObject(BaseModel):
    author_id: int
    posted_date: str = Field(..., pattern=f"{DATE_FORMAT_REGEX}")
    diff_hour: int = Field(..., ge=-HOUR_24, le=HOUR_24)
    start_of_day_ms: int = Field(..., ge=MIN_UNIX_MS, le=MAX_UNIX_MS)
    end_of_day_ms: int = Field(..., ge=MIN_UNIX_MS, le=MAX_UNIX_MS)


# 出力用
class PostedDateObject(BasePostedDateObject):
    updated_at_ms: int
    post_count: int


# 入力用
class PostedDateInputObject(BasePostedDateObject):
    pass
