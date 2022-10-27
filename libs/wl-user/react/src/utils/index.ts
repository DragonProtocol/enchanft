/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 18:19:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 16:14:16
 * @Description: file description
 */
import {
  SignerProcessStatus,
  SignerType,
  AccountType,
  User,
} from '@ecnft/wl-user-core';
export const openOauthWindow = (url: string): WindowProxy | null => {
  return window.open(
    url,
    '__blank',
    `width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no`
  );
};
export const SignerAccountTypeMap: {
  [signerType in SignerType]: AccountType;
} = {
  [SignerType.TWITTER]: AccountType.TWITTER,
  [SignerType.DISCORD]: AccountType.DISCORD,
  [SignerType.METAMASK]: AccountType.EVM,
  [SignerType.PHANTOM]: AccountType.SOLANA,
  [SignerType.MARTIAN]: AccountType.APTOS,
};
export function signerTypeToAccountTyp(signerType: SignerType): AccountType {
  try {
    return SignerAccountTypeMap[signerType];
  } catch (error) {
    throw new Error('signer type unknown');
  }
}
export function accountTypeToSignerType(
  accountType: AccountType
): SignerType | undefined {
  for (const signerType in SignerAccountTypeMap) {
    const type = SignerAccountTypeMap[signerType as SignerType];
    if (type === accountType) {
      return signerType as SignerType;
    }
  }
  throw new Error('account type unknown');
}
export function isWeb2Signer(signerType: SignerType) {
  return [SignerType.TWITTER, SignerType.DISCORD].includes(signerType);
}
export function isWeb3Signer(signerType: SignerType) {
  return [SignerType.METAMASK, SignerType.PHANTOM, SignerType.MARTIAN].includes(
    signerType
  );
}
export const getAccountDisplayName = (user: User, signerType: SignerType) => {
  const accountType = signerTypeToAccountTyp(signerType);
  const account = user.accounts.find(
    (item) => item.accountType === accountType
  );
  if (account) {
    if (isWeb2Signer(signerType) && account.thirdpartyName) {
      return account.thirdpartyName;
    } else if (isWeb3Signer(signerType) && account.thirdpartyId) {
      return (
        account.thirdpartyId.slice(0, 4) + '..' + account.thirdpartyId.slice(-4)
      );
    }
  }
  return '';
};
export const getUserDisplayName = (user: User, signerType: SignerType) => {
  if (user.name) return user.name;
  return getAccountDisplayName(user, signerType);
};
export const validateSignerPending = (
  signerType: SignerType,
  processStatus: SignerProcessStatus
) => {
  const pendingProcessStatus = [
    SignerProcessStatus.LOGIN_PENDING,
    SignerProcessStatus.BIND_PENDING,
    SignerProcessStatus.UNBIND_PENDING,
  ];
  if (isWeb3Signer(signerType)) {
    pendingProcessStatus.push(SignerProcessStatus.SIGNATURE_PENDING);
  }
  return pendingProcessStatus.includes(processStatus);
};