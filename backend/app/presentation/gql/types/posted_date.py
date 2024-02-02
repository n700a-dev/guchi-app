import strawberry
from datetime import date

from domain.value_object.posted_date_object import PostedDateObject
from application.usecase.get_posted_dates import GetPostedDates
from application.usecase.get_posted_date import GetPostedDate
from presentation.gql.context import Info


@strawberry.type
class PostedDate:
    postedDate: str
    startOfDayMs: str  # グチ投稿日の0:00:00のunix秒 ... 32bitを超えるのでstrで受け取る
    endOfDayMs: str  # グチ投稿日の23:59:59.999のunix秒  ... 32bitを超えるのでstrで受け取る
    postCount: int
    updatedAtMs: str  # 該当する日付のグチが1件でも更新されたら、このupdated_at_msを更新する
    diffHour: int  # 時差

    @classmethod
    def to_posted_date_return(cls, pd: PostedDateObject):
        return cls(
            postedDate=pd.posted_date,
            startOfDayMs=pd.start_of_day_ms,
            endOfDayMs=pd.end_of_day_ms,
            postCount=pd.post_count,
            updatedAtMs=pd.updated_at_ms,
            diffHour=pd.diff_hour,
        )

    @classmethod
    async def get_posted_dates(cls, year: int, month: int, info: Info):
        author_id = info.context.current_user.id
        return list(map(lambda pd: cls.to_posted_date_return(pd), GetPostedDates(author_id).execute(year, month)))
    
    @classmethod
    def get_posted_date(cls, posted_date: str, info: Info):
        author_id = info.context.current_user.id
        pd = GetPostedDate(author_id).execute(posted_date)
        return cls.to_posted_date_return(pd)
