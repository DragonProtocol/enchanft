/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 15:30:55
 * @Description: 个人信息
 */
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
  userOtherWalletLink,
  setLastLogin,
  setLastLoginInfo,
  setToken,
  setPubkey,
  setAvatar as setAvatarForSlice,
  setName as setNameForSlice,
  setIsLogin,
  logout,
} from '../features/user/accountSlice'
import { AccountType, ActionType } from '../types/entities'

import CommunityList, { CommunityListItemsType } from '../components/business/community/CommunityList'
import DisconnectModal from '../components/ConnectBtn/DisconnectModal'
import {
  FollowedCommunitityForEntity,
  selectAll as selectAllForFollowedCommunity,
  selectUserFollowedCommunitiesState,
} from '../features/user/followedCommunitiesSlice'
import { AsyncRequestStatus } from '../types'
import { uploadAvatar } from '../services/api/login'
import { connectionSocialMedia, SocialMediaType } from '../utils/socialMedia'
import { sortPubKey } from '../utils/solana'
import useWalletSign from '../hooks/useWalletSign'
import { clearLoginToken, SIGN_MSG } from '../utils/token'
import {
  selectUserRewardsState,
  UserRewardForEntity,
  selectAll as selectAllForUserRewards,
} from '../features/user/userRewardsSlice'
import RewardList, { RewardListItemsType } from '../components/business/reward/RewardList'
import ButtonBase, { ButtonInfo, ButtonPrimary, ButtonWarning } from '../components/common/button/ButtonBase'
import IconTwitterWhite from '../components/common/icons/IconTwitterWhite'
import IconDiscordWhite from '../components/common/icons/IconDiscordWhite'
import IconEmailWhite from '../components/common/icons/IconEmailWhite'
import IconUnlink from '../components/common/icons/IconUnlink'
import CardBox from '../components/common/card/CardBox'
import IconPhantomWhite from '../components/common/icons/IconPhantomWhite'
import IconMetamask from '../components/common/icons/IconMetamask'
import IconMartian from '../components/common/icons/IconMartian'
import UserAvatar from '../components/business/user/UserAvatar'
import UploadImgMaskImg from '../components/imgs/upload_img_mask.svg'
import { toast } from 'react-toastify'
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup'
import { AVATAR_SIZE_LIMIT, MOBILE_BREAK_POINT } from '../constants'
import { useNavigate } from 'react-router-dom'
import OverflowEllipsisBox from '../components/common/text/OverflowEllipsisBox'
import { isMobile } from 'react-device-detect'
import { getMultiavatarIdByUser } from '../utils/multiavatar'

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
const formatStoreDataToComponentDataByUserRewards = (rewards: UserRewardForEntity[]): RewardListItemsType => {
  return rewards.map((item) => {
    return {
      data: { ...item },
      viewConfig: {},
    }
  })
}
const ProfileTabOptions = [
  {
    label: 'My WL Application',
    value: 'myCommunities',
  },
  {
    label: 'My Rewards',
    value: 'myRewards',
  },
]
const Profile: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const account = useAppSelector(selectAccount)
  const [name, setName] = useState(account.name || '')
  const [avatar, setAvatar] = useState(account.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [accountType, setAccountType] = useState('twitter')

  const handleLogout = useCallback(async () => {
    if (account.isLogin) {
      dispatch(logout())
      navigate('/')
    }
  }, [account])
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
  // 我的reward列表
  const rewards = useAppSelector(selectAllForUserRewards)
  const { status: rewardsStatus } = useAppSelector(selectUserRewardsState)
  const loadingUserRewards = rewardsStatus === AsyncRequestStatus.PENDING
  const rewardItems = formatStoreDataToComponentDataByUserRewards(rewards)

  const twitter = account.accounts.find((item) => item.accountType === AccountType.TWITTER)
  const discord = account.accounts.find((item) => item.accountType === AccountType.DISCORD)
  const accountPhantom = account.accounts.find((item) => item.accountType === AccountType.SOLANA)
  const accountMetamask = account.accounts.find((item) => item.accountType === AccountType.EVM)
  const accountMartian = account.accounts.find((item) => item.accountType === AccountType.APTOS)

  const { phantomValid, metamaskValid, martianValid, signMsgWithMetamask, signMsgWithPhantom, signMsgWithMartian } =
    useWalletSign()
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
  const bindMartian = useCallback(async () => {
    if (!martianValid) alert('Install Martian first')
    const data = await signMsgWithMartian()
    console.log(data)
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: data?.payloadMsg || SIGN_MSG,
      }),
    )
  }, [martianValid])
  const renderUserBasicInfo = () => {
    return (
      <UserBasicInfoBox>
        <UserNameRow>
          <UserName>{account.name}</UserName>
          <IconButton onClick={() => setOpenDialog(true)}>
            <EditIcon />
          </IconButton>
          <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        </UserNameRow>
        <UserAddress>{account.pubkey}</UserAddress>
      </UserBasicInfoBox>
    )
  }
  const renderUserAccountList = () => {
    return (
      <UserAccountListBox>
        <MetamaskBindBtn
          onClick={() => {
            if (accountMetamask) return
            bindMetamask()
          }}
        >
          <ConnectIconBox>
            <IconMetamask />
          </ConnectIconBox>
          <BindBtnText>{accountMetamask ? sortPubKey(accountMetamask.thirdpartyId) : 'Connect Metamask'}</BindBtnText>
        </MetamaskBindBtn>
        <PhantomBindBtn
          onClick={() => {
            if (accountPhantom) return
            bindPhantom()
          }}
        >
          <IconPhantomWhite />
          <BindBtnText>{accountPhantom ? sortPubKey(accountPhantom.thirdpartyId) : 'Connect Phantom'}</BindBtnText>
        </PhantomBindBtn>
        <MartianBindBtn
          onClick={() => {
            if (accountMartian) return
            bindMartian()
          }}
        >
          <IconMartian />
          <BindBtnText>{accountMartian ? sortPubKey(accountMartian.thirdpartyId) : 'Connect Martian'}</BindBtnText>
        </MartianBindBtn>
        <TwitterBindBtn
          isConnect={!!twitter}
          onClick={() => {
            if (!!twitter) {
              setAccountType(AccountType.TWITTER)
              setModalShow(true)
            } else {
              connectionSocialMedia(SocialMediaType.TWITTER_OAUTH2_AUTHORIZE)
            }
          }}
        >
          <IconTwitterWhite />
          {!!twitter ? (
            <>
              <BindBtnText>{twitter.thirdpartyName}</BindBtnText>
              <DisconnectBox>
                <IconUnlink size="1.2rem" />
              </DisconnectBox>
            </>
          ) : (
            <BindBtnText>Connect Twitter</BindBtnText>
          )}
        </TwitterBindBtn>
        <DiscordBindBtn
          isConnect={!!discord}
          onClick={() => {
            if (!!discord) {
              setAccountType(AccountType.DISCORD)
              setModalShow(true)
            } else {
              connectionSocialMedia(SocialMediaType.DISCORD_OAUTH2_AUTHORIZE)
            }
          }}
        >
          <IconDiscordWhite />
          {!!discord ? (
            <>
              <BindBtnText>{discord.thirdpartyName}</BindBtnText>
              <DisconnectBox>
                <IconUnlink size="1.2rem" />
              </DisconnectBox>
            </>
          ) : (
            <BindBtnText>Connect Discord</BindBtnText>
          )}
        </DiscordBindBtn>
        {/* <EmailBindBtn>
          <IconEmailWhite />
          {'Connect Email'}
        </EmailBindBtn> */}
      </UserAccountListBox>
    )
  }
  const renderUserInfoPc = () => {
    return (
      <ProfileTopBox>
        <UserImg src={account.avatar} multiavatarId={getMultiavatarIdByUser(account)} />
        <TopRightBox>
          {renderUserBasicInfo()}
          {renderUserAccountList()}
        </TopRightBox>
      </ProfileTopBox>
    )
  }
  const renderUserInfoMobile = () => {
    return (
      <ProfileTopBox>
        <TopRightBox>
          <UserImg src={account.avatar} multiavatarId={getMultiavatarIdByUser(account)} />
          {renderUserBasicInfo()}
        </TopRightBox>
        {renderUserAccountList()}
      </ProfileTopBox>
    )
  }
  return (
    <ProfileWrapper>
      {isMobile ? renderUserInfoMobile() : renderUserInfoPc()}
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
          {curProfileTab === 'myRewards' && <RewardList items={rewardItems} loading={loadingUserRewards} />}
        </ProfileTabContentBox>
      </ProfileInfoTabsBox>
      <DialogBox open={openDialog}>
        <EditProfileBox>
          <EditProfileTitle>Edit Profile</EditProfileTitle>
          <EditFormBox>
            <EditAvatarBox
              onClick={() => {
                document.getElementById('uploadinput')?.click()
              }}
            >
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
              {(uploading && (
                <div className="uploading">
                  <CircularProgress size="5rem" color="inherit" />
                  <p>Uploading Image</p>
                </div>
              )) || <EditAvatar src={avatar || account.avatar} multiavatarId={getMultiavatarIdByUser(account)} />}
            </EditAvatarBox>

            <EditNameBox>
              <FormControl variant="standard">
                <EditNameLabel>Name</EditNameLabel>
                <input title="name" id="name" value={name || account.name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </EditNameBox>
          </EditFormBox>
          <EditButtonBox>
            <EditProfileBtnCancel onClick={() => setOpenDialog(false)}>Cancel</EditProfileBtnCancel>
            <EditProfileBtnSave onClick={() => updateProfile()}>Save</EditProfileBtnSave>
          </EditButtonBox>
        </EditProfileBox>
      </DialogBox>
      <DisconnectModal modalShow={modalShow} setModalShow={setModalShow} type={accountType} />
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
`
const LogoutBtn = styled(ButtonWarning)`
  font-weight: 700;
  font-size: 18px;
  height: 40px;
  margin-left: auto;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    padding: 5px 10px;
  }
`
const UserImg = styled(UserAvatar)`
  width: 160px;
  height: 160px;
  object-fit: cover;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 80px;
    height: 80px;
  }
