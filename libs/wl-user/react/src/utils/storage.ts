/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-30 11:45:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 16:51:44
 * @Description: file description
 */
import { LoginResult } from '../api';
import {
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
} from '../authorizers';

export enum StorageKey {
  LAST_LOGIN_AUTHORIZER_TYPE = 'wl_user_last_login_authorizer_type',
  LAST_LOGIN_TOKEN = 'wl_user_last_login_token',
  LAST_LOGIN_NAME = 'wl_user_last_login_name',
  LAST_LOGIN_AVATAR = 'wl_user_last_login_avatar',
  LAST_LOGIN_PUBKEY = 'wl_user_last_login_pubkey',
}
type StorageKeyValue = {
  [StorageKey.LAST_LOGIN_AUTHORIZER_TYPE]: AuthorizerType;
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
  [StorageKey.LAST_LOGIN_AUTHORIZER_TYPE]: AuthorizerType.TWITTER,
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

// TODO 兼容旧版C，B端用户系统的localstorge, 后期要删除
const oldVersionLastLoginAuthorizerTypeMap = {
  twitter: AuthorizerType.TWITTER,
  ethereum: AuthorizerType.METAMASK_WALLET,
  solana: AuthorizerType.PHANTOM_WALLET,
  aptos: AuthorizerType.MARTIAN_WALLET,
};
function oldVersionLastLoginAuthorizerTypeAdapter() {
  // c端旧版LastLoginAuthorizerType
  const c_oldVersionLoginAuthorizerType = localStorage.getItem('lastLoginType');
  // b端旧版LastLoginAuthorizerType
  const b_oldVersionLoginAuthorizerType =
    localStorage.getItem('last_login_type');
  let newLastLoginAuthorizerType = '';
  if (c_oldVersionLoginAuthorizerType) {
    newLastLoginAuthorizerType =
      oldVersionLastLoginAuthorizerTypeMap[c_oldVersionLoginAuthorizerType];
    localStorage.removeItem('lastLoginType');
  } else if (b_oldVersionLoginAuthorizerType) {
    newLastLoginAuthorizerType =
      oldVersionLastLoginAuthorizerTypeMap[b_oldVersionLoginAuthorizerType];
    localStorage.removeItem('last_login_type');
  }
  if (newLastLoginAuthorizerType) {
    localStorage.setItem(
      StorageKey.LAST_LOGIN_AUTHORIZER_TYPE,
      newLastLoginAuthorizerType
    );
  }
}

export function getStorageValues<T extends StorageKey[]>(
  keys?: T
): StorageKeyValuePick<T> {
  // TODO 兼容旧版C，B端用户系统的localstorge, 后期要删除
  oldVersionLastLoginAuthorizerTypeAdapter();

  const keyAry = keys || [...Object.values(StorageKey)];
  const keyValues = { ...storageDefaultValues };
  for (const key of keyAry) {
    const value = getStorageValue(key);
    Object.assign(keyValues, {
      [key]: value,
    });
  }
  return keyValues;
}

export function updateStorageByLogin(
  authorizer: Authorizer,
  data: LoginResult
): void {
  setStorageValue(StorageKey.LAST_LOGIN_AUTHORIZER_TYPE, authorizer.type);
  setStorageValue(StorageKey.LAST_LOGIN_TOKEN, data.token);
  setStorageValue(StorageKey.LAST_LOGIN_NAME, data.name);
  setStorageValue(StorageKey.LAST_LOGIN_AVATAR, data.avatar);
  if (authorizer.webVersion === AuthorizerWebVersion.web3) {
    const account = data.accounts.find(
      (item) => item.accountType === authorizer.accountType
    );
    setStorageValue(StorageKey.LAST_LOGIN_PUBKEY, account?.thirdpartyId || '');
  }
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
