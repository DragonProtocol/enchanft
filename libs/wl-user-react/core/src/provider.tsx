/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-08 16:56:02
 * @Description: file description
 */
import type { Context, ReactNode } from 'react';
import React, { createContext, useContext, useRef } from 'react';
import { AccountType, Signer, User } from './types';

export type WlUserContextType = {
  signer: Signer;
  user: User;
};
const DefaultCtxData: WlUserContextType = {
  accountType: AccountType.TWITTER,
  phantomValid: false,
  metaMaskValid: false,
  martianValid: false,
};

const WlUserContext = createContext<WlUserContextType | undefined>(undefined);

export interface WlUserReactProviderProps {
  children: ReactNode;
  defaultAccount?: AccountType;
}

export function WlUserReactProvider({
  children,
  defaultAccount,
}: WlUserReactProviderProps) {
  return (
    <WlUserContext.Provider value={{ ...DefaultCtxData }}>
      {children}
    </WlUserContext.Provider>
  );
}

export function useWlUserReact(): WlUserContextType {
  const context = useContext(
    WlUserContext as Context<WlUserContextType | undefined>
  );
  if (!context)
    throw Error(
      'useWlUserReact can only be used within the WlUserReactProvider component'
    );
  return context;
}
