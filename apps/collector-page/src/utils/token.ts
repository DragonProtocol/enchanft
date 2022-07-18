const LOCAL_STORAGE_TOKEN = 'token'
export function setLoginToken(token: string) {
  localStorage.setItem(LOCAL_STORAGE_TOKEN, token)
}

export function getLoginToken() {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN)
}

export function clearLoginToken() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN)
}
