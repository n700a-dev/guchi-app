import { getDatehyphenatedString } from '../../utils/datetime';
import {
  getBeginningOfTheDay,
  getEndOfTheDay,
  getStartDayOfMonth,
  getTimezoneDiffHour,
  getUnixMs,
} from '../../utils/datetime';
import { db } from '../../utils/db';
import { TYearMonth, nextMonth } from '../hooks/useThisMonth';
import { TPostInput } from '../new/page';

/**
 * @desc 指定した文字列でアラートを表示し、エラーを投げる
 * @param message: string
 */
const alertAndThrow = (message: string) => {
  alert(`エラー: ${message}`);
  throw new Error(`エラー: ${message}`);
};

/**
 * @desc postテーブルのレコード総数を取得する
 * @returns number
 */
export const getPostCountDB = async () => {
  return await db.posts.count();
};

/**
 * @desc postテーブルの最初のレコードを取得する
 */
export const getFirstPostDB = async () => {
  return await db.posts.orderBy('createdAtMs').first();
};

/**
 * @desc 指定した日付におけるpostテーブルのレコード数を取得する
 * @param post: TPost
 * @returns undefined
 */
export const getDailyPostCountDB = async (date: Date) => {
  return await db.postedDates
    .where('postedDate')
    .equals(getDatehyphenatedString(date))
    .first()
    .then((p) => p?.postCount || 0); // 本日のグチ投稿数を取得
};

/**
 * @desc 指定した日付におけるpostテーブルのレコードを取得する
 * @param post: Date
 * @returns IpostDB[]
 */
export const getDailyPostsDB = async (targetDate: string) => {
  return await db.posts.where('postedDate').equals(targetDate).reverse().toArray();
};

export const doTransactionDB = async (callback: () => void) => {
  db.transaction('rw', [db.posts, db.postedDates], async () => {
    await callback();
  })
    .then(() => {
      // console.log('transction is success.');
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @desc DBにグチを新規追加する
 * @param post: TPost
 * @param customNow: Date 投稿日時を指定したい場合に使用する
 * @returns undefined
 */
export const insertPostDB = async (post: TPostInput, customNow?: Date) => {
  await doTransactionDB(async () => {
    const now = customNow ?? new Date();
    await db.posts.add({
      uploadedAtMs: undefined,
      createdAtMs: getUnixMs(now),
      updatedAtMs: getUnixMs(now),
      diffHour: getTimezoneDiffHour(),
      postedDate: getDatehyphenatedString(now),
      text: post.text,
      emotion: post.emotion,
      imageBase64: post.imageBase64,
      imageUrl: undefined,
      createdAt: now, // deprecated
    });

    // グチ投稿日および、その日の投稿数を更新
    const postCount = await getDailyPostCountDB(now);
    await db.postedDates.put({
      postedDate: getDatehyphenatedString(now),
      postCount: postCount + 1,
      startOfDayMs: getUnixMs(getBeginningOfTheDay(now)),
      endOfDayMs: getUnixMs(getEndOfTheDay(now)),
      updatedAtMs: getUnixMs(now),
      diffHour: getTimezoneDiffHour(),
    });
  });
};

/**
 * @desc DBに保存されたグチを更新する
 */
export const updatePostDB = async (createdAtMs: number, editedPost: TPostInput) => {
  await doTransactionDB(async () => {
    const found = await db.posts.get({ createdAtMs }).then((post) => post?.createdAtMs);
    if (!found) {
      alertAndThrow('グチの作成日時が見つかりませんでした');
      return;
    }

    // FIXME: ここではupdatedAtMsは更新されてないよ
    const targetDate = getDatehyphenatedString(new Date(createdAtMs));

    await db.posts
      .where('createdAtMs')
      .equals(createdAtMs)
      .modify({ ...editedPost });
    // 該当するグチ投稿日に対する更新日時を更新
    // レコードが無くてもNo Throw
    await db.postedDates.update(targetDate, { updatedAtMs: new Date().valueOf() });
  });
};

/**
 * @desc DBに保存されたグチを削除する
 */
export const deletePostDB = async (createdAtMs: number) => {
  await doTransactionDB(async () => {
    const found = await db.posts.where('createdAtMs').equals(createdAtMs).first();
    if (!found) {
      alertAndThrow('グチの作成日時が見つかりませんでした');
      return;
    }

    await db.posts.where('createdAtMs').equals(createdAtMs).delete();

    const targetDate = getDatehyphenatedString(new Date(createdAtMs));
    const postCount = await getDailyPostCountDB(new Date(createdAtMs));

    if (postCount > 1) {
      await db.postedDates.update(targetDate, {
        updatedAtMs: new Date().valueOf(),
        postCount: postCount - 1,
      }); // 該当するグチ投稿日に対する更新日時を更新
    } else {
      await db.postedDates.delete(targetDate);
    }
  });
};

/**
 * @desc DBに保存されたグチを全て削除する
 * @returns undefined
 */
export const deleteAllPostsDB = async () => {
  await doTransactionDB(async () => {
    await db.posts.clear();
    await db.postedDates.clear();
  });
};

/**
 * @desc [Deprecated] DBに保存されたグチのうち、指定した日付のグチを削除する
 * @returns undefined
 */
// export const deleteAllPostsDB = async (createdAtMs: Date) => {
//   const nextDate = new Date(createdAtMs);
//   nextDate.setDate(nextDate.getDate() + 1);

//   db.posts
//     .where('createdAtMs')
//     .between(createdAtMs, nextDate)
//     .delete()
//     .then(function (deleteCount) {
//       console.log('Deleted ' + deleteCount + ' objects');
//     });
// };

// ---------------- //

/**
 * @desc 指定した月のグチ投稿日一覧を取得する
 */
export const postedDatesInTheMonthDB = async (thisYearMonth: TYearMonth) => {
  const nextYearMonth = nextMonth(thisYearMonth);

  const pd = await db.postedDates
    .where('postedDate')
    .between(
      getDatehyphenatedString(getStartDayOfMonth(thisYearMonth)),
      getDatehyphenatedString(getStartDayOfMonth(nextYearMonth)),
    )
    .toArray();

  return pd.sort((a, b) => {
    return new Date(a.postedDate) > new Date(b.postedDate) ? -1 : 1;
  });
};
