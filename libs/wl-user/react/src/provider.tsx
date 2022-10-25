/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 19:15:27
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
import {
  AccountType,
  User,
  Signer,
  SignerProcessStatus,
  SignerType,
} from '@ecnft/wl-user-core';
import {
  getStorageValues,
  StorageKey,
  updateStorageByLogin,
  updateStorageByLogout,
  updateStorageByUserInfo,
} from './utils/storage';
import LoginModal from './components/LoginModal';
import SignatureModal from './components/SignatureModal';
import BindModal from './components/BindModal';
import UnbindConfirmModal from './components/UnbindConfirmModal';
import Modal from 'react-modal';
import {
  getUserInfo,
  updateUserInfo,
  setAuthFailedCallback,
} from '@ecnft/wl-user-core';
import { toast, ToastContainer } from 'react-toastify';
import EditProfileModal from './components/EditProfileModal';
import { getUserDisplayName } from './utils';
Modal.setAppElement('#root');
export enum WlUserModalType {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
  UNBIND_CONFIRM = 'UNBIND_CONFIRM',
  EDIT_PROFILE = 'EDIT_PROFILE',
}
export enum WlUserActionType {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
  UNBIND = 'UNBIND',
  LOGOUT = 'LOGOUT',
  UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
}
export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
type DispatchActionModalParams =
  | {
      type: WlUserModalType.LOGIN;
    }
  | {
      type: WlUserModalType.BIND;
      payload: SignerType;
    }
  | {
      type: WlUserModalType.UNBIND_CONFIRM;
      payload: SignerType;
    }
  | {
      type: WlUserModalType.EDIT_PROFILE;
    };
type DispatchActionParams =
  | {
      type: WlUserActionType.LOGIN;
      payload: SignerType;
    }
  | {
      type: WlUserActionType.BIND;
      payload: SignerType;
    }
  | {
      type: WlUserActionType.UNBIND;
      payload: SignerType;
    }
  | {
      type: WlUserActionType.UPDATE_USER_PROFILE;
      payload: Partial<User>;
    }
  | {
      type: WlUserActionType.LOGOUT;
    };
type WlUserActionProcessStatus = SignerProcessStatus | AsyncRequestStatus;
type WlUserActionState = {
  type: WlUserActionType | null;
  signer: Signer | null;
  processStatus: WlUserActionProcessStatus;
};
const defaultUserActionState = {
  type: null,
  signer: null,
  processStatus: SignerProcessStatus.IDLE,
};
const defaultUserData = {
  id: 0,
  name: '',
  avatar: '',
  accounts: [],
  roles: [],
  resourcePermissions: [],
  token: '',
};
const lastLoginInfo = getStorageValues();
const validateOpenSignatureModal = (status: WlUserActionProcessStatus) => {
  return [
    SignerProcessStatus.SIGNATURE_PENDING,
    SignerProcessStatus.SIGNATURE_REJECTED,
  ].includes(status as SignerProcessStatus);
};

export type WlUserReactContextType = {
  // 所有注入的signer实例
  signers: Signer[];
  // 当前登录的signer
  signer: Signer | null | undefined;
  // 用户信息
  user: User;
  // 是否登录
  isLogin: boolean;
  // 当前执行的action状态数据
  userActionState: WlUserActionState;
  // 获取指定的签名者对象
  getSigner: (signerType: SignerType) => Signer | undefined;
  // 验证是否绑定了某个账号
  validateBindAccount: (accountType: AccountType) => boolean;
  // 打开modal的触发器
  dispatchModal: (params: DispatchActionModalParams) => void;
  // 直接开始签名认证流程的触发器（省去打开modal的步骤）
  dispatchAction: (params: DispatchActionParams) => void;
};
const WlUserReactContext = createContext<WlUserReactContextType | undefined>(
  undefined
);
let wlUserReactContextValue: WlUserReactContextType | undefined;
// 设定token认证失效的回调
export const handleAuthFailed = () => {
  if (wlUserReactContextValue) {
    wlUserReactContextValue.dispatchAction({
      type: WlUserActionType.LOGOUT,
    });
    wlUserReactContextValue.dispatchModal({
      type: WlUserModalType.LOGIN,
    });
    toast.error('authentication failed, log in again!');
  }
};
setAuthFailedCallback(handleAuthFailed);

export interface WlUserReactProviderProps {
  children: ReactNode;
  signers: Signer[];
  valueChange?: (value: WlUserReactContextType) => void;
}

