/*
 * @AccountAuthorizeror: shixuewen friendlysxw@163.com
 * @Date: 2022-11-08 15:12:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-08 19:05:20
 * @Description: file description
 */
import {
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { AuthorizerActionType } from '../account';
export interface BaseAuthorizerActionProviderProps {
  children: ReactNode;
  dispatchRef: (actionType: AuthorizerActionType) => void;
  dispatch?: (actionType: AuthorizerActionType) => void;
}
export function BaseAuthorizerActionProvider({
  children,
  dispatch,
}: BaseAuthorizerActionProviderProps) {
  useEffect(() => {}, [dispatch]);
  return children;
}
