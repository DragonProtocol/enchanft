/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-30 11:45:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-30 18:22:17
 * @Description: file description
 */
import { AccountType, LoginResult, RoleType } from '../types';

export enum StorageKey {
  LAST_LOGIN_TYPE = 'last_login_type',
  LAST_LOGIN_TOKEN = 'last_login_token',
  LAST_LOGIN_name = 'last_login_name',
  LAST_LOGIN_avatar = 'last_login_avatar',
  LAST_LOGIN_PUBKEY = 'last_login_pubkey',
  LAST_LOGIN_ROLES = 'last_login_roles',
}

type StorageKeyValue = {
  [StorageKey.LAST_LOGIN_TYPE]: AccountType;
  [StorageKey.LAST_LOGIN_TOKEN]: string;
  [StorageKey.LAST_LOGIN_name]: string;
  [StorageKey.LAST_LOGIN_avatar]: string;
  [StorageKey.LAST_LOGIN_PUBKEY]: string;
  [StorageKey.LAST_LOGIN_ROLES]: RoleType[];
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
  [StorageKey.LAST_LOGIN_TYPE]: AccountType.TWITTER,
  [StorageKey.LAST_LOGIN_TOKEN]: '',
  [StorageKey.LAST_LOGIN_name]: '',
  [StorageKey.LAST_LOGIN_avatar]: '',
  [StorageKey.LAST_LOGIN_PUBKEY]: '',
  [StorageKey.LAST_LOGIN_ROLES]: [],
};

export function getStorageValue<T extends StorageKey>(
  key: T
): StorageValueReturnType<T> {
  try {
    return (
      JSON.parse(localStorage.getItem(key) || '') || storageDefaultValues[key]
    );
  } catch (error) {
    return storageDefaultValues[key];
  }
}

export function setStorageValue<T extends StorageKey>(
  key: T,
  value: StorageValueReturnType<T>
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorageValues<T extends StorageKey[]>(
  keys?: T
): StorageKeyValuePick<T> {
  let keyAry;
  if (keys) {
    keyAry = keys;
  } else {
    keyAry = [...Object.values(StorageKey)];
  }
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
  accountType: AccountType,
  data: LoginResult
): void {
  setStorageValue(StorageKey.LAST_LOGIN_TYPE, accountType);
  setStorageValue(StorageKey.LAST_LOGIN_TOKEN, data.token);
  setStorageValue(StorageKey.LAST_LOGIN_name, data.name);
  setStorageValue(StorageKey.LAST_LOGIN_avatar, data.avatar);
  setStorageValue(StorageKey.LAST_LOGIN_PUBKEY, data.pubkey);
  setStorageValue(StorageKey.LAST_LOGIN_ROLES, data.roles);
}

export function updateStorageByLogout(): void {
  setStorageValue(StorageKey.LAST_LOGIN_TOKEN, '');
  setStorageValue(StorageKey.LAST_LOGIN_name, '');
  setStorageValue(StorageKey.LAST_LOGIN_avatar, '');
  setStorageValue(StorageKey.LAST_LOGIN_PUBKEY, '');
  setStorageValue(StorageKey.LAST_LOGIN_ROLES, []);
}

export function updateStorageByUserInfo(data: {
  name?: string;
  avatar?: string;
}) {
  const { name, avatar } = data;
  if (name !== undefined) {
    setStorageValue(StorageKey.LAST_LOGIN_name, name);
  }
  if (avatar !== undefined) {
    setStorageValue(StorageKey.LAST_LOGIN_avatar, avatar);
  }
}
