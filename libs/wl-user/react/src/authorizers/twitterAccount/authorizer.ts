/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-13 12:18:32
 * @Description: file description
 */
import {
  AccountType,
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  login,
} from '../../api';
import AuthProcessModal from '../../components/AuthProcessModal/AuthProcessModal';
import { openOauthWindow } from '../../utils';
import {
  LoginActionStaticFunction,
  BindActionStaticFunction,
  createActionConfigByStaticFunction,
} from '../actionConfig';
import {
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
  AuthorizerActionProcessStatus,
} from '../authorizer';
import iconUrl from './icon.svg';
export interface TwitterAccountArgs {
  twitterClientId: string;
  oauthCallbackUri: string;
}

export enum TwitterEventType {
  TWITTER_LOGIN_OAUTH_CALLBACK = 'TWITTER_LOGIN_OAUTH_CALLBACK',
  TWITTER_BIND_OAUTH_CALLBACK = 'TWITTER_BIND_OAUTH_CALLBACK',
}
export type TwitterLoginCallbackParams = {
  oauthToken: string;
  oauthVerifier: string;
};
export type TwitterBindCallbackParams = {
  code: string;
};
export enum TwitterErrorName {
  OAUTH_WINDOW_CLOSE = 'OAUTH_WINDOW_CLOSE',
}
type ErrorName = TwitterErrorName | ApiErrorName;
const ErrorName = { ...TwitterErrorName, ...ApiErrorName };
const TwitterErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.OAUTH_WINDOW_CLOSE]: 'twitter authorization window closes',
  ...ApiErrorMessageMap,
};
export class TwitterError extends Error {
  public constructor(name: keyof typeof ErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || TwitterErrorMessageMap[name];
  }
}

export const getApiTwitterOauth1Url = (oauthToken: string) =>
  `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
export const getApiTwitterOauth2Url = (
  twitterClientId: string,
  oauthCallbackUri: string
) => `https://twitter.com/i/oauth2/authorize?
response_type=code&
client_id=${twitterClientId}&
redirect_uri=${oauthCallbackUri}&
scope=bookmark.read+block.read+like.read+list.read+follows.read+space.read+mute.read+tweet.read+users.read+offline.access&
state=3063390848298.8647&
code_challenge=challenge&
code_challenge_method=plain`;
enum ListenTwitterOauthStorageKey {
  LISTEN_TWITTER_OAUTH_STATUS = 'LISTEN_TWITTER_OAUTH_STATUS',
  LISTEN_TWITTER_OAUTH_CODE = 'LISTEN_TWITTER_OAUTH_CODE',
}
enum ListenTwitterOauthStatus {
  START = 'START',
  END = 'END',
}

const clearListenTwitterOauthStorage = () => {
  localStorage.removeItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_STATUS
  );
  localStorage.removeItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_CODE
  );
};
const startListenTwitterOauthStorage = () => {
  localStorage.setItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_STATUS,
    ListenTwitterOauthStatus.START
  );
};
const endListenTwitterOauthStorage = () => {
  localStorage.setItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_STATUS,
    ListenTwitterOauthStatus.END
  );
};
const setTwitterOauthCodeStorage = (code: string) => {
  localStorage.setItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_CODE,
    code
  );
};
const isStartListenTwitterOauthStorage = () =>
  localStorage.getItem(
    ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_STATUS
  ) === ListenTwitterOauthStatus.START;

function oauthCallbackUrlListener(oauthCallbackUri: string) {
  if (location.href.startsWith(oauthCallbackUri)) {
    if (!isStartListenTwitterOauthStorage()) return;
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    if (code) {
      endListenTwitterOauthStorage();
      setTwitterOauthCodeStorage(code);
      window.close();
    }
  }
}
export default ({
  twitterClientId,
  oauthCallbackUri,
}: TwitterAccountArgs): Authorizer => {
  const authorizer = {
    type: AuthorizerType.TWITTER,
    accountType: AccountType.TWITTER,
    webVersion: AuthorizerWebVersion.web2,
    name: 'Twitter',
    bgColor: '#4D93F1',
    nameColor: '#FFFFFF',
    iconUrl,
    actionProcessComponent: AuthProcessModal,
  };
  oauthCallbackUrlListener(oauthCallbackUri);
  const loginAction: LoginActionStaticFunction = (
    onLoginProcess,
    onLoginSuccess,
    onLoginError
  ) => {
    try {
      startListenTwitterOauthStorage();
      const url = getApiTwitterOauth2Url(twitterClientId, oauthCallbackUri);
      openOauthWindow(url);
      const handleTwitterCallback = (e: StorageEvent) => {
        const { key, newValue } = e;
        if (
          key === ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_CODE &&
          newValue
        ) {
          window.removeEventListener('storage', handleTwitterCallback);
          clearListenTwitterOauthStorage();
          onLoginProcess(AuthorizerActionProcessStatus.API_PENDING);
          login({
            type: authorizer.accountType,
            code: newValue,
            callback: oauthCallbackUri,
          })
            .then((result) => {
              onLoginProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onLoginSuccess(result.data);
            })
            .catch((error) => {
              onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onLoginError(
                new TwitterError(
                  ErrorName.API_REQUEST_LOGIN_ERROR,
                  error.message
                )
              );
            });
        }
      };
      window.addEventListener('storage', handleTwitterCallback);
    } catch (error) {
      onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onLoginError(error);
    }
  };
  const bindAction: BindActionStaticFunction = (
    token,
    onBindProcess,
    onBindSuccess,
    onBindError
  ) => {
    try {
      startListenTwitterOauthStorage();
      const url = getApiTwitterOauth2Url(twitterClientId, oauthCallbackUri);
      openOauthWindow(url);
      const handleTwitterCallback = (e: StorageEvent) => {
        const { key, newValue } = e;
        if (
          key === ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_CODE &&
          newValue
        ) {
          window.removeEventListener('storage', handleTwitterCallback);
          clearListenTwitterOauthStorage();
          onBindProcess(AuthorizerActionProcessStatus.API_PENDING);
          bindAccount(token, {
            type: authorizer.accountType,
            code: newValue,
            callback: oauthCallbackUri,
          })
            .then((result) => {
              onBindProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onBindSuccess(result.data);
            })
            .catch((error) => {
              onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onBindError(
                new TwitterError(
                  ErrorName.API_REQUEST_BIND_ERROR,
                  error.message
                )
              );
            });
        }
      };
      window.addEventListener('storage', handleTwitterCallback);
    } catch (error) {
      onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onBindError(error);
    }
  };
  return {
    ...authorizer,
    action: createActionConfigByStaticFunction(loginAction, bindAction),
  };
};
