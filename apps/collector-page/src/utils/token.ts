const LOCAL_STORAGE_TOKEN = 'token'

export const SIGN_MSG = 'Sign this message to sign into enchanft.xyz'
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
}

function genTokenKey(pubkeyStr: string, type: TokenType) {
  return `${type}:${LOCAL_STORAGE_TOKEN}:${pubkeyStr}`
}
