'use client';

import React, { useCallback } from 'react';
import MainLayout from '../MainLayout';
import { FormControl, FormLabel, Input, Button, Text, Heading } from '@chakra-ui/react';
import { TokenContext } from '../providers/TokenProvider';
import urlJoin from 'url-join';
import axios from 'axios';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

const Login = () => {
  const { dispatch } = React.useContext(TokenContext);
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  // const { goToOAuth2Endpoint } = useGoogleOAuth2();
  const router = useRouter();

  const onClickLogin = useCallback(async () => {
    const form = new FormData();
    form.append('username', nicknameRef.current?.value ?? '');
    form.append('password', passwordRef.current?.value ?? '');
    try {
      const response = await axios.post(urlJoin(API_URL, 'login'), form);
      const result = response.data;
      dispatch?.({ type: 'set', payload: result.access_token });
      router.push(`${Routes.posts.index}`);
    } catch (error) {
      console.error(error);
      alert('ログインに失敗しました');
      dispatch?.({ type: 'remove' });
    }
  }, [dispatch, router]);

  return (
    <MainLayout>
      <Heading fontSize="20" as="h2" fontWeight="700">
        テストユーザー用ログイン
      </Heading>
      <FormControl mt={2}>
        <FormLabel>User Id</FormLabel>
        <Input ref={nicknameRef} />
        <FormLabel>Password</FormLabel>
        <Input ref={passwordRef} />

        <Button mt={4} colorScheme="teal" isLoading={false} type="submit" onClick={onClickLogin}>
          Login
        </Button>
      </FormControl>
      <Text mt={6}>※ 事前に共有されたユーザーID,パスワードを入力してください。</Text>
      <Text mt={2}>※ 一般ユーザーにはGoogle OAuth2でのログインのみ提供しています</Text>
      {/* <Button ml={2} mt={4} colorScheme="teal" isLoading={false} type="submit" onClick={goToOAuth2Endpoint}>
        Login with Google
      </Button> */}
    </MainLayout>
  );
};

export default Login;
