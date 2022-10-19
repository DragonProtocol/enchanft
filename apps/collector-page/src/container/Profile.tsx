/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 23:27:48
 * @Description: 个人信息
 */
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import useInterval from '../hooks/useInterval'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import styled from 'styled-components'
import { Dialog, FormControl, IconButton, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { userUpdateProfile } from '../features/user/accountSlice'

import CommunityList, { CommunityListItemsType } from '../components/business/community/CommunityList'
import DisconnectModal from '../components/ConnectBtn/DisconnectModal'
import {
  FollowedCommunitityForEntity,
  selectAll as selectAllForFollowedCommunity,
  selectUserFollowedCommunitiesState,
} from '../features/user/followedCommunitiesSlice'
import { AsyncRequestStatus } from '../types'
import { uploadAvatar } from '../services/api/login'
import {
  selectUserRewardsState,
  UserRewardForEntity,
  selectAll as selectAllForUserRewards,
} from '../features/user/userRewardsSlice'
import RewardList, { RewardListItemsType } from '../components/business/reward/RewardList'
import ButtonBase, { ButtonInfo, ButtonPrimary, ButtonWarning } from '../components/common/button/ButtonBase'
import CardBox from '../components/common/card/CardBox'
import UserAvatar from '../components/business/user/UserAvatar'
import UploadImgMaskImg from '../components/imgs/upload_img_mask.svg'
import { toast } from 'react-toastify'
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup'
import { AVATAR_SIZE_LIMIT, MOBILE_BREAK_POINT } from '../constants'
import { useNavigate } from 'react-router-dom'
import OverflowEllipsisBox from '../components/common/text/OverflowEllipsisBox'
import { isMobile } from 'react-device-detect'
import { getMultiavatarIdByUser } from '../utils/multiavatar'
import { useWlUserReact, WlUserActionType, BindWithSignerButton } from '../../../../libs/wl-user-react/core/src'
import { SignerType } from '../../../../libs/wl-user-react/core/src/signer'
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
  const { isLogin, user, dispatchAction } = useWlUserReact()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name || '')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const handleLogout = useCallback(async () => {
    if (isLogin) {
      dispatchAction({ type: WlUserActionType.LOGOUT })
      navigate('/')
    }
  }, [isLogin])
  const updateProfile = useCallback(() => {
    if (!isLogin) return
    dispatchAction({
      type: WlUserActionType.UPDATE_USER_PROFILE,
      payload: { name, avatar },
      then: () => {
        setOpenDialog(false)
      },
      catch: (error) => {
        toast.error(error.message)
      },
    })
  }, [isLogin, name, avatar])

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

  const renderUserBasicInfo = () => {
    return (
      <UserBasicInfoBox>
        <UserNameRow>
          <UserName>{user.name}</UserName>
          <IconButton onClick={() => setOpenDialog(true)}>
            <EditIcon />
          </IconButton>
          <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        </UserNameRow>
        {/* <UserAddress>{user.pubkey}</UserAddress> */}
      </UserBasicInfoBox>
    )
  }
  const renderUserAccountList = () => {
    return (
      <UserAccountListBox>
        <BindWithSignerButton signerType={SignerType.METAMASK} />
        <BindWithSignerButton signerType={SignerType.PHANTOM} />
        <BindWithSignerButton signerType={SignerType.MARTIAN} />
        <BindWithSignerButton signerType={SignerType.TWITTER} />
        <BindWithSignerButton signerType={SignerType.DISCORD} />
      </UserAccountListBox>
    )
  }
  const renderUserInfoPc = () => {
    return (
      <ProfileTopBox>
        <UserImg src={user.avatar} multiavatarId={getMultiavatarIdByUser(user)} />
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
          <UserImg src={user.avatar} multiavatarId={getMultiavatarIdByUser(user)} />
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
                  dispatchAction({
                    type: WlUserActionType.UPLOAD_USER_AVATAR,
                    payload: file,
                    then: (data) => {
                      setAvatar(data.url)
                      toast.success('upload success')
                      setUploading(false)
                    },
                    catch: () => {
                      toast.error('upload fail')
                      setUploading(false)
                    },
                  })
                }}
              />
              {(uploading && (
                <div className="uploading">
                  <CircularProgress size="5rem" color="inherit" />
                  <p>Uploading Image</p>
                </div>
              )) || <EditAvatar src={avatar || user.avatar} multiavatarId={getMultiavatarIdByUser(user)} />}
            </EditAvatarBox>

            <EditNameBox>
              <FormControl variant="standard">
                <EditNameLabel>Name</EditNameLabel>
                <input title="name" id="name" value={name || user.name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </EditNameBox>
          </EditFormBox>
          <EditButtonBox>
            <EditProfileBtnCancel onClick={() => setOpenDialog(false)}>Cancel</EditProfileBtnCancel>
            <EditProfileBtnSave onClick={() => updateProfile()}>Save</EditProfileBtnSave>
          </EditButtonBox>
        </EditProfileBox>
      </DialogBox>
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
