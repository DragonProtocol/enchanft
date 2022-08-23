/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 17:21:35
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
  CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import {
  selectAccount,
  userUpdateProfile,
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
import ButtonBase, { ButtonInfo, ButtonPrimary } from '../components/common/button/ButtonBase'
import IconTwitterWhite from '../components/common/icons/IconTwitterWhite'
import IconDiscordWhite from '../components/common/icons/IconDiscordWhite'
import IconEmailWhite from '../components/common/icons/IconEmailWhite'
import CardBox from '../components/common/card/CardBox'
import IconPhantomWhite from '../components/common/icons/IconPhantomWhite'
import IconMetamask from '../components/common/icons/IconMetamask'
import UserAvatar from '../components/business/user/UserAvatar'
import UploadImgMaskImg from '../components/imgs/upload_img_mask.svg'
import { toast } from 'react-toastify'
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup'
import { AVATAR_SIZE_LIMIT } from '../constants'

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
    const displayMint = Boolean(item.whitelist?.mintUrl)
    return {
      data: { ...item },
      viewConfig: {
        displayMint,
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
    label: 'My Rewards',
    value: 'myRewards',
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
  const [uploading, setUploading] = useState(false)
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
  console.log({ whitelistItems })

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
      <MainContentBox>
        <ProfileTopBox>
          <UserImg src={account.avatar} />
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
                <IconMetamask />
                {accountMetamask ? sortPubKey(accountMetamask.thirdpartyId) : 'Connect Metamask'}
              </MetamaskBindBtn>
              <PhantomBindBtn
                onClick={() => {
                  if (accountPhantom) return
                  bindPhantom()
                }}
              >
                <IconPhantomWhite />
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
        <ProfileInfoTabsBox>
          <ButtonRadioGroupProfileTabs
            options={ProfileTabOptions}
            value={curProfileTab}
            onChange={(value) => setCurProfileTab(value)}
          />
          <ProfileTabContentBox>
            {curProfileTab === 'myCommunities' && (
              <CommunityList items={followedCommunityItems} loading={loadingFollowedCommunities} />
            )}
            {curProfileTab === 'myRewards' && <WhitelistList items={whitelistItems} loading={loadingUserWhitelists} />}
            {/* {curProfileTab === 'myEnchanfted' && (
                <EnchanftedList items={myEnchanftedItems} loading={loadingEnchanftedList} />
              )} */}
          </ProfileTabContentBox>
        </ProfileInfoTabsBox>
      </MainContentBox>
      <Dialog open={openDialog} fullWidth={true} maxWidth={'sm'}>
        <EditProfileBox>
          <EditProfileTitle>Change Profile</EditProfileTitle>
          <EditFormBox>
            <EditAvatarBox
              onClick={() => {
                document.getElementById('uploadinput')?.click()
              }}
            >
              {(uploading && (
                <div className="uploading">
                  <CircularProgress size="5rem" color="inherit" />
                  <p>Uploading Image</p>
                </div>
              )) || <EditAvatar src={avatar || account.avatar} />}
            </EditAvatarBox>

            <EditNameBox>
              <input
                title="uploadinput"
                id="uploadinput"
                style={{ display: 'none' }}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0]
                  if (!file) return
                  if (file.size > AVATAR_SIZE_LIMIT) {
                    toast.error('File Too Large, 200k limit')
                    return
                  }

                  setUploading(true)
                  try {
                    const { data } = await uploadAvatar(file)
                    setAvatar(data.url)
                    toast.success('upload success')
                  } catch (error) {
                    toast.error('upload fail')
                  } finally {
                    setUploading(false)
                  }
                }}
              />

              <FormControl variant="standard">
                <EditNameLabel>Name</EditNameLabel>
                <TextField id="name" value={name || account.name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </EditNameBox>
          </EditFormBox>
          <EditButtonBox>
            <EditProfileBtnCancel onClick={() => setOpenDialog(false)}>cancel</EditProfileBtnCancel>
            <EditProfileBtnSave onClick={() => updateProfile()}>save</EditProfileBtnSave>
          </EditButtonBox>
        </EditProfileBox>
      </Dialog>
    </ProfileWrapper>
  )
}
export default Profile
const ProfileWrapper = styled.div`
  width: 100%;
`
const ProfileTopBox = styled(CardBox)`
  border: 4px solid #333333;
  display: flex;
  gap: 20px;
`
const UserImg = styled(UserAvatar)`
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

const ProfileInfoTabsBox = styled(CardBox)`
  margin-top: 20px;
`
const ButtonRadioGroupProfileTabs = styled(ButtonRadioGroup)`
  width: 400px;
  margin: 0 auto;
`
const ProfileTabContentBox = styled.div`
  margin-top: 20px;
`

// Edit Form
const EditProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`
const EditProfileTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #222222;
`
const EditFormBox = styled.div`
  display: flex;
  gap: 10px;
`
const EditAvatarBox = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
  &:hover {
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${UploadImgMaskImg});
    }
  }
  & .uploading {
    text-align: center;
    padding-top: 20px;
  }
`
const EditAvatar = styled(UserAvatar)`
  width: 160px;
  height: 160px;
  object-fit: cover;
`
const EditNameBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const EditNameLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const EditProfileBtnSave = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
`
const EditProfileBtnCancel = styled(ButtonBase)`
  width: 120px;
  height: 48px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  background: #f8f8f8;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const EditButtonBox = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
`
