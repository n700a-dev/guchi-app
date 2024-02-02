// db.ts
import Dexie, { Table } from 'dexie';
import { TEmotion } from '../posts/EmotionSelector';

export interface IPostDB {
  uid?: number;
  uploadedAtMs: number | undefined;
  text: string | undefined;
  emotion: TEmotion | undefined;
  imageBase64: string | undefined;
  imageUrl: string | undefined;
  createdAtMs: number;
  createdAt: Date; // TOOD: delete
  updatedAtMs: number;
  postedDate: string;
  diffHour: number;
}

export interface IPostedDateDB {
  // authorId: number; // 投稿者のID
  postedDate: string; // Date型では等価演算できないので文字列で保存 (ex: 2024-1-10)
  postCount: number; // 投稿数
  startOfDayMs: number;
  endOfDayMs: number;
  updatedAtMs: number;
  diffHour: number;
}

export class MySubClassedDexie extends Dexie {
  // 'posts' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  posts!: Table<IPostDB>;
  postedDates!: Table<IPostedDateDB>;

  constructor() {
    super('myApp');
    this.version(12).stores({
      posts: '++uid, createdAt', // createdAtMsは後で追加
      postedDates: '&postedDate, updatedAtMs',
    });

    this.version(15)
      .stores({
        posts: '++uid, postedDate, &createdAtMs',
        postedDates: '&postedDate, updatedAtMs',
      })
      .upgrade(function (trans) {
        alert('upgrade');
        return trans
          .table('posts')
          .toCollection()
          .modify(() => {
            // post.createdAtMs = getUnixMs(post.createdAt);
            // post.pos = getUnixMs(post.createdAt);
          });
      });
  }
}

export const db = new MySubClassedDexie();
