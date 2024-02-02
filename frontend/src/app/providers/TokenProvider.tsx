'use client';

import React, { ReactNode, createContext, useReducer } from 'react';
import { LS_ACCESS_TOKEN } from '../posts/consts/localStorage';

type Action = { type: 'set'; payload: string } | { type: 'remove' };
type TToken = *****;

type TTokenContext = {
  isLoggedIn: boolean;
  token: *****;
  dispatch: React.Dispatch<Action> | undefined;
};

export const TokenContext = createContext<TTokenContext>({
  isLoggedIn: false,
  token: undefined,
  dispatch: undefined,
});

const TokenProvider = ({ children }: { children: ReactNode }) => {


  const reducer = (state: TToken, action: Action) => {
    /*
    * このコードは非公開です。
    */
  return (
    <TokenContext.Provider value={{ isLoggedIn: !!state.token, token: state.token, dispatch }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenProvider;
