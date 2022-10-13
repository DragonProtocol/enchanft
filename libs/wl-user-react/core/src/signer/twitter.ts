/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 11:39:24
 * @Description: file description
 */
import {
  bindAccount,
  BindResult,
  getTwittierOauth1RequestToken,
  login,
  LoginResult,
  unbindAccount,
  UnBindResult,
} from '../api';
import { openOauthWindow } from '../utils';
import { SignerType, Signer, SignerAccountTypeMap } from './index';
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
  FETCH_TWITTER_REQUEST_TOKEN_ERROR = 'FETCH_TWITTER_REQUEST_TOKEN_ERROR',
  FETCH_TWITTER_LOGIN_ERROR = 'FETCH_TWITTER_LOGIN_ERROR',
  FETCH_TWITTER_BIND_ERROR = 'FETCH_TWITTER_BIND_ERROR',
  FETCH_TWITTER_UNBIND_ERROR = 'FETCH_TWITTER_UNBIND_ERROR',
}
const TwitterErrorMessageMap: { [name in TwitterErrorName]: string } = {
  [TwitterErrorName.FETCH_TWITTER_REQUEST_TOKEN_ERROR]:
    'FETCH_TWITTER_REQUEST_TOKEN_ERROR',
  [TwitterErrorName.FETCH_TWITTER_LOGIN_ERROR]: 'FETCH_TWITTER_LOGIN_ERROR',
  [TwitterErrorName.FETCH_TWITTER_BIND_ERROR]: 'FETCH_TWITTER_BIND_ERROR',
  [TwitterErrorName.FETCH_TWITTER_UNBIND_ERROR]: 'FETCH_TWITTER_UNBIND_ERROR',
};
export class TwitterError extends Error {
  public constructor(name: TwitterErrorName, message?: string) {
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
  public get signerType() {
    return SignerType.TWITTER;
  }
  public twitterClientId = '';
  public oauthCallbackUri = '';

  constructor({ twitterClientId, oauthCallbackUri }: TwitterConstructorArgs) {
    super();
    this.twitterClientId = twitterClientId;
    this.oauthCallbackUri = oauthCallbackUri;
    this.loginOauthCallbackUrlListener();
    this.bindOauthCallbackUrlListener();
  }

  public login(): Promise<LoginResult> {
    return new Promise(async (resolve, reject) => {
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
            authWindow?.removeEventListener(
              TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
              handleTwitterCallback
            );
            authWindow?.close();
            // 3. fetch twitter login
            const { oauthToken, oauthVerifier } = e.detail;
            const loginResult = await login({
              type: SignerAccountTypeMap[this.signerType],
              twitterOauthToken: oauthToken,
              twitterOauthVerifier: oauthVerifier,
            });
            if (loginResult.data.code === 0) {
              resolve(loginResult.data.data);
            } else {
              reject(
                new TwitterError(
                  TwitterErrorName.FETCH_TWITTER_LOGIN_ERROR,
                  loginResult.data.msg
                )
              );
            }
          };
          // 2. listen twitter login oauth callback
          authWindow?.addEventListener(
            TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK,
            handleTwitterCallback
          );
        } else {
          reject(
            new TwitterError(
              TwitterErrorName.FETCH_TWITTER_REQUEST_TOKEN_ERROR,
              msg
            )
          );
        }
      } catch (error) {
        throw error;
      }
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = getApiTwitterOauth2Url(
          this.twitterClientId,
          this.oauthCallbackUri
        );
        const authWindow = openOauthWindow(url) as TwitterOauthWindow;
        const handleTwitterCallback = async (
          e: TwitterEventMap[TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK]
        ) => {
          authWindow?.removeEventListener(
            TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK,
            handleTwitterCallback
          );
          authWindow?.close();
          // 2. fetch twitter bind
          const { code } = e.detail;
          const result = await bindAccount(token, {
            type: SignerAccountTypeMap[this.signerType],
            code,
          });
          if (result.data.code === 0) {
            resolve(result.data.data);
          } else {
            reject(
              new TwitterError(
                TwitterErrorName.FETCH_TWITTER_BIND_ERROR,
                result.data.msg
              )
            );
          }
        };
        // 1. listen twitter bind oauth callback
        authWindow?.addEventListener(
          TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK,
          handleTwitterCallback
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
            new TwitterError(
              TwitterErrorName.FETCH_TWITTER_UNBIND_ERROR,
              result.data.msg
            )
          );
        }
      } catch (error) {
        throw error;
      }
    });
  }

  public loginOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      const urlParams = new URLSearchParams(location.search);
      const oauthToken = urlParams.get('oauth_token');
      const oauthVerifier = urlParams.get('oauth_verifier');
      if (oauthToken && oauthVerifier) {
        window.dispatchEvent(
          new CustomEvent(TwitterEventType.TWITTER_LOGIN_OAUTH_CALLBACK, {
            detail: { oauthToken, oauthVerifier },
          })
        );
      }
    }
  }
  public bindOauthCallbackUrlListener() {
    if (location.href.startsWith(this.oauthCallbackUri)) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        window.dispatchEvent(
          new CustomEvent(TwitterEventType.TWITTER_BIND_OAUTH_CALLBACK, {
            detail: { code },
          })
        );
      }
    }
  }
}
