/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:29:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-08 19:35:35
 * @Description: file description
 */
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AuthorizerActionProviderProps,
  AuthorizerActionType,
} from '../../account';

export function ActionProvider({
  loginSuccess,
  bindSuccess,
  setDisptch,
}: AuthorizerActionProviderProps) {
  const dispatch = useCallback((actionType: AuthorizerActionType) => {
    switch (actionType) {
      case AuthorizerActionType.LOGIN:
        alert('twitter login');
        break;
      case AuthorizerActionType.BIND:
        alert('twitter bind');
        break;
    }
  }, []);
  useEffect(() => setDisptch(dispatch), [dispatch]);

  return null;
}