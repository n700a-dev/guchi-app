import { useEffect, useState } from 'react';
import { getPostCountDB } from '../../functions/postDBManipulation';
import { usePostCountQuery } from '@/gql/graphql';

export const useFiredPostCount = () => {
  const [firedPostCountDB, setFiredPostCountDB] = useState<number>(0);
  const [{ data }] = usePostCountQuery();

  const postCountBackend = data?.postCount ?? 0;

  useEffect(() => {
    getPostCountDB().then((count) => {
      setFiredPostCountDB(count + postCountBackend);
    });
  }, [postCountBackend]);

  return {
    firedPostCountDB,
  };
};
