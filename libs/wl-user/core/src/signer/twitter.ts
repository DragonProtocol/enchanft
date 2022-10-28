/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 17:23:06
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  getTwittierOauth1RequestToken,
  login,
  LoginResult,
  AccountType,
} from '../api';
import { SignerType, Signer, SignerProcessStatus } from './types';
import { listenWindowClose, openOauthWindow } from '../utils';
export interface TwitterConstructorArgs {
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
interface TwitterEventMap extends WindowEventMap {
  [TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK]: CustomEvent<TwitterLoginCallbackParams>;
  [TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK]: CustomEvent<TwitterBindCallbackParams>;
}
interface TwitterOauthWindow extends Window {
  addEventListener<K extends keyof TwitterEventMap>(
    type: K,
    listener: (this: Window, ev: TwitterEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof TwitterEventMap>(
    type: K,
    listener: (this: Window, ev: TwitterEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}
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

export class Twitter extends Signer {
  readonly signerType = SignerType.TWITTER;
  readonly accountType = AccountType.TWITTER;
  private twitterClientId = '';
  private oauthCallbackUri = '';
  private loginOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      if (!isStartListenTwitterOauthStorage()) return;
      const urlParams = new URLSearchParams(location.search);
      const oauthToken = urlParams.get('oauth_token');
      const oauthVerifier = urlParams.get('oauth_verifier');
      if (oauthToken && oauthVerifier) {
        window.opener.dispatchEvent(
          new CustomEvent(TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK, {
            detail: { oauthToken, oauthVerifier },
          })
        );
        endListenTwitterOauthStorage();
        window.close();
      }
    }
  }
  private bindOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
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

  constructor({ twitterClientId, oauthCallbackUri }: TwitterConstructorArgs) {
    super();
    this.twitterClientId = twitterClientId;
    this.oauthCallbackUri = oauthCallbackUri;
    this.loginOauthCallbackUrlListener();
    this.bindOauthCallbackUrlListener();
  }

  public login(): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_PENDING);
      // 1. get twitter request token
      getTwittierOauth1RequestToken(this.oauthCallbackUri)
        .then((result) => {
          const { code, data, msg } = result.data;
          if (code === 0) {
            startListenTwitterOauthStorage();

            const url = getApiTwitterOauth1Url(data.oauthToken);
            const authWindow = openOauthWindow(url) as TwitterOauthWindow;

            const handleTwitterCallback = (
              e: TwitterEventMap[TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK]
            ) => {
              (window as TwitterOauthWindow).removeEventListener(
                TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
                handleTwitterCallback
              );
              clearListenTwitterOauthStorage();

              // 3. fetch twitter login
              const { oauthToken, oauthVerifier } = e.detail;
              this.signerProcessStatusChange(SignerProcessStatus.LOGIN_PENDING);
              login({
                type: this.accountType,
                twitterOauthToken: oauthToken,
                twitterOauthVerifier: oauthVerifier,
              })
                .then((result) => {
                  this.signerProcessStatusChange(
                    SignerProcessStatus.LOGIN_FULFILLED
                  );
                  resolve(result.data);
                })
                .catch((error) => {
                  this.signerProcessStatusChange(
                    SignerProcessStatus.LOGIN_REJECTED
                  );
                  reject(
                    new TwitterError(
                      ErrorName.API_REQUEST_LOGIN_ERROR,
                      error.message
                    )
                  );
                });
            };
            // 2. listen twitter login oauth callback
            (window as TwitterOauthWindow).addEventListener(
              TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
              handleTwitterCallback
            );

            listenWindowClose(authWindow, () => {
              if (isStartListenTwitterOauthStorage()) {
                (window as TwitterOauthWindow).removeEventListener(
                  TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
                  handleTwitterCallback
                );
                clearListenTwitterOauthStorage();
                this.signerProcessStatusChange(
                  SignerProcessStatus.SIGNATURE_REJECTED
                );
                reject(new TwitterError(ErrorName.OAUTH_WINDOW_CLOSE));
              }
            });
          } else {
            this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
            reject(
              new TwitterError(
                ErrorName.API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR,
                msg
              )
            );
          }
        })
        .catch((error) => {
          this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
          reject(
            new TwitterError(
              ErrorName.API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR,
              error.message
            )
          );
        });
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise((resolve, reject) => {
      // this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_PENDING);
      try {
        startListenTwitterOauthStorage();
        const url = getApiTwitterOauth2Url(
          this.twitterClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url);
        const handleTwitterCallback = (e: StorageEvent) => {
          const { key, newValue } = e;
          if (
            key === ListenTwitterOauthStorageKey.LISTEN_TWITTER_OAUTH_CODE &&
            newValue
          ) {
            window.removeEventListener('storage', handleTwitterCallback);
            clearListenTwitterOauthStorage();
            this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
            // 2. fetch twitter bind
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
                  new TwitterError(
                    ErrorName.API_REQUEST_BIND_ERROR,
                    error.message
                  )
                );
              });
          }
        };
        // 1. listen twitter bind oauth callback
        window.addEventListener('storage', handleTwitterCallback);
        // listenWindowClose(authWindow, () => {
        //   if (isStartListenTwitterOauthStorage()) {
        //     window.removeEventListener('storage', handleTwitterCallback);
        //     clearListenTwitterOauthStorage();
        //     this.signerProcessStatusChange(
        //       SignerProcessStatus.SIGNATURE_REJECTED
        //     );
        //     reject(new TwitterError(ErrorName.OAUTH_WINDOW_CLOSE));
        //   }
        // });
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(error);
      }
    });
  }
}
