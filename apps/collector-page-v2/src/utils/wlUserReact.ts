/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-17 19:13:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 14:49:05
 * @Description: file description
 */
import {
  twitterAuthorizer,
  discordAuthorizer,
  phantomAuthorizer,
  martianAuthorizer,
  rainbowKitAuthorizer,
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
  phantomAuthorizer(),
  martianAuthorizer(),
  emailAuthorizer(),
];

// TODO 这个两个工具方法暂时没有冲wl-user-react中导出，后期从wl-user-react中导出
export const getAccountDisplayName = (
  user: User,
  authorizer: Maybe<Authorizer>
) => {
  if (authorizer) {
    const account = user.accounts.find(
      (item) => item.accountType === authorizer.accountType
    );
    if (account) {
      if (
        authorizer.webVersion === AuthorizerWebVersion.web2 &&
        account.thirdpartyName
      ) {
        return account.thirdpartyName;
      }
      if (
        authorizer.webVersion === AuthorizerWebVersion.web3 &&
        account.thirdpartyId
      ) {
        return `${account.thirdpartyId.slice(
          0,
          4
        )}..${account.thirdpartyId.slice(-4)}`;
      }
    }
  }

  return '';
};
export const getUserDisplayName = (
  user: User,
  authorizer: Maybe<Authorizer>
) => {
  if (user.name) return user.name;
  return getAccountDisplayName(user, authorizer);
};
