/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-27 11:33:03
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  LoginResult,
  AccountType,
  login
} from '../api';
import { SignerType, Signer, SignerProcessStatus } from './types';
import { listenWindowClose, openOauthWindow } from '../utils';
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
interface DiscordEventMap extends WindowEventMap {
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
  OAUTH_WINDOW_CLOSE = 'OAUTH_WINDOW_CLOSE',
}
type ErrorName = DiscordErrorName | ApiErrorName;
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

export class Discord extends Signer {
  readonly signerType = SignerType.DISCORD;
  readonly accountType = AccountType.DISCORD;
  private discordClientId = '';
  private oauthCallbackUri = '';
  private bindOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      if (!isStartListenDiscordOauthStorage()) return;
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        endListenDiscordOauthStorage();
        setDiscordOauthCodeStorage(code);
        window.close();
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
    return new Promise((resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_PENDING);
      try {
        startListenDiscordOauthStorage();
        const url = getApiDiscordOauth2Url(
          this.discordClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url);
        const handleDiscordCallback = (e: StorageEvent) => {
          const { key, newValue } = e;
          if (
            key === ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE &&
            newValue
          ) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
            // 2. fetch discord bind
            login({
              type: this.accountType,
              code: newValue,
              callback: this.oauthCallbackUri,
            })
              .then((result) => {
                this.signerProcessStatusChange(
                  SignerProcessStatus.BIND_FULFILLED
                );
                resolve(result.data);
              })
              .catch((error) => {
                this.signerProcessStatusChange(
                  SignerProcessStatus.BIND_REJECTED
                );
                reject(
                  new DiscordError(
                    ErrorName.API_REQUEST_BIND_ERROR,
                    error.message
                  )
                );
              });
          }
        };
        // 1. listen discord login oauth callback
        window.addEventListener('storage', handleDiscordCallback);
        listenWindowClose(authWindow, () => {
          if (isStartListenDiscordOauthStorage()) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            this.signerProcessStatusChange(
              SignerProcessStatus.SIGNATURE_REJECTED
            );
            reject(new DiscordError(ErrorName.OAUTH_WINDOW_CLOSE));
          }
        });
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(error);
      }
    });
  }

  public bind(token: string): Promise<BindResult> {
    return new Promise((resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_PENDING);
      try {
        startListenDiscordOauthStorage();
        const url = getApiDiscordOauth2Url(
          this.discordClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url);
        const handleDiscordCallback = (e: StorageEvent) => {
          const { key, newValue } = e;
          if (
            key === ListenDiscordOauthStorageKey.LISTEN_DISCORD_OAUTH_CODE &&
            newValue
          ) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
            // 2. fetch discord bind
            bindAccount(token, {
              type: this.accountType,
              code: newValue,
              callback: this.oauthCallbackUri,
            })
              .then((result) => {
                this.signerProcessStatusChange(
                  SignerProcessStatus.BIND_FULFILLED
                );
                resolve(result.data);
              })
              .catch((error) => {
                this.signerProcessStatusChange(
                  SignerProcessStatus.BIND_REJECTED
                );
                reject(
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
        listenWindowClose(authWindow, () => {
          if (isStartListenDiscordOauthStorage()) {
            window.removeEventListener('storage', handleDiscordCallback);
            clearListenDiscordOauthStorage();
            this.signerProcessStatusChange(
              SignerProcessStatus.SIGNATURE_REJECTED
            );
            reject(new DiscordError(ErrorName.OAUTH_WINDOW_CLOSE));
          }
        });
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(error);
      }
    });
  }
}
