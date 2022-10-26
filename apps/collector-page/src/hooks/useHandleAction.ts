/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 18:58:52
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { useWlUserReact, WlUserModalType } from '@ecnft/wl-user-react'
import { SignerType, AccountType } from '@ecnft/wl-user-core'
import { questionConfirmAction } from '../features/user/taskHandlesSlice'
import { useAppDispatch } from '../store/hooks'
export default () => {
  const { validateBindAccount, dispatchModal } = useWlUserReact()
  const dispatch = useAppDispatch()
  const toDiscordCallback = useRef<Function | null>(null)
  const toTwitterCallback = useRef<Function | null>(null)
  const handleActionToDiscord = useCallback((callback) => {
    if (validateBindAccount(AccountType.DISCORD)) {
      callback()
    } else {
      toTwitterCallback.current = callback
      dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.DISCORD })
    }
  }, [])
  const handleActionToTwitter = useCallback((callback) => {
    if (validateBindAccount(AccountType.TWITTER)) {
      callback()
    } else {
      toDiscordCallback.current = callback
      dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.TWITTER })
    }
  }, [])
  const handleActionQuestionConfirm = useCallback((action, answer, callback) => {
    dispatch(questionConfirmAction({ action, answer, callback }))
  }, [])

  useEffect(() => {
    if (validateBindAccount(AccountType.TWITTER) && toTwitterCallback.current) {
      toTwitterCallback.current()
      toTwitterCallback.current = null
    }
    if (validateBindAccount(AccountType.DISCORD) && toDiscordCallback.current) {
      toDiscordCallback.current()
      toDiscordCallback.current = null
    }
    return () => {
      toTwitterCallback.current = null
      toDiscordCallback.current = null
    }
  }, [toDiscordCallback, toTwitterCallback])

  return { handleActionToDiscord, handleActionToTwitter, handleActionQuestionConfirm }
}
