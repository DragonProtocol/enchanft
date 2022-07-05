/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 15:06:00
 * @Description: 个人信息
 */
import { useSynftContract } from '@ecnft/js-sdk-react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { clearMyNFT, getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from 'features/user/myEnchanftedSlice'
import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import styled from 'styled-components'

const Profile: React.FC = () => {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()
  const { synftContract } = useSynftContract()
  const dispatch = useAppDispatch()

  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)

  useEffect(() => {
    if (!wallet.publicKey) {
      walletRef.current = ''
      dispatch(clearMyNFT())
      return
    }
    if (walletRef.current === wallet.publicKey.toString()) return

    walletRef.current = wallet.publicKey.toString()
    const owner = wallet.publicKey
    dispatch(getMyNFTokens({ owner, connection, synftContract }))
  }, [wallet, connection, synftContract])
  console.log({
    myNFTData,
  })

  return <ProfileWrapper>profile</ProfileWrapper>
}
export default Profile
const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;
`
