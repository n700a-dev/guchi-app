const dayOfWeekStr = (date: Date) => ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

/**
 * @description 指定した日付の月初日の日付を取得する
 */
export const getStartDayOfMonth = ({ year, month }: { year: number; month: number }) => {
  return new Date(year, month - 1, 1);
};

/**
 * @description 指定した日付の月末日の日付を取得する
 */
export const getEndDayOfMonth = ({ year, month }: { year: number; month: number }) => {
  return new Date(year, month - 1 + 1, 0); // JSは月が0始まりなので、month-1+1で次の月の0日目を指定すると、今月の末日を取得できる
};

/**
 * @description 指定した日付の月を取得する
 */
export const getThisMonth = (targetDate: Date) => {
  return targetDate.getMonth() + 1;
};

/**
 * @description 指定した日付の年を取得する
 */
export const getThisYear = (targetDate: Date) => {
  return targetDate.getFullYear();
};

/**
 * @description 指定した日付の0:00:00.000Dateオブジェクトを返す
 */
export const getBeginningOfTheDay = (targetDate: Date) => {
  const newDate = new Date(targetDate);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * @description 指定した日付の23:59:59.999のDateオブジェクトを返す
 */
export const getEndOfTheDay = (targetDate: Date) => {
  const newDate = new Date(targetDate);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * @description 指定した日付の翌日を返す
 */
export const getNextDay = (targetDate: Date) => {
  const newDate = new Date(targetDate);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

/**
 * 日付が同じか判定する（時刻は無視）
 * @param date 対象日付
 */
export const isSameDate = (date1: Date, date2: Date) => {
  if (date1.getFullYear() !== date2.getFullYear()) return false;
  if (date1.getMonth() !== date2.getMonth()) return false;
  if (date1.getDate() !== date2.getDate()) return false;
  return true;
};

/**
 * 日付を返却する
 * @param date 対象日付
 * @returns string YYYY/MM/DD(曜日)
 */
export const getDateString = (date: Date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} (${dayOfWeekStr(date)})`;
};

/**
 * ミリ秒単位のunix時間を返却する
 * @param datetime 対象日付
 * @returns 123456879
 */
export const getUnixMs = (datetime: Date) => {
  return datetime.valueOf();
};

/**
 * y, m, dを指定してDateオブジェクトを返却する
 */
export const ymdToDate = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day);
};

/**
 * 標準時からの時差を時間単位で返却する
 */
export const getTimezoneDiffHour = () => {
  // NOTE: getTimezoneOffset() メソッドは、（ホストシステム上における）現在のロケールから協定世界時 (UTC) までのタイムゾーンの差を分単位で返します。
  const localToUTC = new Date().getTimezoneOffset() / 60;
  return -localToUTC;
};

/**
 * @desc Returns date with time set to 00:00:00
 * @param date
 * @returns "2023-1-10"
 */
export const getDatehyphenatedString = (date: Date) => {
  // TODO: 不安な実装をしているので、この関数は削除する
  // NOTE: 現地時刻を基準とする
  return `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${('00' + date.getDate()).slice(-2)}`;
};
