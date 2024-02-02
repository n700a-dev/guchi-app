import { useContext, useEffect, useState } from 'react';
import { getDailyPostCountDB, getPostCountDB } from '../../functions/postDBManipulation';
import { getDatehyphenatedString } from '@/app/utils/datetime';
import { TokenContext } from '../../../../app/providers/TokenProvider';
import { useDailyPostCountQuery } from '../../../../gql/graphql';

const MAX_LOCAL_POST_COUNT = 50; // 端末に保存できるグチの上限数
const MAX_LOCAL_DAILY_POST_COUNT = 30; // 一日の投稿数の上限(未ログイン時)
const MAX_REMOTE_DAILY_POST_COUNT = 50; // 一日の投稿数の上限(ログイン時: ローカル + リモートの合計)

export const useLocalPostCountValidation = () => {
  const { isLoggedIn } = useContext(TokenContext);

  const [localPostCount, setLocalPostCount] = useState(0);
  const [localDailyPostCount, setLocalDailyPostCount] = useState(0);
  const [remoteDailyPostCount, setRemoteDailyPostCount] = useState(0);
  const [{ data }] = useDailyPostCountQuery({ variables: { postedDate: getDatehyphenatedString(new Date()) } });

  useEffect(() => {
    getPostCountDB().then((count) => {
      setLocalPostCount(count);
    });

    getDailyPostCountDB(new Date()).then((count) => {
      setLocalDailyPostCount(count);
    });
  }, []);

  useEffect(() => {
    if (data?.postedDate.postCount) {
      setRemoteDailyPostCount(data?.postedDate.postCount);
    }
  }, [data]);

  if (isLoggedIn) {
    if (localDailyPostCount + remoteDailyPostCount >= MAX_REMOTE_DAILY_POST_COUNT) {
      return {
        errorMessage: '一日の投稿数の上限に達しました。明日もう一度投稿してください。',
        action: 'none',
      };
    }
  } else {
    if (localPostCount >= MAX_LOCAL_POST_COUNT) {
      return {
        errorMessage: '端末に保存できるグチの上限数に達しました。ログインするとグチを投稿できます。',
        action: 'login',
      };
    }
    if (localDailyPostCount >= MAX_LOCAL_DAILY_POST_COUNT) {
      return {
        errorMessage: '一日の投稿数の上限に達しました。ログインすると一日の投稿数を増やすことができます。',
        action: 'login',
      };
    }
  }

  return {
    errorMessage: undefined,
    action: undefined,
  };
};
