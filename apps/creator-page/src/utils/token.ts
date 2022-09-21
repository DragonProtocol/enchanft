const LOCAL_STORAGE_TOKEN = 'token';

export const DEFAULT_WALLET = 'defaultWallet';
export const LAST_LOGIN_TYPE = 'last_login_type';
export const LAST_LOGIN_NAME = 'last_login_name';
export const LAST_LOGIN_AVATAR = 'last_login_avatar';
export const LAST_LOGIN_ROLES = 'last_login_roles';
export const LAST_LOGIN_TOKEN = 'last_login_token';
export const LAST_LOGIN_PUBKEY = 'last_login_pubkey';

export const SIGN_MSG =
  'Sign this message to sign into ' + window.location.hostname;
export enum TokenType {
  Solana = 'solana',
  Ethereum = 'ethereum',
  Aptos = 'aptos',
}
export function setLoginToken(token: string, pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type);
  localStorage.setItem(key, token);
}

export function getLoginToken(pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type);
  return localStorage.getItem(key);
}

export function clearLoginToken(pubkey: string, type: TokenType) {
  const key = genTokenKey(pubkey, type);
  localStorage.removeItem(key);
  localStorage.removeItem(DEFAULT_WALLET);
  // record last login
  const lastLoginType = getLastLoginType();
  localStorage.setItem(lastLoginType, type);
}

function genTokenKey(pubkeyStr: string, type: TokenType) {
  return `${type}:${LOCAL_STORAGE_TOKEN}:${pubkeyStr}`;
}

function getLastLoginType() {
  return LAST_LOGIN_TYPE;
}
