/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-17 19:13:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-28 13:39:46
 * @Description: file description
 */
import {
  twitterAuthorizer,
  discordAuthorizer,
  phantomAuthorizer,
  martianAuthorizer,
  rainbowKitAuthorizer,
  metamaskAuthorizer,
  emailAuthorizer,
  Authorizer,
  AuthorizerWebVersion,
  User,
} from '@ecnft/wl-user-react';

const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID || '';
const TWITTER_CALLBACK_URL =
  process.env.REACT_APP_WL_USER_AUTH_CALLBACK_TWITTER || '';
const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID || '';
const DISCORD_CALLBACK_URL =
  process.env.REACT_APP_WL_USER_AUTH_CALLBACK_DISCORD || '';
export const authorizers = [
  twitterAuthorizer({
    twitterClientId: TWITTER_CLIENT_ID,
    oauthCallbackUri: TWITTER_CALLBACK_URL,
  }),
  discordAuthorizer({
    discordClientId: DISCORD_CLIENT_ID,
    oauthCallbackUri: DISCORD_CALLBACK_URL,
  }),
  rainbowKitAuthorizer(),
  metamaskAuthorizer(),
  phantomAuthorizer(),
  martianAuthorizer(),
  emailAuthorizer(),
];
