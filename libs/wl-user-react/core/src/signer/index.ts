/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-11 10:33:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 13:35:48
 * @Description: file description
 */
export { Twitter } from './twitter';
export { Discord } from './discord';
export { Metamask } from './metamask';
export { Phantom } from './phantom';
export { Martian } from './martian';
import { AccountType, User } from '../types';
import { LoginResult, BindResult, UnBindResult } from '../api';

export enum SignerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK = 'METAMASK',
  PHANTOM = 'PHANTOM',
  MARTIAN = 'MARTIAN',
}
export abstract class Signer {
  constructor() {}

  public abstract get signerType(): SignerType;

  public abstract login(): Promise<LoginResult>;

  public abstract bind(token: string): Promise<BindResult>;

  public abstract unbind(token: string): Promise<UnBindResult>;
}

// type SignerTypeInstanceTypes = {
//   [SignerType.TWITTER]: Twitter;
//   [SignerType.DISCORD]: Discord;
//   [SignerType.METAMASK]: Metamask;
//   [SignerType.PHANTOM]: Phantom;
//   [SignerType.MARTIAN]: Martian;
// };

// type SignerTypeReturnInstanceType<T extends SignerType> = ReturnType<
//   () => SignerTypeInstanceTypes[T]
// >;

// const signerInstances: SignerTypeInstanceTypes = {
//   [SignerType.TWITTER]: new Twitter(),
//   [SignerType.DISCORD]: new Discord(),
//   [SignerType.METAMASK]: new Metamask(),
//   [SignerType.PHANTOM]: new Phantom(),
//   [SignerType.APTOS]: new Aptos(),
// };

// export function getSigner<T extends SignerType>(
//   signerType: T
// ): SignerTypeReturnInstanceType<T> | null {
//   return signerInstances[signerType] || null;
// }

export const SignerAccountTypeMap: {
  [signerType in SignerType]: AccountType;
} = {
  [SignerType.TWITTER]: AccountType.TWITTER,
  [SignerType.DISCORD]: AccountType.DISCORD,
  [SignerType.METAMASK]: AccountType.EVM,
  [SignerType.PHANTOM]: AccountType.SOLANA,
  [SignerType.MARTIAN]: AccountType.APTOS,
};
export function isWeb2Signer(signerType: SignerType) {
  return [SignerType.TWITTER, SignerType.DISCORD].includes(signerType);
}
export function isWeb3Signer(signerType: SignerType) {
  return [SignerType.METAMASK, SignerType.PHANTOM, SignerType.MARTIAN].includes(
    signerType
  );
}
export const getDisplayUserName = (signerType: SignerType, user: User) => {
  if (user.name) return user.name;
  const account = user.accounts.find(
    (item) => item.accountType === SignerAccountTypeMap[signerType]
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
  return `wl user ${user.id}`;
};
