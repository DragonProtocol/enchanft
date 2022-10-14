/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 19:11:26
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

export enum WlUserAction {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
}
type ModalStatus = {
  [k in WlUserAction]: boolean;
};
const defaultModalStatus: ModalStatus = {
  [WlUserAction.LOGIN]: false,
  [WlUserAction.BIND]: false,
};
type DispatchUserActions = {
  [WlUserAction.LOGIN]: (action: WlUserAction) => void;
  [WlUserAction.BIND]: (action: WlUserAction, signerType: SignerType) => void;
};

type DispatchUserActionReturnType<T extends WlUserAction> = ReturnType<
  () => DispatchUserActions[T]
>;
type DispatchUserAction = () => void;
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
  updateUser: (values: Partial<User>) => void;
  volidBindAccount: (accountType: AccountType) => boolean;
  dispatchUserAction: (
    actionType: WlUserAction,
    signerType: SignerType
  ) => void;
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

  // 提供一个用户行为的触发器
  const [modalStatus, setModalStatus] =
    useState<ModalStatus>(defaultModalStatus);
  const [userActionSignerType, setUserActionSignerType] = useState<SignerType>(
    SignerType.TWITTER
  );
  const dispatchUserAction = useCallback(
    (action: WlUserAction, signerType: SignerType) => {
      setModalStatus({ ...modalStatus, [action]: true });
      setUserActionSignerType(signerType);
    },
    [modalStatus]
  );
  // 用户系统流程状态监控
  const [signerProcessStatus, setSignerProcessStatus] =
    useState<SignerProcessStatus>(SignerProcessStatus.IDLE);
  useEffect(() => {
    for (const signer of signers) {
      signer.signerProcessStatusChangeListener((status) => {
        setSignerProcessStatus(status);
      });
    }
  }, [signers]);
  const isOpenSignerModal = volidOpenSignatureModal(signerProcessStatus);

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

  return (
    <WlUserContext.Provider
      value={{
        signers,
        signer,
        setSigner,
        user,
        updateUser,
        isLogin,
        isCreator,
        isAdmin,
        isVIP,
        volidBindAccount,
        dispatchUserAction,
      }}
    >
      {children}
      <LoginModal
        isOpen={modalStatus[WlUserAction.LOGIN]}
        onLoginEnd={() =>
          setModalStatus({ ...modalStatus, [WlUserAction.LOGIN]: false })
        }
      />
      <BindModal
        isOpen={modalStatus[WlUserAction.BIND] && !!userActionSignerType}
        signerType={userActionSignerType}
        onBindEnd={() =>
          setModalStatus({ ...modalStatus, [WlUserAction.BIND]: false })
        }
      />
      <SignatureModal
        isOpen={isOpenSignerModal}
        signerProcessStatus={signerProcessStatus}
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
