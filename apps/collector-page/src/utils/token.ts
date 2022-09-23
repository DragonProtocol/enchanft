/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-01 16:24:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-22 14:07:13
 * @Description: file description
 */
const LOCAL_STORAGE_TOKEN = 'token'

export const DEFAULT_WALLET = 'defaultWallet'
export const LAST_LOGIN_TYPE = 'lastLoginType'
export const LAST_LOGIN_NAME = 'last_login_name'
export const LAST_LOGIN_AVATAR = 'last_login_avatar'
export const LAST_LOGIN_TOKEN = 'last_login_token'
export const LAST_LOGIN_PUBKEY = 'last_login_pubkey'

export const SIGN_MSG = 'Sign this message to sign into ' + window.location.hostname
export enum TokenType {
  Solana = 'solana',
  Ethereum = 'ethereum',
  Twitter = 'twitter',
}
export function setLoginToken(type: TokenType, token: string, pubkey?: string) {
  const key = genTokenKey(type, pubkey)
  localStorage.setItem(key, token)
}

export function getLoginToken(type: TokenType, pubkey?: string) {
  const key = genTokenKey(type, pubkey)
  return localStorage.getItem(key)
}

export function clearLoginToken(type: TokenType, pubkey?: string) {
  const key = genTokenKey(type, pubkey)
  localStorage.removeItem(key)
  localStorage.removeItem(DEFAULT_WALLET)
  // record last login
  const lastLoginType = getLastLoginType()
  localStorage.setItem(lastLoginType, type)
}

function genTokenKey(type: TokenType, pubkeyStr?: string) {
  return `${type}:${LOCAL_STORAGE_TOKEN}:${pubkeyStr || ''}`
}

function getLastLoginType() {
  return LAST_LOGIN_TYPE
}
