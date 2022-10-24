/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:45:42
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  LoginResult,
  AccountType,
} from '../api';
import { SignerType, Signer, SignerProcessStatus } from './types';
import { openOauthWindow } from '../utils';
export interface DiscordConstructorArgs {
  discordClientId: string;
  oauthCallbackUri: string;
}
export enum DiscordEventType {
  DISCORD_BIND_OAUTH_CALLBACK = 'DISCORD_BIND_OAUTH_CALLBACK',
}
export type DiscordBindCallbackParams = {
  code: string;
};
interface DiscordEventMap {
  [DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK]: CustomEvent<DiscordBindCallbackParams>;
}
interface DiscordOauthWindow extends Window {
  addEventListener<K extends keyof DiscordEventMap>(
    type: K,
    listener: (this: Window, ev: DiscordEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof DiscordEventMap>(
    type: K,
    listener: (this: Window, ev: DiscordEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}
export enum DiscordErrorName {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
type ErrorName = DiscordErrorName | ApiErrorName;
const ErrorName = { ...DiscordErrorName, ...ApiErrorName };
const DiscordErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.UNKNOWN_ERROR]: 'UNKNOWN_ERROR',
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

export class Discord extends Signer {
  readonly signerType = SignerType.DISCORD;
  readonly accountType = AccountType.DISCORD;
  private discordClientId = '';
  private oauthCallbackUri = '';
  private bindOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        window.dispatchEvent(
          new CustomEvent(DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK, {
            detail: { code },
          })
        );
      }
    }
  }
  constructor({ discordClientId, oauthCallbackUri }: DiscordConstructorArgs) {
    super();
    this.discordClientId = discordClientId;
    this.oauthCallbackUri = oauthCallbackUri;
    this.bindOauthCallbackUrlListener();
  }

  public login(): Promise<LoginResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
      reject('Currently not supported');
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
      try {
        const url = getApiDiscordOauth2Url(
          this.discordClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url) as DiscordOauthWindow;
        const handleDiscordCallback = async (
          e: DiscordEventMap[DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK]
        ) => {
          (window as DiscordOauthWindow).removeEventListener(
            DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK,
            handleDiscordCallback
          );
          authWindow?.close();
          // 2. fetch discord bind
          const { code } = e.detail;
          bindAccount(token, {
            type: this.accountType,
            code,
          })
            .then((result) => {
              this.signerProcessStatusChange(
                SignerProcessStatus.BIND_FULFILLED
              );
              resolve(result.data);
            })
            .catch((error) => {
              this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
              reject(
                new DiscordError(
                  ErrorName.API_REQUEST_BIND_ERROR,
                  error.message
                )
              );
            });
        };
        // 1. listen discord bind oauth callback
        (window as DiscordOauthWindow).addEventListener(
          DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK,
          handleDiscordCallback
        );
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(error);
      }
    });
  }
}
