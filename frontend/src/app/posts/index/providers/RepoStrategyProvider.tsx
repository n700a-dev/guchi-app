'use client';

// https://tech.012grp.co.jp/entry/next_dynamicImport
// https://t-yng.jp/post/nextjs-storage

import React, { ReactNode, createContext } from 'react';

export const RepoStrategy = {
  local: 'local',
  remote: 'remote',
} as const;

type TRepoStrategy = typeof RepoStrategy;

type TRepoStrategyContext = {
  strategy: TRepoStrategy[keyof TRepoStrategy] | undefined;
};

export const RepoStrategyContext = createContext<TRepoStrategyContext>({
  strategy: undefined,
});

const RepoStrategyProvider = ({
  children,
  strategy,
}: {
  children: ReactNode;
  strategy: TRepoStrategy[keyof TRepoStrategy];
}) => {
  return (
    <>
      {strategy && (
        <>
          <RepoStrategyContext.Provider
            value={{
              strategy,
            }}
          >
            {children}
          </RepoStrategyContext.Provider>
        </>
      )}
    </>
  );
};

export default RepoStrategyProvider;
