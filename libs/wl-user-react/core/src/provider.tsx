/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-20 10:16:22
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
import { Signer, SignerProcessStatus, SignerType } from './signer/types';
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
import Modal from 'react-modal';
import {
  ApiResp,
  getUserInfo,
  injectWlUserContextValue,
  login,
  updateUserInfo,
  UpdateUserInfoResult,
  uploadUserAvatar,
  UploadUserAvatarResult,
} from './api';
import UnbindConfirmModal from './components/UnbindConfirmModal';
import { toast, ToastContainer } from 'react-toastify';
Modal.setAppElement('#root');
export enum WlUserModalType {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
  UNBIND_CONFIRM = 'UNBIND_CONFIRM',
}
export enum WlUserActionType {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
  UNBIND = 'UNBIND',
  LOGOUT = 'LOGOUT',
  UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
  UPLOAD_USER_AVATAR = 'UPLOAD_USER_AVATAR',
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
      then?: (result: ApiResp<UpdateUserInfoResult>) => void;
      catch?: (error: Error) => void;
    }
  | {
      type: WlUserActionType.UPLOAD_USER_AVATAR;
      payload: File;
      then?: (result: UploadUserAvatarResult) => void;
      catch?: (error: Error) => void;
    }
  | {
      type: WlUserActionType.LOGOUT;
    };
type WlUserActionState = {
  type: WlUserActionType | null;
  signer: Signer | null;
  processStatus: SignerProcessStatus;
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
const volidOpenSignatureModal = (status: SignerProcessStatus) => {
  return [
    SignerProcessStatus.SIGNATURE_PENDING,
    SignerProcessStatus.SIGNATURE_REJECTED,
  ].includes(status);
};

export type WlUserContextType = {
  // 所有注入的signer实例
  signers: Signer[];
  // 当前登录的signer
  signer: Signer | null | undefined;
  // 用户信息
  user: User;
  isLogin: boolean;
  // 当前执行的action状态数据
  userActionState: WlUserActionState;
  getSigner: (signerType: SignerType) => Signer | undefined;
  // 验证是否绑定了某个账号
  volidBindAccount: (accountType: AccountType) => boolean;
  // 用于触发打开modal
  dispatchModal: (params: DispatchActionModalParams) => void;
  // 用于直接触发行为（省去打开modal的步骤）
  dispatchAction: (params: DispatchActionParams) => void;
};
const WlUserContext = createContext<WlUserContextType | undefined>(undefined);
export interface WlUserReactProviderProps {
  children: ReactNode;
  signers: Signer[];
  valueChange?: (value: WlUserContextType) => void;
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
  const getSigner = useCallback(
    (signerType: SignerType): Signer | undefined => {
      return signers.find((signer) => signer.signerType === signerType);
    },
    [signers]
  );
  const [signer, setSigner] = useState<Signer | null | undefined>(
    getSigner(lastLoginInfo[StorageKey.LAST_LOGIN_SIGNER_TYPE])
  );

  const [user, setUser] = useState<User>({
    ...defaultUserData,
    name: lastLoginInfo[StorageKey.LAST_LOGIN_NAME],
    avatar: lastLoginInfo[StorageKey.LAST_LOGIN_AVATAR],
    token: lastLoginInfo[StorageKey.LAST_LOGIN_TOKEN],
  });
  const isLogin = useMemo(() => !!user.token, [user.token]);
  const volidBindAccount = useCallback(
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

  // 获取一次用户信息
  useEffect(() => {
    if (user.token) {
      getUserInfo(user.token).then((result) => {
        setUser({ ...user, ...result.data.data });
      });
    }
  }, []);

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
  // 提供用户行为的触发器
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
      const updateUserActionStateAndListenProcess = (
        newState: Partial<WlUserActionState>
      ) => {
        setUserActionState({ ...userActionState, ...newState });
        // 监控流程状态变化
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
          updateUserActionStateAndListenProcess(state);
          state.signer
            ?.login()
            .then((result) => {
              setUser(result);
              setSigner(state.signer);
              setIsOpenLoginModal(false);
              resetUserActionState();
              state.signer &&
                updateStorageByLogin(state.signer.signerType, result);
            })
            .catch((error) => toast.error(error.message));
          break;
        case WlUserActionType.BIND:
          Object.assign(state, {
            signer: getSigner(params.payload),
          });
          updateUserActionStateAndListenProcess(state);
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
          updateUserActionStateAndListenProcess(state);
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
          setUserActionState({ ...userActionState, ...state });
          updateUserInfo(user.token, params.payload)
            .then((result) => {
              setUser({ ...user, ...params.payload });
              updateStorageByUserInfo(params.payload);
              if (params?.then) {
                params?.then(result.data);
              }
            })
            .catch((error) => {
              if (params?.catch) {
                params?.catch(error);
              }
            });
          break;
        case WlUserActionType.UPLOAD_USER_AVATAR:
          setUserActionState({ ...userActionState, ...state });
          uploadUserAvatar(user.token, params.payload)
            .then((result) => {
              setUser({ ...user, avatar: result.data.url });
              updateStorageByUserInfo({ avatar: result.data.url });
              if (params?.then) {
                params?.then(result.data);
              }
            })
            .catch((error) => {
              if (params?.catch) {
                params?.catch(error);
              }
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

  // 重试刚才的操作
  const handleRetry = useCallback(() => {
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
  }, [userActionState]);
  const isOpenSignatureModal = volidOpenSignatureModal(
    userActionState.processStatus
  );
  // 外部监听value变化
  useEffect(() => {
    const wlUserContextValue = {
      signers,
      signer,
      user,
      isLogin,
      userActionState,
      getSigner,
      volidBindAccount,
      dispatchModal,
      dispatchAction,
    };
    if (valueChange) {
      valueChange(wlUserContextValue);
      injectWlUserContextValue(wlUserContextValue);
    }
  }, [
    signers,
    signer,
    user,
    isLogin,
    userActionState,
    getSigner,
    volidBindAccount,
    dispatchModal,
    dispatchAction,
  ]);
  return (
    <WlUserContext.Provider
      value={{
        signers,
        signer,
        user,
        isLogin,
        userActionState,
        getSigner,
        volidBindAccount,
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
        signerProcessStatus={userActionState.processStatus}
        onClose={() => {
          resetUserActionState();
        }}
        onRetry={handleRetry}
      />
      <ToastContainer autoClose={2000} position="top-right" />
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
