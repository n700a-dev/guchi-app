import { useCallback } from 'react';
import { TPostInput } from '../../../new/page';
import { useCreatePostMutation, useDeletePostMutation, useUpdatePostMutation } from '../../../../../gql/graphql';
import { getTimezoneDiffHour, getUnixMs } from '../../../../utils/datetime';
import { getDatehyphenatedString } from '@/app/utils/datetime';
import { useUploadToS3 } from '../useUploadToS3';
import { IPostDB } from '../../../../utils/db';
import { TRepoMethods } from './usePostRepository';

export const usePostBackend = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mStateCreate, execCreatePost] = useCreatePostMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mStateUpdate, execUpdatePost] = useUpdatePostMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mStateDelete, execDeletePost] = useDeletePostMutation();

  const { getPostImageUploadUrl, uploadToS3 } = useUploadToS3();

  /*
   * 画像投稿処理を実行し、画像URLを返却する
   * 処理中にエラーが発生したら例外を吐く
   */
  const execUploadImage = useCallback(
    async (createdAtMs: number, updatedAtMs: number, imageBase64?: string, imageUrl?: string) => {
      if (!imageBase64 && !imageUrl) {
        return undefined;
      }
      // 画像を変更しなかった場合
      if (!imageBase64 && imageUrl) {
        // "https://d2f50uunv9b0ga.cloudfront.net/1/posts/1703815747529/images/1.png?Policy=..." -> "1/posts/1703815747529/images/1.png"
        const newUrl = imageUrl.replace(/\?.*$/, '').match(/(?<=https?.*\.net\/).*$/)?.[0];
        return newUrl;
      }
      // 画像を追加もしくは変更した場合
      if (imageBase64 && !imageUrl) {
        const { s3Url, formData } = await getPostImageUploadUrl(createdAtMs.toString(), updatedAtMs.toString()).catch(
          (e) => {
            throw e;
          },
        );

        return await uploadToS3(s3Url, formData, imageBase64).catch((e) => {
          throw e;
        });
      }
      // 例外: imageBase64 && imageUrl
      throw new Error('Cannot Specify both imageBase64 and imageUrl!');
    },
    [getPostImageUploadUrl, uploadToS3],
  );

  /* ローカルのグチをAPIに投稿する
   * createPostとの違いは、createdAtMsが既に存在すること
   */
  const movePostToBackend = useCallback(
    async (post: IPostDB) => {
      // TODO: 多重送信を阻止するなら下記をコメントアウト
      // if (mStateCreate.fetching) {
      //   return;
      // }
      try {
        const imageUrl = await execUploadImage(post.createdAtMs, post.updatedAtMs, post.imageBase64);

        const result = await execCreatePost({
          input: {
            createdAtMs: post.createdAtMs.toString(),
            updatedAtMs: post.createdAtMs.toString(),
            diffHour: getTimezoneDiffHour(),
            postedDate: post.postedDate,
            text: post.text || '',
            emotion: post.emotion,
            imageUrl,
          },
        });
        return result.data?.createPost.result ?? false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    [execCreatePost, execUploadImage],
  );

  /* 新規のグチをAPIに投稿する */
  const createPost: TRepoMethods['createPost'] = useCallback(
    async (post: TPostInput) => {
      const now = new Date();
      const createdAtMs = now.valueOf();

      try {
        const imageUrl = await execUploadImage(createdAtMs, createdAtMs, post.imageBase64, post.imageUrl);

        const result = await execCreatePost({
          input: {
            createdAtMs: createdAtMs.toString(),
            updatedAtMs: createdAtMs.toString(),
            diffHour: getTimezoneDiffHour(),
            postedDate: getDatehyphenatedString(now),
            text: post.text || '',
            emotion: post.emotion,
            imageUrl,
          },
        });
        return result.data?.createPost.result ?? false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    [execCreatePost, execUploadImage],
  );

  /* グチの修正をAPIに投稿する */
  const updatePost: TRepoMethods['updatePost'] = useCallback(
    async (createdAtMs: number, post: TPostInput) => {
      const updatedAtMs = getUnixMs(new Date());
      try {
        const imageUrl = await execUploadImage(createdAtMs, updatedAtMs, post.imageBase64, post.imageUrl);
        const result = await execUpdatePost({
          input: {
            createdAtMs: createdAtMs.toString(),
            updatedAtMs: updatedAtMs.toString(),
            text: post.text || '',
            emotion: post.emotion,
            imageUrl,
          },
        });
        return result.data?.updatePost.result ?? false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    [execUpdatePost, execUploadImage],
  );

  /* グチの修正をAPIに投稿する */
  const deletePost: TRepoMethods['deletePost'] = useCallback(
    async (createdAtMs: number) => {
      try {
        const result = await execDeletePost({
          input: {
            createdAtMs: createdAtMs.toString(),
          },
        });
        return result.data?.deletePost.result ?? false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    [execDeletePost],
  );

  return {
    movePostToBackend,
    createPost,
    updatePost,
    deletePost,
  };
};
