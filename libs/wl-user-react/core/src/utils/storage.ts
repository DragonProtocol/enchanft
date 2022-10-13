/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-30 11:45:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-11 17:55:51
 * @Description: file description
 */
import { SignerType } from '../signer';
import { LoginResult } from '../api';

export enum StorageKey {
  LAST_LOGIN_SIGNER_TYPE = 'last_login_signer_type',
  LAST_LOGIN_TOKEN = 'last_login_token',
  LAST_LOGIN_NAME = 'last_login_name',
  LAST_LOGIN_AVATAR = 'last_login_avatar',
  LAST_LOGIN_PUBKEY = 'last_login_pubkey',
}
type StorageKeyValue = {
  [StorageKey.LAST_LOGIN_SIGNER_TYPE]: SignerType;
  [StorageKey.LAST_LOGIN_TOKEN]: string;
  [StorageKey.LAST_LOGIN_NAME]: string;
  [StorageKey.LAST_LOGIN_AVATAR]: string;
  [StorageKey.LAST_LOGIN_PUBKEY]: string;
};
type StorageValueReturnType<T extends StorageKey> = ReturnType<
  () => StorageKeyValue[T]
>;
type StorageKeyValueUnionType<T extends StorageKey[]> = T[number];
type StorageKeyValuePick<T extends StorageKey[]> = Pick<
  StorageKeyValue,
  StorageKeyValueUnionType<T>
>;

const storageDefaultValues: StorageKeyValue = {
  [StorageKey.LAST_LOGIN_SIGNER_TYPE]: SignerType.TWITTER,
  [StorageKey.LAST_LOGIN_TOKEN]: '',
  [StorageKey.LAST_LOGIN_NAME]: '',
  [StorageKey.LAST_LOGIN_AVATAR]: '',
  [StorageKey.LAST_LOGIN_PUBKEY]: '',
};

export function getStorageValue<T extends StorageKey>(
  key: T
): StorageValueReturnType<T> {
  let value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : storageDefaultValues[key];
  } catch (e) {
    return (value as StorageValueReturnType<T>) || storageDefaultValues[key];
  }
}

export function setStorageValue<T extends StorageKey>(
  key: T,
  value: StorageValueReturnType<T>
): void {
  localStorage.setItem(
    key,
    typeof value === 'object' ? JSON.stringify(value) : value
  );
}

export function resetStorageValue(key: StorageKey): void {
  setStorageValue(key, storageDefaultValues[key]);
}

export function getStorageValues<T extends StorageKey[]>(
  keys?: T
): StorageKeyValuePick<T> {
  const keyAry = keys || [...Object.values(StorageKey)];
  const keyValues = storageDefaultValues;
  for (const key of keyAry) {
    const value = getStorageValue(key);
    Object.assign(keyValues, {
      [key]: value,
    });
  }
  return keyValues;
}

export function updateStorageByLogin(
  accountType: SignerType,
  data: LoginResult
): void {
  setStorageValue(StorageKey.LAST_LOGIN_SIGNER_TYPE, accountType);
  setStorageValue(StorageKey.LAST_LOGIN_TOKEN, data.token);
  setStorageValue(StorageKey.LAST_LOGIN_NAME, data.name);
  setStorageValue(StorageKey.LAST_LOGIN_AVATAR, data.avatar);
  setStorageValue(StorageKey.LAST_LOGIN_PUBKEY, data.pubkey);
}

export function updateStorageByLogout(): void {
  resetStorageValue(StorageKey.LAST_LOGIN_TOKEN);
  resetStorageValue(StorageKey.LAST_LOGIN_NAME);
  resetStorageValue(StorageKey.LAST_LOGIN_AVATAR);
  resetStorageValue(StorageKey.LAST_LOGIN_PUBKEY);
}

export function updateStorageByUserInfo(data: {
  name?: string;
  avatar?: string;
}) {
  const { name, avatar } = data;
  if (name !== undefined) {
    setStorageValue(StorageKey.LAST_LOGIN_NAME, name);
  }
  if (avatar !== undefined) {
    setStorageValue(StorageKey.LAST_LOGIN_AVATAR, avatar);
  }
}
