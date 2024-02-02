import { useCallback } from 'react';
import { TPostInput } from '../../../new/page';
import { deletePostDB, insertPostDB, updatePostDB } from '../../../functions/postDBManipulation';
import { TRepoMethods } from './usePostRepository';

export const usePostFrontend = () => {
  /* 新規のグチをAPIに投稿する */
  const createPost: TRepoMethods['createPost'] = useCallback(async (post: TPostInput) => {
    try {
      await insertPostDB(post);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  /* グチの修正をAPIに投稿する */
  const updatePost: TRepoMethods['updatePost'] = useCallback(async (createdAtMs: number, post: TPostInput) => {
    try {
      await updatePostDB(createdAtMs, post);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  /* グチの修正をAPIに投稿する */
  const deletePost: TRepoMethods['deletePost'] = useCallback(async (createdAtMs: number) => {
    try {
      await deletePostDB(createdAtMs);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  return {
    createPost,
    updatePost,
    deletePost,
  };
};
