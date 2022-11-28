/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-02 17:11:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 18:53:04
 * @Description: file description
 */
import {
  AccountType,
  AuthorizerType,
  useWlUserReact,
  WlUserModalType,
} from '@ecnft/wl-user-react';
import { ChainType, getChainType } from '../utils/chain';

export enum AccountOperationType {
  CONNECT_WALLET = 'CONNECT_WALLET',
  BIND_PHANTOM = 'BIND_PHANTOM',
  BIND_METAMASK = 'BIND_METAMASK',
  BIND_MARTIAN = 'BIND_MARTIAN',
  BIND_UNKNOWN = 'BIND_UNKNOWN',
  COMPLETED = 'COMPLETED',
}
export const ccountOperationDescMap = {
  [AccountOperationType.CONNECT_WALLET]: 'Login',
  [AccountOperationType.BIND_METAMASK]: 'Bind MetaMask Wallet',
  [AccountOperationType.BIND_PHANTOM]: 'Bind Phantom Wallet',
  [AccountOperationType.BIND_MARTIAN]: 'Bind Martian Wallet',
  [AccountOperationType.BIND_UNKNOWN]: 'Unknown chain',
  [AccountOperationType.COMPLETED]: '',
};
export default (chainId?: number) => {
  const { isLogin, validateBindAccount, dispatchModal } = useWlUserReact();
  let accountOperationType = AccountOperationType.CONNECT_WALLET;
  const handleAccountOperationMap = {
    [AccountOperationType.CONNECT_WALLET]: () => {
      dispatchModal({ type: WlUserModalType.LOGIN });
    },
    [AccountOperationType.BIND_METAMASK]: () => {
      dispatchModal({
        type: WlUserModalType.BIND,
        payload: AuthorizerType.METAMASK_WALLET,
      });
    },
    [AccountOperationType.BIND_PHANTOM]: () => {
      dispatchModal({
        type: WlUserModalType.BIND,
        payload: AuthorizerType.PHANTOM_WALLET,
      });
    },
    [AccountOperationType.BIND_MARTIAN]: () => {
      dispatchModal({
        type: WlUserModalType.BIND,
        payload: AuthorizerType.MARTIAN_WALLET,
      });
    },
    [AccountOperationType.BIND_UNKNOWN]: () => {},
    [AccountOperationType.COMPLETED]: () => {},
  };

  if (isLogin) {
    const chainType = chainId ? getChainType(chainId) : ChainType.UNKNOWN;
    switch (chainType) {
      case ChainType.EVM:
        accountOperationType = validateBindAccount(AccountType.EVM)
          ? AccountOperationType.COMPLETED
          : AccountOperationType.BIND_METAMASK;
        break;
      case ChainType.SOLANA:
        accountOperationType = validateBindAccount(AccountType.SOLANA)
          ? AccountOperationType.COMPLETED
          : AccountOperationType.BIND_PHANTOM;
        break;
      case ChainType.APTOS:
        accountOperationType = validateBindAccount(AccountType.APTOS)
          ? AccountOperationType.COMPLETED
          : AccountOperationType.BIND_MARTIAN;
        break;
      default:
        accountOperationType = AccountOperationType.BIND_UNKNOWN;
        break;
    }
  }
  const accountOperationDesc = ccountOperationDescMap[accountOperationType];
  const handleAccountOperation =
    handleAccountOperationMap[accountOperationType];
  return { accountOperationType, accountOperationDesc, handleAccountOperation };
};
