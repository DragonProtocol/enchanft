/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-25 12:08:36
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
import { listenWindowClose, openOauthWindow } from '../../utils';
import {
  LoginActionStaticFunction,
  BindActionStaticFunction,
  createActionConfigByStaticFunction,
} from '../actionConfig';
import {
  AuthorizerActionProcessStatus,
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
} from '../authorizer';
import iconUrl from './icon.svg';

export interface DiscordArgs {
  discordClientId: string;
  oauthCallbackUri: string;
}
export enum DiscordEventType {
  DISCORD_BIND_OAUTH_CALLBACK = 'DISCORD_BIND_OAUTH_CALLBACK',
}
export type DiscordBindCallbackParams = {
  code: string;
};
export enum DiscordErrorName {
  OAUTH_WINDOW_CLOSE = 'OAUTH_WINDOW_CLOSE',
}
const ErrorName = { ...DiscordErrorName, ...ApiErrorName };
const DiscordErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.OAUTH_WINDOW_CLOSE]: 'discord authorization window closes',
  ...ApiErrorMessageMap,
};
export class DiscordError extends Error {
  public constructor(name: keyof typeof ErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || DiscordErrorMessageMap[name];
  }
}

export const getApiDiscordOauth2Url = (
  discordClientId: string,
  oauthCallbackUri: string
) => `https://discord.com/oauth2/authorize?
response_type=code&
client_id=${discordClientId}&
scope=identify%20guilds&
state=15773059ghq9183habn&
redirect_uri=${oauthCallbackUri}&
prompt=consent`;

enum ListenDiscordOauthStorageKey {
  LISTEN_DISCORD_OAUTH_STATUS = 'LISTEN_DISCORD_OAUTH_STATUS',
  LISTEN_DISCORD_OAUTH_CODE = 'LISTEN_DISCORD_OAUTH_CODE',
}
enum ListenDiscordOauthStatus {
  START = 'START',
  END = 'END',
}

const clearListenDiscordOauthStorage = () => {
  localStorage.removeItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_STATUS
  );
  localStorage.removeItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE
  );
};
const startListenDiscordOauthStorage = () => {
  localStorage.setItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_STATUS,
    ListenDiscordOauthStatus.START
  );
};
const endListenDiscordOauthStorage = () => {
  localStorage.setItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_STATUS,
    ListenDiscordOauthStatus.END
  );
};
const setDiscordOauthCodeStorage = (code: string) => {
  localStorage.setItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE,
    code
  );
};
const isStartListenDiscordOauthStorage = () =>
  localStorage.getItem(
    ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_STATUS
  ) === ListenDiscordOauthStatus.START;
const oauthCallbackUrlListener = (oauthCallbackUri: string) => {
  if (window.location.href.startsWith(oauthCallbackUri)) {
    if (!isStartListenDiscordOauthStorage()) return;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      endListenDiscordOauthStorage();
      setDiscordOauthCodeStorage(code);
      window.close();
    }
  }
};
export default ({
  discordClientId,
  oauthCallbackUri,
}: DiscordArgs): Authorizer => {
  const authorizer = {
    type: AuthorizerType.DISCORD,
    accountType: AccountType.DISCORD,
    webVersion: AuthorizerWebVersion.web2,
    name: 'Discord',
    bgColor: '#5368ED',
    nameColor: '#FFFFFF',
    iconUrl,
    actionProcessComponent: AuthProcessModal,
  };
  oauthCallbackUrlListener(oauthCallbackUri);
  // login action
  const loginAction: LoginActionStaticFunction = (
    onLoginProcess,
    onLoginSuccess,
    onLoginError
  ) => {
    onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    try {
      startListenDiscordOauthStorage();
      const url = getApiDiscordOauth2Url(discordClientId, oauthCallbackUri);
      const authWindow = openOauthWindow(url);
      const handleDiscordCallback = (e: StorageEvent) => {
        const { key, newValue } = e;
        if (
          key === ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE &&
          newValue
        ) {
          window.removeEventListener('storage', handleDiscordCallback);
          clearListenDiscordOauthStorage();
          onLoginProcess(AuthorizerActionProcessStatus.API_PENDING);
          // 2. fetch discord bind
          login({
            type: authorizer.accountType,
            code: newValue,
            callback: oauthCallbackUri,
          })
            .then((result) => {
              onLoginProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onLoginSuccess(result.data);
            })
            .catch((error: Error) => {
              onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onLoginError(
                new DiscordError(
                  ErrorName.API_REQUEST_LOGIN_ERROR,
                  error.message
                )
              );
            });
        }
      };
      // 1. listen discord login oauth callback
      window.addEventListener('storage', handleDiscordCallback);
      if (authWindow) {
        listenWindowClose(authWindow, () => {
          if (isStartListenDiscordOauthStorage()) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
            onLoginError(new DiscordError(ErrorName.OAUTH_WINDOW_CLOSE));
          }
        });
      }
    } catch (error) {
      onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onLoginError(error as Error);
    }
  };
  // bind action
  const bindAction: BindActionStaticFunction = (
    token,
    onBindProcess,
    onBindSuccess,
    onBindError
  ) => {
    onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    try {
      startListenDiscordOauthStorage();
      const url = getApiDiscordOauth2Url(discordClientId, oauthCallbackUri);
      const authWindow = openOauthWindow(url);
      const handleDiscordCallback = (e: StorageEvent) => {
        const { key, newValue } = e;
        if (
          key === ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE &&
          newValue
        ) {
          window.removeEventListener('storage', handleDiscordCallback);
          clearListenDiscordOauthStorage();
          onBindProcess(AuthorizerActionProcessStatus.API_PENDING);
          // 2. fetch discord bind
          bindAccount(token, {
            type: authorizer.accountType,
            code: newValue,
            callback: oauthCallbackUri,
          })
            .then((result) => {
              onBindProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onBindSuccess(result.data);
            })
            .catch((error: Error) => {
              onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onBindError(
                new DiscordError(
                  ErrorName.API_REQUEST_BIND_ERROR,
                  error.message
                )
              );
            });
        }
      };
      // 1. listen discord bind oauth callback
      window.addEventListener('storage', handleDiscordCallback);
      if (authWindow) {
        listenWindowClose(authWindow, () => {
          if (isStartListenDiscordOauthStorage()) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
            onBindError(new DiscordError(ErrorName.OAUTH_WINDOW_CLOSE));
          }
        });
      }
    } catch (error) {
      onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onBindError(error as Error);
    }
  };
  return {
    ...authorizer,
    action: createActionConfigByStaticFunction(loginAction, bindAction),
  };
};