`
const TopRightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: row;
    gap: 10px;
  }
`
const UserBasicInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex: 1;
    justify-content: start;
    gap: 10px;
    overflow: hidden;
  }
`
const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 5px;
  }
`
const UserName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 36px;
  line-height: 54px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`
const UserAddress = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
    word-wrap: break-word;
  }
`
const UserAccountListBox = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
const BindBtnBase = styled(ButtonBase)<{ isConnect?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => (props.isConnect ? '16px 8px 16px 18px' : '16px 18px')};
  gap: 10px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    min-width: 40px;
    height: 40px;
    padding: 0;
  }
`
const BindBtnText = styled.span`
  gap: 12px;
  font-size: 14px;
  color: #ffffff;
  font-weight: 700;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    display: none;
  }
`
const MetamaskBindBtn = styled(BindBtnBase)`
  background: #f6851b;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const PhantomBindBtn = styled(BindBtnBase)`
  background: #551ff4;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const MartianBindBtn = styled(BindBtnBase)`
  background: #171f1c;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`

const TwitterBindBtn = styled(BindBtnBase)`
  background: #5368ed;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 8px;
  }
`

const DiscordBindBtn = styled(BindBtnBase)`
  background: #5368ed;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 8px;
  }
`

const DisconnectBox = styled.div`
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
`
const EmailBindBtn = styled(BindBtnBase)`
  background: #3dd606;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const ConnectIconBox = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  padding: 2px;
  background: #ffffff;
  border-radius: 50%;
  text-align: center;
  line-height: 1.5rem;
`
const ProfileInfoTabsBox = styled(CardBox)`
  margin-top: 20px;
`
const ButtonRadioGroupProfileTabs = styled(ButtonRadioGroup)`
  width: 400px;
  margin: 0 auto;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
    font-size: 12px;
    line-height: 18px;
  }
`
const ProfileTabContentBox = styled.div`
  margin-top: 20px;
`

const DialogBox = styled(Dialog)`
  & div[role='dialog'] {
    border-radius: 20px;
  }
`

// Edit Form
const EditProfileBox = styled.div`
  width: 540px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  background: #f7f9f1;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: auto;
  }
`
const EditProfileTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #222222;
`
const EditFormBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const EditAvatarBox = styled.div`
  margin: 0 auto;
  width: 160px;
  height: 160px;
  position: relative;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 80px;
    height: 80px;
  }
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
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      padding-top: 0;
      font-size: 12px;
      line-height: 18px;
    }
  }
`
const EditAvatar = styled(UserAvatar)`
  width: 160px;
  height: 160px;
  object-fit: cover;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 80px;
    height: 80px;
  }
`
const EditNameBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & input {
    padding: 11.5px 18px;
    margin-top: 10px;
    border-radius: 10px;
    background: #ebeee4;
    border: none !important;
    outline: none !important;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    color: #333333;
  }
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    justify-content: space-between;
  }
`
