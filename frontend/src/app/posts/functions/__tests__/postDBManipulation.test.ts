import 'fake-indexeddb/auto';
import Dexie from 'dexie';

Dexie.dependencies.indexedDB = indexedDB;

import { db } from '../../../utils/db';
import { deleteAllPostsDB, deletePostDB, insertPostDB, updatePostDB } from '../postDBManipulation';
import { getDatehyphenatedString } from '../../../utils/datetime';
import * as mockedPostDBManipulation from '../postDBManipulation';

import { waitFor } from '@testing-library/react';

// TODO: 安全なmockに書き換える
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.structuredClone = (val: any) => {
  const obj = JSON.parse(JSON.stringify(val));

  // // 日付を表す文字列だったら、String型→Date型に変換する
  // const ret = Object.keys(obj).reduce(function (previous, key) {
  //   const DateTimeRegex = /\d{4}.+\d{2}.+\d{2}.*/;
  //   const newValue = DateTimeRegex.test(obj[key]) ? new Date(obj[key]) : obj[key];
  //   return { ...previous, [key]: newValue };
  // }, {});

  return obj;
};

window.alert = jest.fn().mockImplementation((message) => {
  console.log(message);
});
const TODAY = new Date();

const travelTo = (dateDiff: number) => {
  jest.useFakeTimers().setSystemTime(new Date().setDate(TODAY.getDate() + dateDiff));
};

const setupPosts = async () => {
  await db.delete();
  await db.open();
  await db.posts.clear();
  await db.postedDates.clear();

  travelTo(-2);
  await insertPostDB({
    text: 'sample1',
    emotion: undefined,
    imageBase64: undefined,
    imageUrl: undefined,
  });

  travelTo(-2);
  await insertPostDB({
    text: 'sample2',
    emotion: undefined,
    imageBase64: undefined,
    imageUrl: undefined,
  });

  travelTo(-1);
  await insertPostDB({
    text: 'sample3',
    emotion: undefined,
    imageBase64: undefined,
    imageUrl: undefined,
  });

  const posts = await db.posts.toArray();
  return posts.map((post) => {
    return post.createdAtMs;
  });
};

