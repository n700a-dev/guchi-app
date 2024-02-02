import { useCallback, useEffect, useRef, useState } from 'react';
import { deletePostDB, getFirstPostDB, getPostCountDB } from '../../functions/postDBManipulation';
import { usePostBackend } from '../../hooks/api/repository/usePostBackend';

type TUploadStatus = 'waiting' | 'uploading' | 'finished' | 'failed';
const LIMIT_UPLOAD_COUNT = ****; // 保険のため、一度にアップロードできるグチ数を制限する

export const useUploadPostToCloud = () => {
  const uploadStatus = useRef<TUploadStatus>('waiting');
  const [uploadState, setUploadState] = useState<TUploadStatus>(uploadStatus.current);

  const [currentCount, setCurrentCount] = useState(0);
  const currentCountRef = useRef(0);

  const [totalCount, setTotalCount] = useState(0);
  const totalCountRef = useRef(0);

  const count = useRef(0);
  const { movePostToBackend } = usePostBackend();

  useEffect(() => {
    count.current = currentCount;
  }, [count, currentCount]);

  const changeState = useCallback((newState: TUploadStatus) => {
    setUploadState(newState);
    uploadStatus.current = newState;
  }, []);

  const countUp = useCallback(() => {
    const prev = currentCountRef.current;
    setCurrentCount(prev + 1);
    currentCountRef.current = prev + 1;
  }, []);

  const registerTotalCount = useCallback((c: number) => {
    setTotalCount(c);
    totalCountRef.current = c;
  }, []);

  const uploadSingle = useCallback(async () => {
    if (currentCountRef.current >= totalCountRef.current) {
      changeState('finished');
      return;
    }

    if (currentCountRef.current >= LIMIT_UPLOAD_COUNT) {
      console.error('一度にアップロードできるグチの数を超過しました');
      changeState('failed');
      return;
    }

    countUp();

    try {
      const post = await getFirstPostDB();
      if (!post) {
        changeState('finished');
        return;
      }

      if (!(await movePostToBackend(post))) {
        console.error('グチの投稿処理でエラーが発生しました');
        changeState('failed');
        return;
      }

      await deletePostDB(post.createdAtMs);
    } catch (e) {
      console.error(e);
      changeState('failed');
      return;
    }

    if (uploadStatus.current !== 'uploading') return;
    setTimeout(uploadSingle, 200);
  }, [changeState, countUp, movePostToBackend]);

  const startUpload = useCallback(async () => {
    if (uploadStatus.current !== 'waiting') return;
    registerTotalCount(await getPostCountDB());
    changeState('uploading');
    uploadSingle();
  }, [changeState, registerTotalCount, uploadSingle]);

  const abortUpload = useCallback(async () => {
    changeState('waiting');
  }, [changeState]);

  return {
    startUpload,
    abortUpload,
    totalCount,
    currentCount,
    uploadStatus: uploadState,
  };
};
