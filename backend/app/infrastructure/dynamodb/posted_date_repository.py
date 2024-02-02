import botocore
from typing import List
import time
import datetime as dt
from utils.datetime_handler import convert_to_utc_sec, start_of_the_month, convert_to_date

from domain.repository.i_posted_date_repository import IPostedDateRepository
from domain.value_object.posted_date_object import PostedDateObject
from infrastructure.dynamodb.base_repository import BaseRepository

# TODO: ミリ秒の扱いを決める
ISO_FORMAT = "%Y-%m-%dT%H:%M:%S"


class PostedDateRepository(IPostedDateRepository, BaseRepository):
    """application層のRepositoryInterfaceを継承し、処理の実装を行うクラス"""

    TABLE_NAME = "postedDates"

    def __init__(self):
        super().__init__()
        self.table = self.resource.Table(self.TABLE_NAME)

    def upsert(self, post: PostedDateObject):
        """グチ投稿日を登録する"""

        created_at = dt.datetime.strptime(post.created_at, ISO_FORMAT)

        self.table.put_item(
            Item={
                "authorId": post.author_id,
                "postedDate": convert_to_date(created_at).isoformat(),
                # TODO: フロントエンドと一致しないため、同期方法を考える
                "updatedSec": convert_to_utc_sec(created_at),
                "postCount": self.__get_post_count(post.author_id, created_at),
            }
        )

    def get_posted_dates(self, author_id: int, year: int, month: int) -> List[PostedDateObject]:
        """指定した日付のグチを取得する"""

        this_month = start_of_the_month(year, month)
        next_month = start_of_the_month(year, month + 1)

        ## TODO: 取得処理を書く
        response = self.table.query(
            KeyConditionExpression="authorId = :authorId AND postedDate BETWEEN :start AND :end",
            ExpressionAttributeValues={
                ":authorId": author_id,
                ":start": this_month.isoformat(),
                ":end": next_month.isoformat(),
            },
        )

        items = response.get("Items")

        posted_dates_collection = list(
            map(
                lambda item: PostedDateObject(
                    author_id=item["authorId"],
                    posted_date=item["postedDate"],
                    post_count=item["postCount"],
                    updated_sec=item["updatedSec"],
                ),
                items,
            )
        )

        return posted_dates_collection

    def __get_post_count(self, author_id, created_at):
        """指定した日付のグチの数を取得する"""

        # TODO: 取得処理を書く
        return -1
