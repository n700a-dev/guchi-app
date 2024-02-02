import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import urlJoin from 'url-join';
import { SS_CHALLENGE_TOKEN } from '../posts/consts/localStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

export const useGoogleOAuth2 = () => {
  const router = useRouter();

  const goToOAuth2Endpoint = useCallback(async () => {
    const res = await axios.get(urlJoin(API_URL, '/oauth2/login_info/'));
    if (!res?.data) {
      console.error('認可用URLの取得に失敗しました');
      return;
    }
    sessionStorage.setItem(SS_CHALLENGE_TOKEN, res.data.challenge_token);
    router.push(res.data.oauth_url);
  }, [router]);

  return {
    goToOAuth2Endpoint,
  };
};
