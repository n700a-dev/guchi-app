'use client';

import { Flex, Heading } from '@chakra-ui/react';
import React, { useContext } from 'react';

import MainLayout from '../../MainLayout';

import { PostUploadToCloud } from './PostUploadToCloud';
import { TokenContext } from '@/app/providers/TokenProvider';
import { AleartMessage } from '@/app/components/Elements/Texts/AlertMessage';
import { useGoogleOAuth2 } from '@/app/login/useGoogleOAuth2';

const Page = () => {
  const { isLoggedIn } = useContext(TokenContext);
  const { goToOAuth2Endpoint } = useGoogleOAuth2();
  return (
    <MainLayout>
      <Flex>
        <Heading as="h1" color="gray">
          クラウドに保存
        </Heading>
      </Flex>
      {isLoggedIn ? (
        <PostUploadToCloud />
      ) : (
        <AleartMessage
          message="クラウドに保存するためには、ログインしてください (クリックしてログイン)"
          onClick={goToOAuth2Endpoint}
          cursor="pointer"
        />
      )}
    </MainLayout>
  );
};

export default Page;
