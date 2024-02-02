'use client';

import React, { ReactNode, createContext, useCallback } from 'react';
import { useStorageCredentialQuery } from '@/gql/graphql';
import urlJoin from 'url-join';

type TStrageCredentialContext = {
  baseUrl: string;
  accessQuery: string;
  addCredential: (imagePath: string) => string;
};

export const StrageCredentialContext = createContext<TStrageCredentialContext>({
  baseUrl: '',
  accessQuery: '',
  addCredential: () => '',
});

const StrageCredentialProvider = ({ children }: { children: ReactNode }) => {
  const [{ data }] = useStorageCredentialQuery({});

  const baseUrl = data?.strageCredential?.baseUrl || '';
  const accessQuery = data?.strageCredential?.accessQuery || '';
  const addCredential = useCallback(
    (imagePath: string) => {
      return urlJoin(baseUrl, `${imagePath}?${accessQuery}`);
    },
    [accessQuery, baseUrl],
  );
  return (
    <StrageCredentialContext.Provider
      value={{
        baseUrl,
        accessQuery,
        addCredential,
      }}
    >
      <>{children}</>
    </StrageCredentialContext.Provider>
  );
};

export default StrageCredentialProvider;
