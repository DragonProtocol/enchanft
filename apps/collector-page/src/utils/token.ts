const LOCAL_STORAGE_TOKEN = 'token'

export const DEFAULT_WALLET = 'defaultWallet'
export const LAST_LOGIN_TYPE = 'lastLoginType'

export const SIGN_MSG = 'Sign this message to sign into ' + window.location.hostname
export enum TokenType {
  Solana = 'solana',
  Ethereum = 'ethereum',
}
export function setLoginToken(token: string, pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type)
  localStorage.setItem(key, token)
}

export function getLoginToken(pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type)
  return localStorage.getItem(key)
}

export function clearLoginToken(pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type)
  localStorage.removeItem(key)
  localStorage.removeItem(DEFAULT_WALLET)
  // record last login
  const lastLoginType = getLastLoginType()
  localStorage.setItem(lastLoginType, type)
}

function genTokenKey(pubkeyStr: string, type: TokenType) {
  return `${type}:${LOCAL_STORAGE_TOKEN}:${pubkeyStr}`
}

function getLastLoginType() {
  return LAST_LOGIN_TYPE
}
