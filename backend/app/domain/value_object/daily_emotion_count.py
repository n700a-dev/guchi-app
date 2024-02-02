# PostEntityに代入するための値クラスを作る
# https://qiita.com/valusun/items/971c227d7f74c14d874b

from pydantic import BaseModel
from typing import Optional


class DailyEmotionCountObject(BaseModel):
    posted_date: str
    emotion: Optional[str]
    emotion_count: int

