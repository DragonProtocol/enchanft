/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 12:10:11
 * @Description: file description
 */
import {
  Context,
  MutableRefObject,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import React, { createContext, useContext, useRef } from 'react';
import { RoleType, User } from './types';
import { Signer, SignerType } from './signer';
import { getStorageValues, StorageKey } from './utils/storage';
export type WlUserContextType = {
  signer: Signer | null | undefined;
  user: User;
  isLogin: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isVIP: boolean;
  setSigner: (signer: Signer) => void;
  updateUser: (values: Partial<User>) => void;
};

const lastLoginInfo = getStorageValues();

const WlUserContext = createContext<WlUserContextType | undefined>(undefined);

export interface WlUserReactProviderProps {
  children: ReactNode;
  signers: Signer[];
}

export function WlUserReactProvider({
  children,
  signers,
}: WlUserReactProviderProps) {
  const cachedSigners: MutableRefObject<WlUserReactProviderProps['signers']> =
    useRef(signers);
  // 确保授权对象都是静态传入的
  if (
    signers.length != cachedSigners.current.length ||
    signers.some((signer, i) => signer !== cachedSigners.current[i])
  )
    throw new Error(
      'The signers prop passed to WlUserReactProvider must be referentially static.'
    );
  const [signer, setSigner] = useState<Signer | null | undefined>(
    cachedSigners.current.find(
      (item) =>
        item.signerType === lastLoginInfo[StorageKey.LAST_LOGIN_SIGNER_TYPE]
    )
  );
  const [user, setUser] = useState<User>({
    id: 0,
    name: lastLoginInfo[StorageKey.LAST_LOGIN_NAME],
    avatar: lastLoginInfo[StorageKey.LAST_LOGIN_AVATAR],
    accounts: [],
    roles: [],
    resourcePermissions: [],
    token: lastLoginInfo[StorageKey.LAST_LOGIN_TOKEN],
  });
  const isLogin = useMemo(() => !!user.token, [user.token]);
  const isCreator = useMemo(
    () => user.roles.includes(RoleType.CREATOR),
    [user.roles]
  );
  const isAdmin = useMemo(
    () => user.roles.includes(RoleType.ADMIN),
    [user.roles]
  );
  const isVIP = useMemo(() => user.roles.includes(RoleType.VIP), [user.roles]);
  const updateUser = useCallback(
    (values: Partial<User>) => setUser({ ...user, ...values }),
    [user]
  );
  return (
    <WlUserContext.Provider
      value={{
        signer,
        user,
        isLogin,
        isCreator,
        isAdmin,
        isVIP,
        setSigner,
        updateUser,
      }}
    >
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
