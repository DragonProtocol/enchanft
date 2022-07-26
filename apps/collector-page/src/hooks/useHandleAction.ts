/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 15:58:00
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { ConnectModal, selectAccount, setConnectModal } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default () => {
  const { accounts } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)
  const dispatch = useAppDispatch()
  const toDiscordCallback = useRef<Function | null>(null)
  const toTwitterCallback = useRef<Function | null>(null)
  const handleActionToDiscord = useCallback(
    (callback) => {
      if (accountTypes.includes('DISCORD')) {
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
      if (accountTypes.includes('TWITTER')) {
        callback()
      } else {
        toDiscordCallback.current = callback
        dispatch(setConnectModal(ConnectModal.TWITTER))
      }
    },
    [accountTypes],
  )

  useEffect(() => {
    if (accountTypes.includes('TWITTER') && toTwitterCallback.current) {
      toTwitterCallback.current()
      toTwitterCallback.current = null
    }
    if (accountTypes.includes('DISCORD') && toDiscordCallback.current) {
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