describe('postDBManipulation', () => {
  // https://github.com/dexie/Dexie.js/issues/729#issuecomment-404395739
  const errorHandler = (ev: { reason: { name: string }; preventDefault: () => void }) => {
    if (ev.reason.name === 'DatabaseClosedError') {
      ev.preventDefault();
    }
  };
  beforeAll(() => {
    window.addEventListener('unhandledrejection', errorHandler);
  });
  afterAll(() => {
    window.removeEventListener('unhandledrejection', errorHandler);
  });

  beforeEach(() => {
    jest.spyOn(mockedPostDBManipulation, 'doTransactionDB').mockImplementation(async (callback) => {
      await callback();
    });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('insertPostDB', () => {
    it('グチが正しくDBに保存されていること', async () => {
      // 初投稿の場合
      const post = {
        tId: 1,
        text: 'sample',
        emotion: undefined,
        imageBase64: undefined,
        imageUrl: undefined,
      };

      await waitFor(async () => {
        await insertPostDB(post);
      });

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(1);
        expect(postedDates.length).toBe(1);

        // グチ投稿のレコードが正しく追加されていることを確認
        expect(posts[0]).toEqual({
          createdAt: expect.any(String),
          text: 'sample',
          uid: 1,
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          diffHour: 9,
          postedDate: expect.any(String),
        });

        // グチ投稿日のレコードの更新日時が正しいことを確認
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[0].createdAtMs)),
          updatedAtMs: new Date(posts[0].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          postCount: 1,
          diffHour: 9,
        });
      });

      // 本日2回目の投稿の場合
      const post2 = {
        tId: 2,
        text: 'sample2',
        emotion: undefined,
        imageBase64: undefined,
        imageUrl: undefined,
      };

      await waitFor(async () => {
        await insertPostDB(post2);
      });

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(2);
        expect(postedDates.length).toBe(1);

        // グチ投稿日のレコードの更新日時が正しいことを確認
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[1].createdAtMs)),
          updatedAtMs: new Date(posts[1].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          postCount: 2,
          diffHour: 9,
        });
      });

      // 翌日の投稿の場合
      const post3 = {
        tId: 3,
        text: 'sample3',
        emotion: undefined,
        imageBase64: undefined,
        imageUrl: undefined,
      };

      travelTo(1);

      await waitFor(async () => {
        await insertPostDB(post3);
      });

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(3);
        expect(postedDates.length).toBe(2);

        // 2日間のグチ投稿日のレコードが正しく追加されていることを確認
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[1].createdAtMs)),
          updatedAtMs: new Date(posts[1].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          postCount: 2,
          diffHour: 9,
        });

        expect(postedDates[1]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[2].createdAtMs)),
          updatedAtMs: new Date(posts[2].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          postCount: 1,
          diffHour: 9,
        });
      });
    });
  });

  describe('updatePostDB', () => {
    it('should update an existing post in the database', async () => {
      const createdtMsList = await setupPosts();

      travelTo(0);
      const nowSec = new Date().valueOf();

      await waitFor(async () => {
        await updatePostDB(createdtMsList[0], {
          text: 'updatedText',
          emotion: undefined,
          imageBase64: 'updatedImage',
          imageUrl: undefined,
        });
      });
      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(3);
        expect(postedDates.length).toBe(2);

        // 各Postの値が正しいこと
        expect(posts[0]).toEqual({
          createdAt: expect.any(String),
          text: 'updatedText',
          imageBase64: 'updatedImage',
          uid: 1,
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          diffHour: 9,
          postedDate: expect.any(String),
        });

        expect(posts[1]).toEqual({
          createdAt: expect.any(String),
          text: 'sample2',
          uid: 2,
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          diffHour: 9,
          postedDate: expect.any(String),
        });

        expect(posts[2]).toEqual({
          createdAt: expect.any(String),
          text: 'sample3',
          uid: 3,
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          diffHour: 9,
          postedDate: expect.any(String),
        });

        // 2日間のグチ投稿日のレコードが正しく更新されていることを確認
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[1].createdAtMs)),
          postCount: 2,
          updatedAtMs: expect.any(Number),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          diffHour: 9,
        });
        expect(postedDates[0].updatedAtMs).toBeGreaterThanOrEqual(nowSec);

        expect(postedDates[1]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[2].createdAtMs)),
          postCount: 1,
          updatedAtMs: new Date(posts[2].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          diffHour: 9,
        });
      });
    });
  });

  describe('deletePostDB', () => {
    it('投稿されたグチを正しく削除できること', async () => {
      const createdtMsList = await setupPosts();

      travelTo(0);
      const nowSec = new Date().valueOf();

      // 初日の投稿を1件削除
      await deletePostDB(createdtMsList[1]);

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(2);
        expect(postedDates.length).toBe(2);

        // 各Postの値が正しいこと
        expect(posts[0]).toEqual({
          createdAt: expect.any(String),
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          text: 'sample1',
          uid: 1,
          diffHour: 9,
          postedDate: expect.any(String),
        });

        expect(posts[1]).toEqual({
          createdAt: expect.any(String),
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          text: 'sample3',
          uid: 3,
          diffHour: 9,
          postedDate: expect.any(String),
        });

        // 2日間のグチ投稿日のレコードが正しく更新されていることを確認
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[0].createdAtMs)),
          postCount: 1,
          updatedAtMs: expect.any(Number),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          diffHour: 9,
        });
        expect(postedDates[0].updatedAtMs).toBeGreaterThanOrEqual(nowSec);

        expect(postedDates[1]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[1].createdAtMs)),
          postCount: 1,
          updatedAtMs: new Date(posts[1].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          diffHour: 9,
        });
      });

      // 初日の投稿をさらに1件削除
      await deletePostDB(createdtMsList[0]);

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(1);
        expect(postedDates.length).toBe(1);

        // 各Postの値が正しいこと
        expect(posts[0]).toEqual({
          createdAt: expect.any(String),
          text: 'sample3',
          uid: 3,
          createdAtMs: expect.any(Number),
          updatedAtMs: expect.any(Number),
          diffHour: 9,
          postedDate: expect.any(String),
        });

        // 投稿日のレコードが正しく更新されていること(1日分のみ)
        expect(postedDates[0]).toEqual({
          postedDate: getDatehyphenatedString(new Date(posts[0].createdAtMs)),
          postCount: 1,
          updatedAtMs: new Date(posts[0].createdAtMs).valueOf(),
          startOfDayMs: expect.any(Number),
          endOfDayMs: expect.any(Number),
          diffHour: 9,
        });

        expect(postedDates[0].updatedAtMs).toBeLessThan(nowSec);
      });
    });
  });

  describe('deleteAllPostsDB', () => {
    it('should delete all posts from the database', async () => {
      await setupPosts();
      await deleteAllPostsDB();

      await waitFor(async () => {
        const posts = await db.posts.toArray();
        const postedDates = await db.postedDates.toArray();

        expect(posts.length).toBe(0);
        expect(postedDates.length).toBe(0);
      });
    });
  });
});
