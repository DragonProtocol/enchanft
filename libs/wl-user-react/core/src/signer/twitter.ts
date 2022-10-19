/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 15:53:54
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
} from '../api';
import { AccountType } from '../types';
import { openOauthWindow } from '../utils';
import { SignerType, Signer, SignerProcessStatus } from './types';
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
interface TwitterEventMap {
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
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
type ErrorName = TwitterErrorName | ApiErrorName;
const ErrorName = { ...TwitterErrorName, ...ApiErrorName };
const TwitterErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.UNKNOWN_ERROR]: 'UNKNOWN_ERROR',
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

export class Twitter extends Signer {
  readonly signerType = SignerType.TWITTER;
  readonly accountType = AccountType.TWITTER;
  private twitterClientId = '';
  private oauthCallbackUri = '';
  private loginOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      const urlParams = new URLSearchParams(location.search);
      const oauthToken = urlParams.get('oauth_token');
      const oauthVerifier = urlParams.get('oauth_verifier');
      if (oauthToken && oauthVerifier) {
        window.opener.dispatchEvent(
          new CustomEvent(TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK, {
            detail: { oauthToken, oauthVerifier },
          })
        );
      }
    }
  }
  private bindOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        window.opener.dispatchEvent(
          new CustomEvent(TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK, {
            detail: { code },
          })
        );
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
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.LOGIN_PENDING);
      try {
        // 1. get twitter request token
        const result = await getTwittierOauth1RequestToken(
          this.oauthCallbackUri
        );
        const { code, data, msg } = result.data;
        if (code === 0) {
          const url = getApiTwitterOauth1Url(data.oauthToken);
          const authWindow = openOauthWindow(url) as TwitterOauthWindow;
          const handleTwitterCallback = async (
            e: TwitterEventMap[TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK]
          ) => {
            (window as TwitterOauthWindow).removeEventListener(
              TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
              handleTwitterCallback
            );
            authWindow.close();
            // 3. fetch twitter login
            const { oauthToken, oauthVerifier } = e.detail;
            const loginResult = await login({
              type: this.accountType,
              twitterOauthToken: oauthToken,
              twitterOauthVerifier: oauthVerifier,
            });
            if (loginResult.data) {
              this.signerProcessStatusChange(
                SignerProcessStatus.LOGIN_FULFILLED
              );
              resolve(loginResult.data);
            } else {
              this.signerProcessStatusChange(
                SignerProcessStatus.LOGIN_REJECTED
              );
              reject(new TwitterError(ErrorName.API_REQUEST_LOGIN_ERROR));
            }
          };
          // 2. listen twitter login oauth callback
          (window as TwitterOauthWindow).addEventListener(
            TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
            handleTwitterCallback
          );
        } else {
          this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
          reject(
            new TwitterError(
              ErrorName.API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR,
              msg
            )
          );
        }
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
        throw error;
      }
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
      try {
        const url = getApiTwitterOauth2Url(
          this.twitterClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url) as TwitterOauthWindow;
        const handleTwitterCallback = async (
          e: TwitterEventMap[TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK]
        ) => {
          (window as TwitterOauthWindow).removeEventListener(
            TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK,
            handleTwitterCallback
          );
          authWindow.close();
          // 2. fetch twitter bind
          const { code } = e.detail;
          const result = await bindAccount(token, {
            type: this.accountType,
            code,
          });
          if (result.data) {
            this.signerProcessStatusChange(SignerProcessStatus.BIND_FULFILLED);
            resolve(result.data);
          } else {
            this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
            reject(new TwitterError(ErrorName.API_REQUEST_BIND_ERROR));
          }
        };
        // 1. listen twitter bind oauth callback
        (window as TwitterOauthWindow).addEventListener(
          TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK,
          handleTwitterCallback
        );
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        throw error;
      }
    });
  }
}
