/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-30 18:30:07
 * @Description: file description
 */
import type { Context, ReactNode } from 'react';
import React, { createContext, useContext, useRef } from 'react';

export type WlUserContextType = {
  phantomValid: boolean;
  metaMaskValid: boolean;
  martianValid: boolean;
};
const DefaultCtxData: WlUserContextType = {
  phantomValid: false,
  metaMaskValid: false,
  martianValid: false,
};

const WlUserContext = createContext<WlUserContextType | undefined>(undefined);

export interface WlUserReactProviderProps {
  children: ReactNode;
}

export function WlUserReactProvider({ children }: WlUserReactProviderProps) {
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
