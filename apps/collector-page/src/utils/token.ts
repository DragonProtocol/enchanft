

const LOCAL_STORAGE_TOKEN = 'token'
type TOKEN_TYPE = 'solana' | 'ethereum'

export function setLoginToken(token: string, pubkey: string, type: TOKEN_TYPE = 'solana') {
  const key = genTokenKey(pubkey, type)
  localStorage.setItem(key, token)
}

export function getLoginToken(pubkey: string, type: TOKEN_TYPE = 'solana') {
  const key = genTokenKey(pubkey, type)
  return localStorage.getItem(key)
}

export function clearLoginToken(pubkey: string, type: TOKEN_TYPE = 'solana') {
  const key = genTokenKey(pubkey, type)
  localStorage.removeItem(key)
}

function genTokenKey(pubkeyStr: string, type: TOKEN_TYPE) {
  return `${type}:${LOCAL_STORAGE_TOKEN}:${pubkeyStr}`
}
