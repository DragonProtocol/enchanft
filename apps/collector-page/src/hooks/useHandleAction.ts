/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 16:51:37
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { useWlUserReact, AccountType, WlUserModalType } from '../../../../libs/wl-user-react/core/src'
import { SignerType } from '../../../../libs/wl-user-react/core/src/signer'
export default () => {
  const { volidBindAccount, dispatchModal } = useWlUserReact()
  const toDiscordCallback = useRef<Function | null>(null)
  const toTwitterCallback = useRef<Function | null>(null)
  const handleActionToDiscord = useCallback((callback) => {
    if (volidBindAccount(AccountType.DISCORD)) {
      callback()
    } else {
      toTwitterCallback.current = callback
      dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.DISCORD })
    }
  }, [])
  const handleActionToTwitter = useCallback((callback) => {
    if (volidBindAccount(AccountType.TWITTER)) {
      callback()
    } else {
      toDiscordCallback.current = callback
      dispatchModal({ type: WlUserModalType.BIND, payload: SignerType.TWITTER })
    }
  }, [])

  useEffect(() => {
    if (volidBindAccount(AccountType.TWITTER) && toTwitterCallback.current) {
      toTwitterCallback.current()
      toTwitterCallback.current = null
    }
    if (volidBindAccount(AccountType.DISCORD) && toDiscordCallback.current) {
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
