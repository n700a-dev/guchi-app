# NOTE:
# タイムスタンプはISO 8601形式で扱う
# タイムゾーンはUTCで扱う
# https://en.wikipedia.org/wiki/ISO_8601

import datetime as dt
import time


COEF_MILLISEC = 1000  # [sec] -> [msec]


def start_of_the_day(target_date: dt.date) -> dt.datetime:
    """一日の始まりの時刻を返す
    Args:
        target_date (dt.date): 指定した日付
    Returns:
        dt.datetime: YYYY-MM-DDT00:00:00
    """
    return dt.datetime.combine(target_date, dt.time.min)


def end_of_the_day(target_date: dt.date) -> dt.datetime:
    """一日の終わりの時刻を返す
    Args:
        target_date (dt.date): 指定した日付
    Returns:
        dt.datetime: YYYY-MM-DDT23:59:59.999999
    """
    return dt.datetime.combine(target_date, dt.time.max)


def start_of_the_month(year: int, month: int) -> dt.date:
    """一月の始まりの日付を返す
    Args:
        target_date (dt.date): 指定した日付
    Returns:
        dt.date: YYYY-MM-01
    """

    M_MIN = 0
    M_MAX = 13

    if month < M_MIN or month > M_MAX:
        raise ValueError(f"month must be between #{M_MIN} and #{M_MAX}")

    # 翌年へ年越しの場合
    if month == 13:
        return dt.date(year + 1, 1, 1)

    # 前年へ年越しの場合
    if month == 0:
        return dt.date(year - 1, 12, 1)

    return dt.date(year, month, 1)


def end_of_the_month(year: int, month: int) -> dt.date:
    """一月の終わりの日付を返す
    Args:
        target_date (dt.date): 指定した日付
    Returns:
        dt.date: YYYY-MM-{END_OF_MONTH}
    """

    M_MIN = 1
    M_MAX = 12

    if month < M_MIN or month > M_MAX:
        raise ValueError(f"month must be between #{M_MIN} and #{M_MAX}")

    return start_of_the_month(year, month + 1) - dt.timedelta(days=1)


def convert_to_date(datetime: dt.datetime) -> dt.date:
    """datetimeをdateに変換する"""
    return dt.date(datetime.year, datetime.month, datetime.day)


def convert_to_utc_sec(datetime: dt.datetime) -> int:
    """datetimeをUTC秒に変換する"""
    return int(time.mktime(datetime.timetuple()))


def utc_ms_to_datetime(ms, diff_hour):
    """3桁のミリ秒単位のutc秒をdatetimeに変換する"""
    tzinfo = dt.timezone(dt.timedelta(hours=diff_hour))
    return dt.datetime.fromtimestamp(ms / float(COEF_MILLISEC), tz=tzinfo)


def to_date_stamp(datetime):
    """datetimeを日付文字列に変換する
    Args:
        datetime (dt.datetime): datetime
    Returns:
        str: YYYY-MM-DD
    """
    return datetime.strftime("%Y-%m-%d")


def to_utc_ms(datetime):
    """datetimeをUTCミリ秒に変換する
    Args:
        datetime (dt.datetime): datetime
    Returns:
        int: UTCミリ秒
    """
    return int(datetime.timestamp() * COEF_MILLISEC)
