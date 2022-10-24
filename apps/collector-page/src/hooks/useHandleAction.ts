/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:09:19
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { useWlUserReact, WlUserModalType } from '@ecnft/wl-user-react'
import { SignerType, AccountType } from '@ecnft/wl-user-core'
export default () => {
  const { validateBindAccount, dispatchModal } = useWlUserReact()
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

  return { handleActionToDiscord, handleActionToTwitter }
}
