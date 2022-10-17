/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-17 03:44:59
 * @Description: file description
 */
import {
  Context,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import React, { createContext, useContext, useRef } from 'react';
import { AccountType, RoleType, User } from './types';
import { Signer, SignerProcessStatus, SignerType } from './signer';
import { getStorageValues, StorageKey } from './utils/storage';
import LoginModal from './components/LoginModal';
import SignatureModal from './components/SignatureModal';
import BindModal from './components/BindModal';
export enum WlUserActionType {
  OPEN_LOGIN_MODAL = 'OPEN_LOGIN_MODAL',
  OPEN_BIND_MODAL = 'OPEN_BIND_MODAL',
  UPDATE_USER_STATE = 'UPDATE_USER_STATE',
}
type WlUserDispatchParams =
  | {
      type: WlUserActionType.OPEN_LOGIN_MODAL;
    }
  | {
      type: WlUserActionType.OPEN_BIND_MODAL;
      payload: SignerType;
    }
  | {
      type: WlUserActionType.UPDATE_USER_STATE;
      payload: Partial<User>;
    };
const defaultUserActionState = {
  type: null,
  signer: null,
  processStatus: SignerProcessStatus.IDLE,
};
const lastLoginInfo = getStorageValues();
const volidOpenSignatureModal = (status: SignerProcessStatus) => {
  return [
    SignerProcessStatus.BIND_PENDING,
    SignerProcessStatus.BIND_REJECTED,
    SignerProcessStatus.SIGNATURE_PENDING,
    SignerProcessStatus.SIGNATURE_REJECTED,
  ].includes(status);
};
export type WlUserContextType = {
  signers: Signer[];
  signer: Signer | null | undefined;
  user: User;
  isLogin: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isVIP: boolean;
  setSigner: (signer: Signer) => void;
  volidBindAccount: (accountType: AccountType) => boolean;
  wlUserDispatch: (params: WlUserDispatchParams) => void;
};
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
  const volidBindAccount = useCallback(
    (accountType: AccountType): boolean => {
      switch (accountType) {
        case AccountType.TWITTER:
          return user.accounts.some(
            (account) =>
              account.accountType === AccountType.TWITTER && !!account.data
          );
        default:
          return user.accounts.some(
            (account) => account.accountType === accountType
          );
      }
    },
    [user]
  );

  // 用户行为及流程状态监控
  const [userActionState, setUserActionState] = useState<{
    type: WlUserActionType | null;
    signer: Signer | null;
    processStatus: SignerProcessStatus;
  }>(defaultUserActionState);
  const resetUserActionState = useCallback(() => {
    setUserActionState(defaultUserActionState);
  }, []);
  // 提供一个用户行为的触发器
  const wlUserDispatch = useCallback(
    (params: WlUserDispatchParams) => {
      const { type } = params;
      const state = {
        type,
      };
      switch (type) {
        case WlUserActionType.OPEN_BIND_MODAL:
          Object.assign(state, {
            signer: signers.find((item) => item.signerType === params.payload),
          });
          break;
        case WlUserActionType.UPDATE_USER_STATE:
          setUser({ ...user, ...params.payload });
          break;
      }
      setUserActionState({ ...userActionState, ...state });
    },
    [user]
  );
  const isOpenLoginModal = useMemo(
    () => userActionState.type === WlUserActionType.OPEN_LOGIN_MODAL,
    [userActionState]
  );
  const isOpenBindModal = useMemo(
    () => userActionState.type === WlUserActionType.OPEN_BIND_MODAL,
    [userActionState]
  );

  useEffect(() => {
    for (const signer of signers) {
      signer.signerProcessStatusChangeListener((processStatus) => {
        setUserActionState({
          ...userActionState,
          processStatus,
        });
      });
    }
  }, [signers, userActionState]);

  const isOpenSignatureModal = volidOpenSignatureModal(
    userActionState.processStatus
  );
  return (
    <WlUserContext.Provider
      value={{
        signers,
        signer,
        setSigner,
        user,
        isLogin,
        isCreator,
        isAdmin,
        isVIP,
        volidBindAccount,
        wlUserDispatch,
      }}
    >
      {children}
      <LoginModal
        isOpen={isOpenLoginModal}
        onLoginEnd={() => resetUserActionState()}
      />
      <BindModal
        isOpen={isOpenBindModal}
        signerType={userActionState.signer?.signerType || SignerType.METAMASK}
        onBindEnd={() => resetUserActionState()}
      />
      <SignatureModal
        isOpen={isOpenSignatureModal}
        signerProcessStatus={userActionState.processStatus}
        onClose={() => {
          resetUserActionState();
        }}
        onRetry={() => {
          if (userActionState?.type === WlUserActionType.OPEN_LOGIN_MODAL) {
            userActionState.signer?.login();
          } else if (
            userActionState?.type === WlUserActionType.OPEN_BIND_MODAL
          ) {
            userActionState.signer?.bind(user.token);
          }
        }}
      />
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
