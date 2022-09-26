/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-23 19:08:38
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { ConnectModal, selectAccount, setConnectModal } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AccountType } from '../types/entities'

export default () => {
  const { accounts } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)
  const dispatch = useAppDispatch()
  const toDiscordCallback = useRef<Function | null>(null)
  const toTwitterCallback = useRef<Function | null>(null)
  const handleActionToDiscord = useCallback(
    (callback) => {
      if (accountTypes.includes(AccountType.DISCORD)) {
        callback()
      } else {
        toTwitterCallback.current = callback
        dispatch(setConnectModal(ConnectModal.DISCORD))
      }
    },
    [accountTypes],
  )
  const handleActionToTwitter = useCallback(
    (callback) => {
      const authTwitter = accounts.some((account) => account.accountType === AccountType.TWITTER && !!account.data)

      if (authTwitter) {
        callback()
      } else {
        toDiscordCallback.current = callback
        dispatch(setConnectModal(ConnectModal.TWITTER))
      }
    },
    [accountTypes],
  )

  useEffect(() => {
    if (accountTypes.includes(AccountType.TWITTER) && toTwitterCallback.current) {
      toTwitterCallback.current()
      toTwitterCallback.current = null
    }
    if (accountTypes.includes(AccountType.DISCORD) && toDiscordCallback.current) {
      toDiscordCallback.current()
      toDiscordCallback.current = null
    }
    return () => {
      toTwitterCallback.current = null
      toDiscordCallback.current = null
    }
  }, [toDiscordCallback, toTwitterCallback, accountTypes])

  return { handleActionToDiscord, handleActionToTwitter }
}
