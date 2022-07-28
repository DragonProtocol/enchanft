/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 18:49:29
 * @Description: 个人信息
 */
import { useSynftContract } from '@ecnft/js-sdk-react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  clearMyNFT,
  fetchMyEnchanfted,
  selectAll as selectAllForMyEnchanfted,
  selectMyEnchanftedState,
} from '../features/user/myEnchanftedSlice'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import useInterval from '../hooks/useInterval'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import styled from 'styled-components'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Tabs,
  Tab,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import {
  selectAccount,
  userUpdateProfile,
  setTwitter,
  setDiscord,
  userLink,
  setConnectModal,
  ConnectModal,
  ChainType,
  userOtherWalletLink,
} from '../features/user/accountSlice'
import MainContentBox from '../components/layout/MainContentBox'
import CommunityList, { CommunityListItemsType } from '../components/business/community/CommunityList'
import {
  FollowedCommunitityForEntity,
  selectAll as selectAllForFollowedCommunity,
  selectUserFollowedCommunitiesState,
} from '../features/user/followedCommunitiesSlice'
import { AsyncRequestStatus } from '../types'
import EnchanftedList, { EnchanftedListItemsType } from '../components/business/nft/EnchanftedList'
import { EnchanftedForEntity } from '../features/user/myEnchanftedSlice'
import { uploadAvatar } from '../services/api/login'
import { connectionSocialMedia } from '../utils/socialMedia'
import PhatomIcon from '../components/ConnectBtn/PhantomIcon'
import MetamaskIcon from '../components/ConnectBtn/MetamaskIcon'
import { sortPubKey } from '../utils/solana'
import useWalletSign from '../hooks/useWalletSign'
import { SIGN_MSG } from '../utils/token'
import {
  selectUserWhitelistsState,
  UserWhitelistForEntity,
  selectAll as selectAllForUserWhitelists,
} from '../features/user/userWhitelistsSlice'
import WhitelistList, { WhitelistListItemsType } from '../components/business/whitelist/WhitelistList'
import AvatarDefaultImg from '../components/imgs/avatar.png'
import ButtonBase from '../components/common/button/ButtonBase'
import IconTwitterWhite from '../components/common/icons/IconTwitterWhite'
import IconDiscordWhite from '../components/common/icons/IconDiscordWhite'
import IconEmailWhite from '../components/common/icons/IconTwitterWhite copy'
import ScrollBox from '../components/common/ScrollBox'
const formatStoreDataToComponentDataByFollowedCommunities = (
  communities: FollowedCommunitityForEntity[],
): CommunityListItemsType => {
  return communities.map((item) => {
    return {
      data: { ...item, isFollowed: true },
      viewConfig: {
        displayFollow: true,
      },
    }
  })
}
const formatStoreDataToComponentDataByUserWhitelists = (
  whitelists: UserWhitelistForEntity[],
): WhitelistListItemsType => {
  return whitelists.map((item) => {
    return {
      data: { ...item },
      viewConfig: {
        displayMint: true,
      },
    }
  })
}
// const formatStoreDataToComponentDataByMyEnchanfted = (nfts: EnchanftedForEntity[]): EnchanftedListItemsType => {
//   return nfts.map((nft) => {
//     return {
//       data: { ...nft },
//     }
//   })
// }
const ProfileTabOptions = [
  {
    label: 'My Communities',
    value: 'myCommunities',
  },
  {
    label: 'My Whitelist',
    value: 'myWhitelist',
  },
  // {
  //   label: 'My Enchanfted',
  //   value: 'myEnchanfted',
  // },
]
const Profile: React.FC = () => {
  const dispatch = useAppDispatch()

  const account = useAppSelector(selectAccount)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')

  const [openDialog, setOpenDialog] = useState(false)

  const updateProfile = useCallback(() => {
    if (!account.token) return
    dispatch(
      userUpdateProfile({
        avatar: avatar,
        name: name,
        pubkey: account.pubkey,
      }),
    )
    setOpenDialog(false)
  }, [account.token, account.pubkey, name, avatar])

  // profile展示信息切换
  const [curProfileTab, setCurProfileTab] = useState(ProfileTabOptions[0].value)

  // 我的社区列表
  const followedCommunities = useAppSelector(selectAllForFollowedCommunity)
  const { status: followedCommunitiesStatus } = useAppSelector(selectUserFollowedCommunitiesState)
  const loadingFollowedCommunities = followedCommunitiesStatus === AsyncRequestStatus.PENDING
  const followedCommunityItems = formatStoreDataToComponentDataByFollowedCommunities(followedCommunities)
  // 我的whitelist列表
  const whitelists = useAppSelector(selectAllForUserWhitelists)
  const { status: whitelistsStatus } = useAppSelector(selectUserWhitelistsState)
  const loadingUserWhitelists = whitelistsStatus === AsyncRequestStatus.PENDING
  const whitelistItems = formatStoreDataToComponentDataByUserWhitelists(whitelists)
  // 我的NFT列表
  // const myEnchanftedList = useAppSelector(selectAllForMyEnchanfted)
  // const { status: myEnchanftedStatus } = useAppSelector(selectMyEnchanftedState)
  // const loadingEnchanftedList = myEnchanftedStatus === AsyncRequestStatus.PENDING
  // const myEnchanftedItems = formatStoreDataToComponentDataByMyEnchanfted(myEnchanftedList)

  const twitter = account.accounts.find((item) => item.accountType === 'TWITTER')?.thirdpartyName
  const discord = account.accounts.find((item) => item.accountType === 'DISCORD')?.thirdpartyName
  const accountPhantom = account.accounts.find((item) => item.accountType === ChainType.SOLANA)
  const accountMetamask = account.accounts.find((item) => item.accountType === ChainType.EVM)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()
  const bindMetamask = useCallback(async () => {
    if (!metamaskValid) alert('Install Metamask first')
    const data = await signMsgWithMetamask()
    console.log(data)
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
  }, [metamaskValid])

  const bindPhantom = useCallback(async () => {
    if (!phantomValid) alert('Install Phantom first')
    const data = await signMsgWithPhantom()
    console.log(data)
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
  }, [phantomValid])

  return (
    <ProfileWrapper>
      <ScrollBox>
        <ProfileTopBox>
          <UserImg src={account.avatar || AvatarDefaultImg} />
          <ProfileRightBox>
            <UserName>
              <span>{account.name}</span>
              <IconButton onClick={() => setOpenDialog(true)}>
                <EditIcon />
              </IconButton>
            </UserName>
            <UserAddress>{account.pubkey}</UserAddress>
            <UserAccountListBox>
              <MetamaskBindBtn
                onClick={() => {
                  if (accountMetamask) return
                  bindMetamask()
                }}
              >
                <MetamaskIcon />
                {accountMetamask ? sortPubKey(accountMetamask.thirdpartyId) : 'Connect Metamask'}
              </MetamaskBindBtn>
              <PhantomBindBtn
                onClick={() => {
                  if (accountPhantom) return
                  bindPhantom()
                }}
              >
                <PhatomIcon />
                {accountPhantom ? sortPubKey(accountPhantom.thirdpartyId) : 'Connect Phantom'}
              </PhantomBindBtn>
              <TwitterBindBtn onClick={() => connectionSocialMedia('twitter')}>
                <IconTwitterWhite />
                {twitter || 'Connect Twitter'}
              </TwitterBindBtn>
              <DiscordBindBtn onClick={() => connectionSocialMedia('discord')}>
                <IconDiscordWhite />
                {discord || 'Connect Discord'}
              </DiscordBindBtn>
              {/* <EmailBindBtn>
                  <IconEmailWhite />
                  {'Connect Email'}
                </EmailBindBtn> */}
            </UserAccountListBox>
          </ProfileRightBox>
        </ProfileTopBox>
        <ProfileTabsBox>
          <ProfileTabs>
            {ProfileTabOptions.map((item) => (
              <ProfileTab
                key={item.value}
                onClick={() => setCurProfileTab(item.value)}
                isActive={item.value === curProfileTab}
              >
                {item.label}
              </ProfileTab>
            ))}
          </ProfileTabs>
          <ProfileTabContentBox>
            {curProfileTab === 'myCommunities' && (
              <CommunityList items={followedCommunityItems} loading={loadingFollowedCommunities} />
            )}
            {curProfileTab === 'myWhitelist' && (
              <WhitelistList items={whitelistItems} loading={loadingUserWhitelists} />
            )}
            {/* {curProfileTab === 'myEnchanfted' && (
                <EnchanftedList items={myEnchanftedItems} loading={loadingEnchanftedList} />
              )} */}
          </ProfileTabContentBox>
        </ProfileTabsBox>
      </ScrollBox>
      <Dialog open={openDialog} fullWidth={true} maxWidth={'lg'}>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
            }}
          >
            <h4>Profile picture</h4>
            <img
              src={avatar}
              alt=""
              style={{
                width: '100px',
                height: '100px',
                cursor: 'pointer',
              }}
              onClick={() => {
                document.getElementById('uploadinput')?.click()
              }}
            />
            <input
              title="uploadinput"
              id="uploadinput"
              style={{ display: 'none' }}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0]
                console.log(file)
                if (!file) return
                const { data } = await uploadAvatar(file)
                setAvatar(data.url)
              }}
            />

            <FormControl variant="standard">
              <h4>name</h4>
              <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updateProfile()}>save</Button>
          <Button onClick={() => setOpenDialog(false)}>cancel</Button>
        </DialogActions>
      </Dialog>
    </ProfileWrapper>
  )
}
export default Profile
const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 20px;
`
const ProfileTopBox = styled.div`
  background: #ffffff;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
