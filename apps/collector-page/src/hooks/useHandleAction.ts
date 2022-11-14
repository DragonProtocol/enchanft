/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-14 15:21:08
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { useWlUserReact, WlUserModalType } from '@ecnft/wl-user-react'
import { SignerType, AccountType } from '@ecnft/wl-user-core'
import { questionConfirmAction, questionVerifyConfirmAction } from '../features/user/taskHandlesSlice'
import { useAppDispatch } from '../store/hooks'
import { Chain } from '../types/entities'
const ChainToSignerTypeMap = {
  [Chain.EVM]: SignerType.METAMASK,
  [Chain.SOLANA]: SignerType.PHANTOM,
  [Chain.APTOS]: SignerType.MARTIAN,
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
        dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.DISCORD })
      }
    },
    [validateBindAccount, dispatchModal],
  )
  const handleActionToTwitter = useCallback(
    (callback) => {
      if (validateBindAccount(AccountType.TWITTER)) {
        callback()
      } else {
        dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.TWITTER })
      }
    },
    [validateBindAccount, dispatchModal],
  )
  const handleActionQuestionConfirm = useCallback((action, answer) => {
    dispatch(questionConfirmAction({ action, answer }))
  }, [])
  const handleActionVolidBindWalletForChain = useCallback(
    (chain: Chain, callback) => {
      const accountType = ChainToAccountTypeMap[chain]

      if (validateBindAccount(accountType)) {
        callback()
      } else {
        const signerType = ChainToSignerTypeMap[chain]
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
  const handleActionQuestionVerifyConfirm = useCallback((action, answer, callback) => {
    dispatch(questionVerifyConfirmAction({ action, answer, callback }))
  }, [])
  return {
    handleActionToDiscord,
    handleActionToTwitter,
    handleActionQuestionConfirm,
    handleActionQuestionVerifyConfirm,
    handleActionVolidBindWalletForChain,
  }
}
