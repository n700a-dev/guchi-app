import { useCallback, useContext, useEffect, useState } from 'react';
import { useDailyPostsQuery } from '../../../../gql/graphql';
import { IPostDB, IPostedDateDB } from '@/app/utils/db';
import { TEmotion } from '../../EmotionSelector';
import { getDailyPostsDB } from '../../functions/postDBManipulation';
import { RepoStrategy } from '../../index/providers/RepoStrategyProvider';
import { StrageCredentialContext } from '../../index/providers/StrageCredentialProvider';

const removeNull = <T>(arg: NonNullable<T> | undefined | null) => {
  if (arg === undefined || arg === null) {
    return undefined;
  }

  return arg;
};

export const useGetDailyPostsBackend = ({ postedDate }: { postedDate: IPostedDateDB }) => {
  const [fetchedPostedDate, setFetchedPostedDate] = useState(-1);
  const [dailyPosts, setDailyPosts] = useState<IPostDB[]>([]);
  const [{ data, fetching, error }, fetch] = useDailyPostsQuery({
    variables: { postedDate: postedDate.postedDate },
    pause: true,
    requestPolicy: 'network-only',
  });
  const { addCredential } = useContext(StrageCredentialContext);
  const fetchPosts = useCallback(() => {
    if (fetching) {
      return;
    }

    if (fetchedPostedDate === postedDate.updatedAtMs) {
      console.log('already fetched', postedDate.postedDate, fetchedPostedDate, postedDate.updatedAtMs);
      return;
    }
    console.log('data fetch', postedDate.postedDate, fetchedPostedDate, postedDate.updatedAtMs);

    fetch({
      context: {
        pause: false,
      },
    });

    setFetchedPostedDate(postedDate.updatedAtMs);
  }, [fetch, fetchedPostedDate, fetching, postedDate]);

  if (error) {
    console.log(error);
  }
  useEffect(() => {
    if (!data?.dailyPosts) return;
    setDailyPosts(() =>
      data.dailyPosts.map((post) => {
        return {
          uploadedAtMs: removeNull(post.uploadedAtMs) as number | undefined,
          text: removeNull(post.text),
          emotion: removeNull(post.emotion) as TEmotion | undefined,
          imageBase64: undefined,
          imageUrl: post.imageUrl ? addCredential(post.imageUrl) : undefined,
          createdAt: new Date(), // TODO: データ移行→ 削除
          createdAtMs: parseInt(post.createdAtMs), // TODO: データ移行→ null禁止
          updatedAtMs: parseInt(post.updatedAtMs),
          diffHour: post.diffHour,
          postedDate: post.postedDate,
        };
      }),
    );
    console.log('data changed', data);
  }, [addCredential, data]);

  return {
    fetchPosts,
    dailyPosts,
  };
};

export const useGetDailyPostsFrontend = ({ postedDate }: { postedDate: IPostedDateDB }) => {
  const [fetchedPostedDate, setFetchedPostedDate] = useState(-1);
  const [dailyPosts, setDailyPosts] = useState<IPostDB[]>([]);

  const fetchPosts = useCallback(() => {
    if (fetchedPostedDate === postedDate.updatedAtMs) {
      console.log('already fetched', postedDate.postedDate, fetchedPostedDate, postedDate.updatedAtMs);
      return;
    }
    console.log('data fetch', postedDate.postedDate, fetchedPostedDate, postedDate.updatedAtMs);

    getDailyPostsDB(postedDate.postedDate).then((data) => {
      setDailyPosts(data);
    });

    setFetchedPostedDate(postedDate.updatedAtMs);
  }, [fetchedPostedDate, postedDate]);

  return {
    fetchPosts,
    dailyPosts,
  };
};

export const useGetDailyPosts = ({
  postedDate,
  strategy,
}: {
  postedDate: IPostedDateDB;
  strategy: (typeof RepoStrategy)[keyof typeof RepoStrategy] | undefined; // TODO: Providerの関係でundefinedになるのを解消したい
}) => {
  let repo;
  switch (strategy) {
    case RepoStrategy.local:
      repo = useGetDailyPostsFrontend;
      return repo({ postedDate });
    case RepoStrategy.remote:
      repo = useGetDailyPostsBackend;
      return repo({ postedDate });
    default:
      console.warn('Daily Posts: invalid strategy');
      return {
        fetchPosts: () => {
          console.warn('fetch Posts is not initialized.');
        },
        dailyPosts: [],
      };
  }
};
