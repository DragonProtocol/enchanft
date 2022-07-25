/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 18:51:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 19:17:14
 * @Description: file description
 */
import { useCallback, useEffect, useRef } from 'react'
import { ConnectModal, selectAccount, setConnectModal } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default () => {
  const { twitter, discord } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  const toDiscordCallback = useRef<Function | null>(null)
  const toTwitterCallback = useRef<Function | null>(null)
  const handleActionToDiscord = useCallback(
    (callback) => {
      if (discord) {
        callback()
      } else {
        toTwitterCallback.current = callback
        dispatch(setConnectModal(ConnectModal.DISCORD))
      }
    },
    [discord],
  )
  const handleActionToTwitter = useCallback(
    (callback) => {
      if (twitter) {
        callback()
      } else {
        toDiscordCallback.current = callback
        dispatch(setConnectModal(ConnectModal.TWITTER))
      }
    },
    [twitter],
  )

  useEffect(() => {
    if (twitter && toTwitterCallback.current) {
      toTwitterCallback.current()
      toTwitterCallback.current = null
    }
    if (discord && toDiscordCallback.current) {
      toDiscordCallback.current()
      toDiscordCallback.current = null
    }
    return () => {
      toTwitterCallback.current = null
      toDiscordCallback.current = null
    }
  }, [toDiscordCallback, toTwitterCallback, twitter, discord])

  return { handleActionToDiscord, handleActionToTwitter }
}
