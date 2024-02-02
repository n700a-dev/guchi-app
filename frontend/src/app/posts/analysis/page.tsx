'use client';

import React, { useContext, useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { Chart } from './Chart';
import { TokenContext } from '@/app/providers/TokenProvider';
import { getPostCountDB } from '../functions/postDBManipulation';
import { AleartMessage } from '@/app/components/Elements/Texts/AlertMessage';
import { useGoogleOAuth2 } from '@/app/login/useGoogleOAuth2';
import { Routes } from '@/config/routes';

const Page = () => {
  const { goToOAuth2Endpoint } = useGoogleOAuth2();
  const { isLoggedIn } = useContext(TokenContext);
  const [localPostCount, setLocalPostCount] = useState(0);

  useEffect(() => {
    getPostCountDB().then((count) => {
      setLocalPostCount(count);
    });
  }, []);
  return (
    <MainLayout>
      {!isLoggedIn ? (
        <AleartMessage
          message="ログインするとグラフを確認できます (クリックしてログイン)"
          onClick={goToOAuth2Endpoint}
          cursor="pointer"
        />
      ) : (
        !!localPostCount && (
          <AleartMessage
            message="グラフを正しく表示するためには、全てのグチをクラウドに保存してください (クリックして保存)"
            href={Routes.posts.upload}
            cursor="pointer"
          />
        )
      )}
      <Chart></Chart>
    </MainLayout>
  );
};

export default Page;