`
const UserImg = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
`
const ProfileRightBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
`
const UserName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 54px;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 25px;
`
const UserAddress = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: rgba(51, 51, 51, 0.6);
`

const UserAccountListBox = styled.div`
  display: flex;
  gap: 10px;
`
const BindBtnBase = styled(ButtonBase)`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: #ffffff;
  font-weight: 700;
`
const MetamaskBindBtn = styled(BindBtnBase)`
  background: #f5e5d5;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const PhantomBindBtn = styled(BindBtnBase)`
  background: #551ff4;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`

const TwitterBindBtn = styled(BindBtnBase)`
  background: #5368ed;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`

const DiscordBindBtn = styled(BindBtnBase)`
  background: #5368ed;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const EmailBindBtn = styled(BindBtnBase)`
  background: #3dd606;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`

const ProfileTabsBox = styled.div`
  margin-top: 30px;
  background: #ffffff;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ProfileTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  border-bottom: 1px solid #d9d9d9;
  padding-top: 40px;
`
const ProfileTab = styled.div<{ isActive?: boolean }>`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;

  cursor: pointer;
  border-bottom: ${(props) => (props.isActive ? '4px solid #3DD606;' : 'none')};
  color: ${(props) => (props.isActive ? '#333333' : 'rgba(51, 51, 51, 0.6)')};
  padding-bottom: 16px;
  text-align: center;
`
const ProfileTabContentBox = styled.div`
  padding: 40px;
  box-sizing: border-box;
`
