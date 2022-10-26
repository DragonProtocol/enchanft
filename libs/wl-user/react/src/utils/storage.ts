/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-30 11:45:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 13:19:02
 * @Description: file description
 */
import { SignerType, LoginResult } from '@ecnft/wl-user-core';
import { isWeb3Signer, signerTypeToAccountTyp } from '.';

export enum StorageKey {
  LAST_LOGIN_SIGNER_TYPE = 'wl_user_last_login_signer_type',
  LAST_LOGIN_TOKEN = 'wl_user_last_login_token',
  LAST_LOGIN_NAME = 'wl_user_last_login_name',
  LAST_LOGIN_AVATAR = 'wl_user_last_login_avatar',
  LAST_LOGIN_PUBKEY = 'wl_user_last_login_pubkey',
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
  console.log({
    key: key,
    value: storageDefaultValues[key],
  });
  setStorageValue(key, storageDefaultValues[key]);
}

// TODO 兼容旧版C，B端用户系统的localstorge, 后期要删除
const oldVersionLastLoginSignerTypeMap = {
  twitter: SignerType.TWITTER,
  ethereum: SignerType.METAMASK,
  solana: SignerType.PHANTOM,
  aptos: SignerType.MARTIAN,
};
function oldVersionLastLoginSignerTypeAdapter() {
  // c端旧版LastLoginSignerType
  const c_oldVersionLoginSignerType = localStorage.getItem('lastLoginType');
  // b端旧版LastLoginSignerType
  const b_oldVersionLoginSignerType = localStorage.getItem('last_login_type');
  let newLastLoginSignerType = '';
  if (c_oldVersionLoginSignerType) {
    newLastLoginSignerType =
      oldVersionLastLoginSignerTypeMap[c_oldVersionLoginSignerType];
    localStorage.removeItem('lastLoginType');
  } else if (b_oldVersionLoginSignerType) {
    newLastLoginSignerType =
      oldVersionLastLoginSignerTypeMap[b_oldVersionLoginSignerType];
    localStorage.removeItem('last_login_type');
  }
  if (newLastLoginSignerType) {
    localStorage.setItem(
      StorageKey.LAST_LOGIN_SIGNER_TYPE,
      newLastLoginSignerType
    );
  }
}

export function getStorageValues<T extends StorageKey[]>(
  keys?: T
): StorageKeyValuePick<T> {
  // TODO 兼容旧版C，B端用户系统的localstorge, 后期要删除
  oldVersionLastLoginSignerTypeAdapter();

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
  signerType: SignerType,
  data: LoginResult
): void {
  setStorageValue(StorageKey.LAST_LOGIN_SIGNER_TYPE, signerType);
  setStorageValue(StorageKey.LAST_LOGIN_TOKEN, data.token);
  setStorageValue(StorageKey.LAST_LOGIN_NAME, data.name);
  setStorageValue(StorageKey.LAST_LOGIN_AVATAR, data.avatar);
  if (isWeb3Signer(signerType)) {
    const accountType = signerTypeToAccountTyp(signerType);
    const account = data.accounts.find(
      (item) => item.accountType === accountType
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
