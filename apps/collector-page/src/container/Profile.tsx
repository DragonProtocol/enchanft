/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 18:19:21
 * @Description: 个人信息
 */
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import { useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CommunityList, { CommunityListItemsType } from '../components/business/community/CommunityList'
import {
  FollowedCommunitityForEntity,
  selectAll as selectAllForFollowedCommunity,
  selectUserFollowedCommunitiesState,
} from '../features/user/followedCommunitiesSlice'
import { AsyncRequestStatus } from '../types'
import {
  selectUserRewardsState,
  UserRewardForEntity,
  selectAll as selectAllForUserRewards,
} from '../features/user/userRewardsSlice'
import RewardList, { RewardListItemsType } from '../components/business/reward/RewardList'
import { ButtonWarning } from '../components/common/button/ButtonBase'
import CardBox from '../components/common/card/CardBox'
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup'
import { MOBILE_BREAK_POINT } from '../constants'
import { useNavigate } from 'react-router-dom'
import OverflowEllipsisBox from '../components/common/text/OverflowEllipsisBox'
import { isMobile } from 'react-device-detect'
import {
  useWlUserReact,
  WlUserActionType,
  WlUserModalType,
  BindWithAuthorizerButton,
  UserAvatar,
  AuthorizerType,
} from '@ecnft/wl-user-react'
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
  const { isLogin, user, dispatchAction, dispatchModal, authorizers } = useWlUserReact()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    if (isLogin) {
      dispatchAction({ type: WlUserActionType.LOGOUT })
      navigate('/')
    }
  }, [isLogin])

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
          <IconButton onClick={() => dispatchModal({ type: WlUserModalType.EDIT_PROFILE })}>
            <EditIcon />
          </IconButton>
        </UserNameRow>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        {/* <UserAddress>{user.pubkey}</UserAddress> */}
      </UserBasicInfoBox>
    )
  }
  const renderUserAccountList = () => {
    return (
      <UserAccountListBox>
        {authorizers.map((authorizer) => (
          <BindWithAuthorizerButton authorizerType={authorizer.type} key={authorizer.type} />
        ))}
      </UserAccountListBox>
    )
  }
  const renderUserInfoPc = () => {
    return (
      <ProfileTopBox>
        <ProfileUserAvatar />
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
          <ProfileUserAvatar />
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
const ProfileUserAvatar = styled(UserAvatar)`
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
  gap: 20px;
  justify-content: space-between;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
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
