'use client';

import { getUnixMs } from '@/app/utils/datetime';
// https://tech.012grp.co.jp/entry/next_dynamicImport
// https://t-yng.jp/post/nextjs-storage

import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import { IPostedDateDB } from '../../../utils/db';
import { TPostInput } from '../../new/page';
import { getDatehyphenatedString } from '@/app/utils/datetime';
import { RepoStrategy } from './RepoStrategyProvider';
import rfdc from 'rfdc';
import { TRepoMethods, usePostRepository } from '../../hooks/api/repository/usePostRepository';

const UpdateTypes = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const;

type TPostManipulationContext = {
  postedDates: IPostedDateDB[];
  createPost: TRepoMethods['createPost'] | undefined;
  updatePost: TRepoMethods['updatePost'] | undefined;
  deletePost: TRepoMethods['deletePost'] | undefined;
};

export const PostManipulationContext = createContext<TPostManipulationContext>({
  postedDates: [],
  createPost: undefined,
  updatePost: undefined,
  deletePost: undefined,
});

/**
 * 投稿日の管理をページ上で行っている。このproviderは potedDates の破壊的変更を行うので注意。
 */
const PostManipulationProvider = ({
  children,
  initPostedDates,
  strategy,
}: {
  children: ReactNode;
  initPostedDates: IPostedDateDB[];
  strategy: (typeof RepoStrategy)[keyof typeof RepoStrategy];
}) => {
  const [postedDates, setPostedDates] = useState<IPostedDateDB[]>([]);
  const {
    createPost: createPostRepo,
    updatePost: updatePostRepo,
    deletePost: deletePostRepo,
  } = usePostRepository(strategy);

  useEffect(() => {
    if (!initPostedDates) return;
    setPostedDates(rfdc()(initPostedDates));
  }, [initPostedDates]);

  const findByCreatedAtMs = useCallback(
    (createdAtMs: number) => {
      const date = getDatehyphenatedString(new Date(createdAtMs));
      return postedDates.findIndex((postedDate) => postedDate.postedDate === date);
    },
    [postedDates],
  );

  const updatePostedDates = useCallback(
    (createdAtMs: number, type: (typeof UpdateTypes)[keyof typeof UpdateTypes]) => {
      const idx = findByCreatedAtMs(createdAtMs);
      if (idx === -1) {
        throw new Error('postedDatesに存在しないcreatedAtMsが指定されました');
      }
      const prev = postedDates[idx];

      switch (type) {
        case UpdateTypes.create:
          setPostedDates((prevPd) => {
            const pd = [...prevPd];
            pd.splice(idx, 1, { ...prev, postCount: prev.postCount + 1, updatedAtMs: getUnixMs(new Date()) });
            return pd;
          });
          break;
        case UpdateTypes.update:
          setPostedDates((prevPd) => {
            const pd = [...prevPd];
            pd.splice(idx, 1, { ...prev, updatedAtMs: getUnixMs(new Date()) });
            return pd;
          });
          break;
        case UpdateTypes.delete:
          setPostedDates((prevPd) => {
            const pd = [...prevPd];
            pd.splice(idx, 1, { ...prev, postCount: prev.postCount - 1, updatedAtMs: getUnixMs(new Date()) });
            return pd;
          });
          break;
        default:
          throw new Error('UpdateType: 無効な操作が指定されました');
      }
    },
    [findByCreatedAtMs, postedDates],
  );

  const createPost = useCallback(
    async (post: TPostInput) => {
      const result = await createPostRepo(post);
      if (!result) {
        alert('投稿に失敗しました。');
        return false;
      }
      updatePostedDates(getUnixMs(new Date()), UpdateTypes.create);
      return true;
    },
    [createPostRepo, updatePostedDates],
  );

  const updatePost = useCallback(
    async (createdAtMs: number, post: TPostInput) => {
      const result = await updatePostRepo(createdAtMs, post);
      if (!result) {
        alert('更新に失敗しました。');
        return false;
      }
      updatePostedDates(createdAtMs, UpdateTypes.update);
      return true;
    },
    [updatePostRepo, updatePostedDates],
  );

  const deletePost = useCallback(
    async (createdAtMs: number) => {
      const result = await deletePostRepo(createdAtMs);
      if (!result) {
        alert('削除に失敗しました。');
        return false;
      }
      updatePostedDates(createdAtMs, UpdateTypes.delete);
      return true;
    },
    [deletePostRepo, updatePostedDates],
  );

  return (
    <PostManipulationContext.Provider
      value={{
        postedDates,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostManipulationContext.Provider>
  );
};

export default PostManipulationProvider;

// 仕様
// POSTを投稿したとき、
// 日付の件数が増加していること
// 日付の更新日が更新されていること
// 日付の開閉状態が変化していないこと
// POSTを更新したとき、
// 日付の件数が変化していないこと
// 日付の更新日が更新されていること
// 日付の開閉状態が変化していないこと
// 内部データをfetchすること
