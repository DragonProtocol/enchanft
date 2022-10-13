/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 11:39:46
 * @Description: file description
 */
import {
  bindAccount,
  BindResult,
  LoginResult,
  unbindAccount,
  UnBindResult,
} from '../api';
import { openOauthWindow } from '../utils';
import { SignerType, Signer, SignerAccountTypeMap } from './index';
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
  FETCH_DISCORD_BIND_ERROR = 'FETCH_DISCORD_BIND_ERROR',
  FETCH_DISCORD_UNBIND_ERROR = 'FETCH_DISCORD_UNBIND_ERROR',
}
const DiscordErrorMessageMap: { [name in DiscordErrorName]: string } = {
  [DiscordErrorName.FETCH_DISCORD_BIND_ERROR]: 'FETCH_DISCORD_BIND_ERROR',
  [DiscordErrorName.FETCH_DISCORD_UNBIND_ERROR]: 'FETCH_DISCORD_UNBIND_ERROR',
};
export class DiscordError extends Error {
  public constructor(name: DiscordErrorName, message?: string) {
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
  public get signerType() {
    return SignerType.DISCORD;
  }
  public discordClientId = '';
  public oauthCallbackUri = '';

  constructor({ discordClientId, oauthCallbackUri }: DiscordConstructorArgs) {
    super();
    this.discordClientId = discordClientId;
    this.oauthCallbackUri = oauthCallbackUri;
    this.bindOauthCallbackUrlListener();
  }

  public login(): Promise<LoginResult> {
    return new Promise(async (resolve, reject) => {
      reject('Currently not supported');
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = getApiDiscordOauth2Url(
          this.discordClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url) as DiscordOauthWindow;
        const handleDiscordCallback = async (
          e: DiscordEventMap[DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK]
        ) => {
          authWindow?.removeEventListener(
            DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK,
            handleDiscordCallback
          );
          authWindow?.close();
          // 2. fetch discord bind
          const { code } = e.detail;
          const result = await bindAccount(token, {
            type: SignerAccountTypeMap[this.signerType],
            code,
          });
          if (result.data.code === 0) {
            resolve(result.data.data);
          } else {
            reject(
              new DiscordError(
                DiscordErrorName.FETCH_DISCORD_BIND_ERROR,
                result.data.msg
              )
            );
          }
        };
        // 1. listen discord bind oauth callback
        authWindow?.addEventListener(
          DiscordEventType.DISCORD_BIND_OAUTH_CALLBACK,
          handleDiscordCallback
        );
      } catch (error) {
        throw error;
      }
    });
  }
  public unbind(token: string): Promise<UnBindResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await unbindAccount(
          token,
          SignerAccountTypeMap[this.signerType]
        );
        if (result.data.code === 0) {
          resolve(result.data.data);
        } else {
          reject(
            new DiscordError(
              DiscordErrorName.FETCH_DISCORD_UNBIND_ERROR,
              result.data.msg
            )
          );
        }
      } catch (error) {
        throw error;
      }
    });
  }
  public bindOauthCallbackUrlListener() {
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
}
