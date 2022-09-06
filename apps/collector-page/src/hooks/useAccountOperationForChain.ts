/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-02 17:11:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 11:17:08
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react'
import { ConnectModal, selectAccount, setConnectModal, setConnectWalletModalShow } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { ChainType, getChainType } from '../utils/chain'
import useLogin from './useLogin'

export enum AccountOperationType {
  CONNECT_WALLET = 'CONNECT_WALLET',
  BIND_PHANTOM = 'BIND_PHANTOM',
  BIND_METAMASK = 'BIND_METAMASK',
  BIND_UNKNOWN = 'BIND_UNKNOWN',
  COMPLETED = 'COMPLETED',
}
export const ccountOperationDescMap = {
  [AccountOperationType.CONNECT_WALLET]: 'Connect Wallet',
  [AccountOperationType.BIND_METAMASK]: 'Bind MetaMask Wallet',
  [AccountOperationType.BIND_PHANTOM]: 'Bind Phantom Wallet',
  [AccountOperationType.BIND_UNKNOWN]: 'Unknown chain',
  [AccountOperationType.COMPLETED]: '',
}
export default (chainId?: number) => {
  const dispatch = useAppDispatch()
  const { accounts } = useAppSelector(selectAccount)
  const { isLogin } = useLogin()
  let accountOperationType = AccountOperationType.CONNECT_WALLET
  const handleAccountOperationMap = {
    [AccountOperationType.CONNECT_WALLET]: () => {
      dispatch(setConnectWalletModalShow(true))
    },
    [AccountOperationType.BIND_METAMASK]: () => {
      dispatch(setConnectModal(ConnectModal.METAMASK))
    },
    [AccountOperationType.BIND_PHANTOM]: () => {
      dispatch(setConnectModal(ConnectModal.PHANTOM))
    },
    [AccountOperationType.BIND_UNKNOWN]: () => {},
    [AccountOperationType.COMPLETED]: () => {},
  }

  if (isLogin) {
    const chainType = chainId ? getChainType(chainId) : ChainType.UNKNOWN
    const accountTypes = accounts.map((account) => account.accountType)
    switch (chainType) {
      case ChainType.EVM:
        accountOperationType = accountTypes.includes('EVM')
          ? AccountOperationType.COMPLETED
          : AccountOperationType.BIND_METAMASK
        break
      case ChainType.SOLANA:
        accountOperationType = accountTypes.includes('SOLANA')
          ? AccountOperationType.COMPLETED
          : AccountOperationType.BIND_PHANTOM
        break
      default:
        accountOperationType = AccountOperationType.BIND_UNKNOWN
        break
    }
  }
  const accountOperationDesc = ccountOperationDescMap[accountOperationType]
  const handleAccountOperation = handleAccountOperationMap[accountOperationType]
  return { accountOperationType, accountOperationDesc, handleAccountOperation }
}
