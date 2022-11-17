/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:41:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 17:35:33
 * @Description: file description
 */
export * from './authorizer';
export { default as twitterAuthorizer } from './twitterAccount/authorizer';
export { default as discordAuthorizer } from './discordAccount/authorizer';
export { default as metamaskAuthorizer } from './evmAccount/metamask/authorizer';
export { default as rainbowKitAuthorizer } from './evmAccount/rainbowKit/authorizer';
export { default as phantomAuthorizer } from './solanaAccount/phantom/authorizer';
export { default as martianAuthorizer } from './aptosAccount/martian/authorizer';
