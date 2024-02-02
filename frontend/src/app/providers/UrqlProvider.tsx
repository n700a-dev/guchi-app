'use client';

import React, { useContext, useMemo } from 'react';
import { ReactNode } from 'react';
import { Provider, cacheExchange, createClient, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { TokenContext } from './TokenProvider';
import { GRAPHQL_REQUEST_HEADER } from '../../config/requestHeader';
import urlJoin from 'url-join';

// NOTE: バックエンドでこのメッセージを生成しているので、文面を変更しないこと！
const USER_NOT_AUTHENTICATED = 'User not authenticated';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

export const UrqlProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, token, dispatch } = useContext(TokenContext);

  const client = useMemo(() => {
    if (isLoggedIn === null) {
      return null;
    }

    return createClient({
      url: urlJoin(API_URL, 'graphql'), //'http://localhost:8080/graphql',
      exchanges: [
        cacheExchange,
        authExchange(async (utils) => {
          return {
            /**
             * Authorizationヘッダーを付与する
             */
            addAuthToOperation(operation) {
              /*
              * このコードは非公開です。
              */
            },
            /**
             * ブラウザ上でトークンが無効か判定するときに使う
             */
            willAuthError() {
              /*
              * このコードは非公開です。
              */
            },
            /**
             * サーバー空のレスポンスから、トークンが無効か判定するときに使う
             */
            didAuthError(error) {
              /*
              * このコードは非公開です。
              */
            },
            refreshAuth() {
              /**
               * didAuthError発生後にトリガーされる
               */
              return new Promise((resolve) => {
                resolve(dispatch?.({ type: 'remove' }));
              });
            },
          };
        }),
        fetchExchange,
      ],
      fetchOptions: {
        ...GRAPHQL_REQUEST_HEADER,
      },
    });
  }, [dispatch, isLoggedIn, token]);

  if (!client) {
    return null;
  }

  return <Provider value={client}>{children}</Provider>;
};
