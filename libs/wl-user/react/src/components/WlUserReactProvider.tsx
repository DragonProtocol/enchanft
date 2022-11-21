import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';

import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import {
  getStorageValues,
  StorageKey,
  updateStorageByLogin,
  updateStorageByLogout,
  updateStorageByUserInfo,
} from '../utils/storage';
import LoginModal from './LoginModal';
import BindModal from './BindModal';
import UnbindConfirmModal from './UnbindConfirmModal';
import EditProfileModal from './EditProfileModal';
import { getUserDisplayName } from '../utils';
import { Authorizer, AuthorizerType } from '../authorizers';
import {
  Account,
  AccountType,
  AsyncRequestStatus,
  getUserInfo,
  setAuthFailedCallback,
  unbindAccount,
  updateUserInfo,
  User,
} from '../api';
import {
  DispatchActionModalParams,
  DispatchActionParams,
  WlUserActionType,
  WlUserModalType,
  WlUserReactContext,
  WlUserReactContextType,
} from '../contexts/wlUserReact';

Modal.setAppElement('#root');
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

export interface WlUserReactProviderProps {
  children: ReactNode;
  authorizers: Authorizer[];
  valueChange?: (value: WlUserReactContextType) => void;
}

export default function WlUserReactProvider({
  children,
  authorizers,
  valueChange,
}: WlUserReactProviderProps) {
  const cachedAuthorizers: MutableRefObject<
    WlUserReactProviderProps['authorizers']
  > = useRef(authorizers);
  // 确保传入授权对象，且都是静态传入的
  if (authorizers.length === 0) {
    throw new Error(
      'The list of authorizers is empty, please make sure to pass in at least one authorizer.'
    );
  }
  if (
    authorizers.length !== cachedAuthorizers.current.length ||
    authorizers.some(
      (authorizer, i) => authorizer !== cachedAuthorizers.current[i]
    )
  ) {
    throw new Error(
      'The authorizers prop passed to WlUserReactProvider must be referentially static.'
    );
  }

  const [user, setUser] = useState<User>({
    ...defaultUserData,
    id: Number(lastLoginInfo[StorageKey.LAST_LOGIN_USERID]),
    name: lastLoginInfo[StorageKey.LAST_LOGIN_NAME],
    avatar: lastLoginInfo[StorageKey.LAST_LOGIN_AVATAR],
    token: lastLoginInfo[StorageKey.LAST_LOGIN_TOKEN],
  });
  const [loginModal, setLoginModal] = useState<{ isOpen: boolean }>({
    isOpen: false,
  });
  const [bindModal, setBindModal] = useState<{
    isOpen: boolean;
    authorizer: Authorizer | null;
  }>({
    isOpen: false,
    authorizer: null,
  });
  const [unbindConfirmModal, setUnbindConfirmModal] = useState<{
    isOpen: boolean;
    authorizer: Authorizer | null;
    status: AsyncRequestStatus;
  }>({
    authorizer: null,
    isOpen: false,
    status: AsyncRequestStatus.IDLE,
  });
  const [editProfileModal, setEditProfileModal] = useState<{
    isOpen: boolean;
    status: AsyncRequestStatus;
  }>({
    isOpen: false,
    status: AsyncRequestStatus.IDLE,
  });

  const isLogin = useMemo(() => !!user.token, [user.token]);
  const validateBindAccount = useCallback(
    (accountType: AccountType): boolean =>
      user.accounts.some((account) => account.accountType === accountType),
    [user]
  );
  const getBindAccount = useCallback(
    (accountType: AccountType): Account | undefined =>
      user.accounts.find((account) => account.accountType === accountType),
    [user]
  );
  const getAuthorizer = useCallback(
    (authorizerType: AuthorizerType): Authorizer | undefined =>
      authorizers.find((authorizer) => authorizer.type === authorizerType),
    [authorizers]
  );
  const [authorizer, setAuthorizer] = useState<Authorizer | undefined>(
    getAuthorizer(lastLoginInfo[StorageKey.LAST_LOGIN_AUTHORIZER_TYPE])
  );
  // 获取一次用户信息, 同步为最新的
  const isInitFetchUser = useRef(false);
  useEffect(() => {
    if (!isInitFetchUser.current && user.token) {
      getUserInfo(user.token)
        .then((result) => {
          const { data } = result.data;
          const newUser = { ...user, ...data };
          setUser(newUser);
          const name = getUserDisplayName(
            newUser,
            getAuthorizer(lastLoginInfo[StorageKey.LAST_LOGIN_AUTHORIZER_TYPE])
          );
          updateStorageByUserInfo({ ...newUser, name });
        })
        .catch(() => {})
        .finally(() => {
          isInitFetchUser.current = true;
        });
    }
  }, [getAuthorizer, user]);

  // 监控成功回调，更新数据
  useEffect(() => {
    for (const item of authorizers) {
      item.action.loginListener({
        success: (result) => {
          setUser(result);
          setAuthorizer(item);
          updateStorageByLogin(item, result);
          setLoginModal({
            isOpen: false,
          });
        },
      });
      item.action.bindListener({
        success: (result) => {
          setUser({ ...user, accounts: result });
          setBindModal({
            isOpen: false,
            authorizer: null,
          });
        },
      });
    }
  }, [authorizers, user]);

  // 触发器
  const dispatchModal = useCallback(
    (params: DispatchActionModalParams) => {
      switch (params.type) {
        case WlUserModalType.LOGIN:
          setLoginModal({
            isOpen: true,
          });
          break;
        case WlUserModalType.BIND:
          setBindModal({
            isOpen: true,
            authorizer: getAuthorizer(params.payload),
          });
          break;
        case WlUserModalType.UNBIND_CONFIRM:
          setUnbindConfirmModal({
            ...unbindConfirmModal,
            isOpen: true,
            authorizer: getAuthorizer(params.payload),
          });
          break;
        case WlUserModalType.EDIT_PROFILE:
          setEditProfileModal({
            ...editProfileModal,
            isOpen: true,
          });
          break;
        // no default
      }
    },
    [unbindConfirmModal, editProfileModal, getAuthorizer]
  );

  const dispatchAction = useCallback(
    (params: DispatchActionParams) => {
      switch (params.type) {
        case WlUserActionType.LOGIN:
          getAuthorizer(params.payload).action.login();
          break;
        case WlUserActionType.BIND:
          getAuthorizer(params.payload).action.bind(user.token);
          break;
        case WlUserActionType.UNBIND:
          unbindAccount(user.token, getAuthorizer(params.payload).accountType)
            .then((result) => {
              setUser({ ...user, accounts: result.data });
              setUnbindConfirmModal({
                isOpen: false,
                authorizer: null,
                status: AsyncRequestStatus.IDLE,
              });
            })
            .catch((error) => {
              toast.error(error.message);
            });
          break;
        case WlUserActionType.UPDATE_USER_PROFILE:
          setEditProfileModal({
            ...editProfileModal,
            status: AsyncRequestStatus.PENDING,
          });
          updateUserInfo(user.token, {
            userName: params.payload.name,
            userAvatar: params.payload.avatar,
          })
            .then((result) => {
              setUser({ ...user, ...params.payload });
              updateStorageByUserInfo(params.payload);
              setEditProfileModal({
                isOpen: false,
                status: AsyncRequestStatus.IDLE,
              });
            })
            .catch((error) => {
              toast.error(error.message);
              setEditProfileModal({
                ...editProfileModal,
                status: AsyncRequestStatus.IDLE,
              });
            });
          break;
        case WlUserActionType.LOGOUT:
          setUser(defaultUserData);
          updateStorageByLogout();
          break;
        // no default
      }
    },
    [user, editProfileModal, getAuthorizer]
  );

  // 监听value变化（将provider内部的能力提供给provider外部）
  useEffect(() => {
    const wlUserContextValue = {
      authorizers,
      authorizer,
      user,
      isLogin,
      getAuthorizer,
      validateBindAccount,
      getBindAccount,
      dispatchModal,
      dispatchAction,
    };
    wlUserReactContextValue = wlUserContextValue;
    if (valueChange) {
      valueChange(wlUserContextValue);
    }
  }, [
    authorizers,
    authorizer,
    user,
    isLogin,
    getAuthorizer,
    validateBindAccount,
    getBindAccount,
    dispatchModal,
    dispatchAction,
    valueChange,
  ]);

  const authorizersElement = useMemo(
    () =>
      authorizers.map((item) => (
        <React.Fragment key={item.type}>
          {item.actionProviderElement ? item.actionProviderElement : null}
          {item.actionProcessComponent ? (
            <item.actionProcessComponent authorizer={item} />
          ) : null}
        </React.Fragment>
      )),
    [authorizers]
  );
  return (
    <WlUserReactContext.Provider
      value={useMemo(
        () => ({
          authorizers,
          authorizer,
          user,
          isLogin,
          getAuthorizer,
          validateBindAccount,
          getBindAccount,
          dispatchModal,
          dispatchAction,
        }),
        [
          authorizers,
          authorizer,
          user,
          isLogin,
          getAuthorizer,
          validateBindAccount,
          getBindAccount,
          dispatchModal,
          dispatchAction,
        ]
      )}
    >
      {children}
      <LoginModal
        isOpen={loginModal.isOpen}
        onRequestClose={() => setLoginModal({ isOpen: false })}
        shouldCloseOnOverlayClick
      />
      <BindModal
        isOpen={bindModal.isOpen}
        authorizer={bindModal.authorizer}
        onClose={() =>
          setBindModal({
            isOpen: false,
            authorizer: null,
          })
        }
      />
      <UnbindConfirmModal
        isOpen={unbindConfirmModal.isOpen}
        isLoading={unbindConfirmModal.status === AsyncRequestStatus.PENDING}
        authorizer={unbindConfirmModal.authorizer}
        onConfirm={(authorizerType) => {
          dispatchAction({
            type: WlUserActionType.UNBIND,
            payload: authorizerType,
          });
        }}
        onClose={() =>
          setUnbindConfirmModal({
            isOpen: false,
            authorizer: null,
            status: AsyncRequestStatus.IDLE,
          })
        }
      />
      <EditProfileModal
        isOpen={editProfileModal.isOpen}
        isLoading={editProfileModal.status === AsyncRequestStatus.PENDING}
        onClose={() =>
          setEditProfileModal({
            isOpen: false,
            status: AsyncRequestStatus.IDLE,
          })
        }
        onSave={(form) => {
          dispatchAction({
            type: WlUserActionType.UPDATE_USER_PROFILE,
            payload: form,
          });
        }}
      />
      {authorizersElement}
      <ToastContainer
        autoClose={2000}
        position="top-right"
        style={{ zIndex: 10000 }}
      />
    </WlUserReactContext.Provider>
  );
}