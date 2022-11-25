/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-17 15:36:32
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-25 12:22:16
 * @Description: file description
 */
import { createContext } from 'react';
import { User, AccountType, Account } from '../api';
import { AuthorizerType, Authorizer } from '../authorizers/authorizer';

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
export type DispatchActionModalParams =
  | {
    type: WlUserModalType.LOGIN;
  }
  | {
    type: WlUserModalType.BIND;
    payload: AuthorizerType;
  }
  | {
    type: WlUserModalType.UNBIND_CONFIRM;
    payload: AuthorizerType;
  }
  | {
    type: WlUserModalType.EDIT_PROFILE;
  };
export type DispatchActionParams =
  | {
    type: WlUserActionType.LOGIN;
    payload: AuthorizerType;
  }
  | {
    type: WlUserActionType.BIND;
    payload: AuthorizerType;
  }
  | {
    type: WlUserActionType.UNBIND;
    payload: AuthorizerType;
  }
  | {
    type: WlUserActionType.UPDATE_USER_PROFILE;
    payload: Partial<User>;
  }
  | {
    type: WlUserActionType.LOGOUT;
  };

export type WlUserReactContextType = {
  // 所有注入的authorizer实例
  authorizers: Authorizer[];
  // 当前登录的authorizer
  authorizer: Maybe<Authorizer>;
  // 用户信息
  user: User;
  // 是否登录
  isLogin: boolean;
  // 获取指定的签名者对象
  getAuthorizer: (authorizerType: AuthorizerType) => Maybe<Authorizer>;
  // 验证是否绑定了某个账号
  validateBindAccount: (accountType: AccountType) => boolean;
  // 获取绑定的账号
  getBindAccount: (accountType: AccountType) => Maybe<Account>;
  // 打开modal的触发器
  dispatchModal: (params: DispatchActionModalParams) => void;
  // 指定行为的触发器
  dispatchAction: (params: DispatchActionParams) => void;
};
export const WlUserReactContext = createContext<
  WlUserReactContextType | undefined
>(undefined);
