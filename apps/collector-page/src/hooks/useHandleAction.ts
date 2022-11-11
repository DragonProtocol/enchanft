/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 18:53:42
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { AccountType, AuthorizerType, useWlUserReact, WlUserModalType } from '@ecnft/wl-user-react'
import { questionConfirmAction } from '../features/user/taskHandlesSlice'
import { useAppDispatch } from '../store/hooks'
import { Chain } from '../types/entities'
const ChainToAuthorizerTypeMap = {
  [Chain.EVM]: AuthorizerType.METAMASK_WALLET,
  [Chain.SOLANA]: AuthorizerType.PHANTOM_WALLET,
  [Chain.APTOS]: AuthorizerType.MARTIAN_WALLET,
}
const ChainToAccountTypeMap = {
  [Chain.EVM]: AccountType.EVM,
  [Chain.SOLANA]: AccountType.SOLANA,
  [Chain.APTOS]: AccountType.APTOS,
}
export default () => {
  const { validateBindAccount, dispatchModal } = useWlUserReact()
  const dispatch = useAppDispatch()
  const handleActionToDiscord = useCallback(
    (callback) => {
      if (validateBindAccount(AccountType.DISCORD)) {
        callback()
      } else {
        dispatchModal({ type: WlUserModalType.BIND, payload: AuthorizerType.DISCORD })
      }
    },
    [validateBindAccount, dispatchModal],
  )
  const handleActionToTwitter = useCallback(
    (callback) => {
      if (validateBindAccount(AccountType.TWITTER)) {
        callback()
      } else {
        dispatchModal({ type: WlUserModalType.BIND, payload: AuthorizerType.TWITTER })
      }
    },
    [validateBindAccount, dispatchModal],
  )
  const handleActionQuestionConfirm = useCallback((action, answer, callback) => {
    dispatch(questionConfirmAction({ action, answer, callback }))
  }, [])
  const handleActionVolidBindWalletForChain = useCallback(
    (chain: Chain, callback) => {
      const accountType = ChainToAccountTypeMap[chain]

      if (validateBindAccount(accountType)) {
        callback()
      } else {
        const signerType = ChainToAuthorizerTypeMap[chain]
        console.log({
          chain,
          accountType,
          signerType,
        })
        dispatchModal({ type: WlUserModalType.BIND, payload: signerType })
      }
    },
    [validateBindAccount, dispatchModal],
  )

  return {
    handleActionToDiscord,
    handleActionToTwitter,
    handleActionQuestionConfirm,
    handleActionVolidBindWalletForChain,
  }
}
