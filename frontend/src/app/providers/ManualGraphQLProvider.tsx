'use client';

import React, { createContext, useCallback, useContext } from 'react';
import { ReactNode } from 'react';
import { Provider } from 'urql';
import { TokenContext } from './TokenProvider';
import { GRAPHQL_REQUEST_HEADER } from '../../config/requestHeader';
import urlJoin from 'url-join';
import { print, DocumentNode } from 'graphql';
import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

type TManualGraphQLContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateGraphqlQueryFunction: (query: DocumentNode, variables: unknown) => () => AxiosResponse<any, any>['data'];
};

export const ManualGraphQLContext = createContext<TManualGraphQLContext>({
  generateGraphqlQueryFunction: () => () => undefined,
});

export const ManualGraphQLProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useContext(TokenContext);

    /*
    * このコードは非公開です。
    */

  return (
    <Provider value={{ generateGraphqlQueryFunction }}>
      <>{children}</>
    </Provider>
  );
};