export function WlUserReactProvider({
  children,
  signers,
  valueChange,
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

  const [user, setUser] = useState<User>({
    ...defaultUserData,
    name: lastLoginInfo[StorageKey.LAST_LOGIN_NAME],
    avatar: lastLoginInfo[StorageKey.LAST_LOGIN_AVATAR],
    token: lastLoginInfo[StorageKey.LAST_LOGIN_TOKEN],
  });
  // 获取一次用户信息, 同步为最新的
  useEffect(() => {
    if (user.token) {
      getUserInfo(user.token).then((result) => {
        const { data } = result.data;
        const newUser = { ...user, ...data };
        setUser(newUser);
        const name = getUserDisplayName(
          newUser,
          lastLoginInfo[StorageKey.LAST_LOGIN_SIGNER_TYPE]
        );
        updateStorageByUserInfo({ ...newUser, name });
      });
    }
  }, []);

  const isLogin = useMemo(() => !!user.token, [user.token]);
  const validateBindAccount = useCallback(
    (accountType: AccountType): boolean => {
      switch (accountType) {
        case AccountType.TWITTER:
          /**
           * !!account.data 的检查是为了确定后端可以使用Twitter接口，可使用接口才允许Twitter相关操作
           * outh1.0a 的授权没有data
           * outh2.0 的授权有data (有data才说明可以使用Twitter)
           * 现在twitter login 走的outh1.0a授权, 再没有执行过twitter link程序(outh2.0 的授权)前，data就不会有值
           */
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
  const [userActionState, setUserActionState] = useState<WlUserActionState>(
    defaultUserActionState
  );
  const resetUserActionState = useCallback(() => {
    setUserActionState(defaultUserActionState);
  }, []);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenBindModal, setIsOpenBindModal] = useState(false);
  const [isOpenUnbindConfirmModal, setIsOpenUnbindConfirmModal] =
    useState(false);
  const isOpenSignatureModal = validateOpenSignatureModal(
    userActionState.processStatus
  );
  const [isOpenEditProfileModal, setIsOpenEditProfileModal] = useState(false);
  const getSigner = useCallback(
    (signerType: SignerType): Signer | undefined => {
      return signers.find((signer) => signer.signerType === signerType);
    },
    [signers]
  );
  const [signer, setSigner] = useState<Signer | undefined>(
    getSigner(lastLoginInfo[StorageKey.LAST_LOGIN_SIGNER_TYPE])
  );
  // 触发器
  const dispatchModal = useCallback(
    (params: DispatchActionModalParams) => {
      const { type } = params;
      const state = {
        type: null,
        processStatus: SignerProcessStatus.IDLE,
        signer: null,
      };
      switch (type) {
        case WlUserModalType.LOGIN:
          setIsOpenLoginModal(true);
          Object.assign(state, { type: WlUserActionType.LOGIN });
          break;
        case WlUserModalType.BIND:
          setIsOpenBindModal(true);
          Object.assign(state, {
            type: WlUserActionType.BIND,
            signer: getSigner(params.payload),
          });
          break;
        case WlUserModalType.UNBIND_CONFIRM:
          setIsOpenUnbindConfirmModal(true);
          Object.assign(state, {
            type: WlUserActionType.UNBIND,
            signer: getSigner(params.payload),
          });
          break;
        case WlUserModalType.EDIT_PROFILE:
          setIsOpenEditProfileModal(true);
          Object.assign(state, {
            type: WlUserActionType.UPDATE_USER_PROFILE,
          });
      }
      setUserActionState({ ...userActionState, ...state });
    },
    [userActionState]
  );
  const dispatchAction = useCallback(
    (params: DispatchActionParams) => {
      const { type } = params;
      const state: Partial<WlUserActionState> = {
        type: type,
        signer: null,
      };
      // 触发行为是初始化当前用户行为信息，如果行为有签名授权者参与则监听签名授权的流程状态
      const initUserActionStateAndListenProcess = (
        newState: Partial<WlUserActionState>
      ) => {
        setUserActionState({ ...userActionState, ...newState });
        // 监控流程状态变化，存储到当前的行为信息中
        newState.signer?.signerProcessStatusChangeListener((processStatus) => {
          setUserActionState({
            ...userActionState,
            ...newState,
            processStatus,
          });
        });
      };
      switch (params.type) {
        case WlUserActionType.LOGIN:
          Object.assign(state, {
            signer: getSigner(params.payload),
          });
          initUserActionStateAndListenProcess(state);
          state.signer
            ?.login()
            .then((result) => {
              setUser(result);
              setSigner(state.signer);
              state.signer &&
                updateStorageByLogin(state.signer.signerType, result);
              setIsOpenLoginModal(false);
              resetUserActionState();
            })
            .catch((error) => toast.error(error.message));
          break;
        case WlUserActionType.BIND:
          Object.assign(state, {
            signer: getSigner(params.payload),
          });
          initUserActionStateAndListenProcess(state);
          state.signer
            ?.bind(user.token)
            .then((result) => {
              setUser({ ...user, accounts: result });
              setIsOpenBindModal(false);
              resetUserActionState();
            })
            .catch((error) => toast.error(error.message));
          break;
        case WlUserActionType.UNBIND:
          Object.assign(state, {
            signer: getSigner(params.payload),
          });
          initUserActionStateAndListenProcess(state);
          state.signer
            ?.unbind(user.token)
            .then((result) => {
              setUser({ ...user, accounts: result });
              setIsOpenUnbindConfirmModal(false);
              resetUserActionState();
            })
            .catch((error) => toast.error(error.message));
          break;
        case WlUserActionType.UPDATE_USER_PROFILE:
          setUserActionState({
            ...userActionState,
            ...state,
            processStatus: AsyncRequestStatus.PENDING,
          });
          updateUserInfo(user.token, {
            userName: params.payload.name,
            userAvatar: params.payload.avatar,
          })
            .then((result) => {
              setUser({ ...user, ...params.payload });
              updateStorageByUserInfo(params.payload);
              setIsOpenEditProfileModal(false);
            })
            .catch((error) => toast.error(error.message))
            .finally(() => {
              setUserActionState({
                ...userActionState,
                ...state,
                processStatus: AsyncRequestStatus.IDLE,
              });
            });
          break;
        case WlUserActionType.LOGOUT:
          setUser(defaultUserData);
          updateStorageByLogout();
          break;
      }
    },
    [userActionState, user]
  );

  // 监听value变化（将provider内部的能力提供给provider外部）
  useEffect(() => {
    const wlUserContextValue = {
      signers,
      signer,
      user,
      isLogin,
      userActionState,
      getSigner,
      validateBindAccount,
      dispatchModal,
      dispatchAction,
    };
    wlUserReactContextValue = wlUserContextValue;
    if (valueChange) {
      valueChange(wlUserContextValue);
    }
  }, [
    signers,
    signer,
    user,
    isLogin,
    userActionState,
    getSigner,
    validateBindAccount,
    dispatchModal,
    dispatchAction,
  ]);
  return (
    <WlUserReactContext.Provider
      value={{
        signers,
        signer,
        user,
        isLogin,
        userActionState,
        getSigner,
        validateBindAccount,
        dispatchModal,
        dispatchAction,
      }}
    >
      {children}
      <LoginModal
        isOpen={isOpenLoginModal}
        onRequestClose={() => {
          setIsOpenLoginModal(false);
          resetUserActionState();
        }}
        shouldCloseOnOverlayClick={true}
      />
      <BindModal
        isOpen={isOpenBindModal && !!userActionState.signer?.signerType}
        signerType={userActionState.signer?.signerType || SignerType.METAMASK}
        onClose={() => {
          setIsOpenBindModal(false);
          resetUserActionState();
        }}
      />
      <UnbindConfirmModal
        isOpen={
          isOpenUnbindConfirmModal && !!userActionState.signer?.signerType
        }
        isLoading={
          userActionState.type === WlUserActionType.UNBIND &&
          userActionState.processStatus === SignerProcessStatus.UNBIND_PENDING
        }
        signerType={userActionState.signer?.signerType || SignerType.METAMASK}
        onConfirm={(signerType) => {
          dispatchAction({
            type: WlUserActionType.UNBIND,
            payload: signerType,
          });
        }}
        onClose={() => {
          setIsOpenUnbindConfirmModal(false);
          resetUserActionState();
        }}
      />
      <SignatureModal
        isOpen={isOpenSignatureModal}
        signerActionType={userActionState.type}
        signerProcessStatus={
          userActionState.processStatus as SignerProcessStatus
        }
        onClose={() => {
          resetUserActionState();
        }}
        onRetry={() => {
          // 重试刚才的操作
          if (userActionState.signer) {
            switch (userActionState.type) {
              case WlUserActionType.LOGIN:
              case WlUserActionType.BIND:
              case WlUserActionType.UNBIND:
                dispatchAction({
                  type: userActionState.type,
                  payload: userActionState.signer.signerType,
                });
                break;
            }
          }
        }}
      />
      <EditProfileModal
        isOpen={isOpenEditProfileModal}
        isLoading={
          userActionState.type === WlUserActionType.UPDATE_USER_PROFILE &&
          userActionState.processStatus === AsyncRequestStatus.PENDING
        }
        onClose={() => {
          setIsOpenEditProfileModal(false);
          resetUserActionState();
        }}
        onSave={(form) => {
          dispatchAction({
            type: WlUserActionType.UPDATE_USER_PROFILE,
            payload: form,
          });
        }}
      />
      <ToastContainer
        autoClose={2000}
        position="top-right"
        style={{ zIndex: 10000 }}
      />
    </WlUserReactContext.Provider>
  );
}

export function useWlUserReact(): WlUserReactContextType {
  const context = useContext(
    WlUserReactContext as Context<WlUserReactContextType | undefined>
  );
  if (!context)
    throw Error(
      'useWlUserReact can only be used within the WlUserReactProvider component'
    );
  return context;
}
