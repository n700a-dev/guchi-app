'use client';

// https://tech.012grp.co.jp/entry/next_dynamicImport
// https://t-yng.jp/post/nextjs-storage

import React, { ReactNode, createContext, useCallback, useState } from 'react';
import { IPostedDateDB } from '../../../utils/db';

type TOpenCloseStatus = Record<string, boolean>;

type TOpenCloseContext = {
  openCloseStatus: TOpenCloseStatus;
  toggleOpenClose: (postedDate: string) => void;
  closeAll: () => void;
};

export const OpenCloseContext = createContext<TOpenCloseContext>({
  toggleOpenClose: () => undefined,
  closeAll: () => undefined,
  openCloseStatus: {},
});

const OpenCloseProvider = ({ children, postedDates }: { children: ReactNode; postedDates: IPostedDateDB[] }) => {
  const [openCloseStatus, setOpenCloseStatus] = useState<TOpenCloseStatus>(() => {
    return postedDates.reduce((acc, pd) => {
      return { ...acc, [pd.postedDate]: false };
    }, {});
  });

  const toggleOpenClose = useCallback((postedDate: string) => {
    setOpenCloseStatus((prev) => {
      return { ...prev, [postedDate]: !prev[postedDate] };
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenCloseStatus(() => {
      return {};
    });
  }, []);

  return (
    <OpenCloseContext.Provider
      value={{
        openCloseStatus,
        toggleOpenClose,
        closeAll,
      }}
    >
      {children}
    </OpenCloseContext.Provider>
  );
};

export default OpenCloseProvider;
