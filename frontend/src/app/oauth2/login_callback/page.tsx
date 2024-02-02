'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SS_CHALLENGE_TOKEN } from '@/app/posts/consts/localStorage';
import urlJoin from 'url-join';
import axios from 'axios';
import { TokenContext } from '@/app/providers/TokenProvider';
import ErrorBoundary from '../../../../ErrorBouondary';
import { Routes } from '@/config/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

const Page = () => {
  const router = useRouter();
  const { dispatch, isLoggedIn } = React.useContext(TokenContext);
  const [loginResultMessage, setLoginResultMessage] = useState('認証中...');
  const searchParams = useSearchParams();
  const [isSent, setIsSent] = useState(false);

  const sendRequest = useCallback(async () => {
    if (isSent) return;
    setIsSent(true);
    const code = searchParams.get('code');
    const challengeToken = *****;

    try {
      const res = await axios.post(
        urlJoin(API_URL, `oauth2/login/callback/?code=${code}&challenge_token=${challengeToken}`),
      );
      if (!res?.data) {
        console.error('認可用URLの取得に失敗しました');
        return;
      }
      if (!res.data) {
        throw new Error('ログイン情報の取得に失敗しました。もう一度やり直してください');
      }
      dispatch?.({ type: 'set', payload: res?.data.access_token });
      setLoginResultMessage('しばらくお待ちください...');
      router.push(`${Routes.posts.index}`);
    } catch (error) {
      console.error(error);
      if (isLoggedIn) {
        setLoginResultMessage('既にログインしています');
        return;
      }
      alert('ログインに失敗しました。もう一度やり直してください');
      dispatch?.({ type: 'remove' });
      setLoginResultMessage('ログインに失敗しました');
    }
  }, [dispatch, isLoggedIn, isSent, router, searchParams]);

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <Box>{loginResultMessage}</Box>
    </ErrorBoundary>
  );
};

export default Page;
