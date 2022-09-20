/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:30:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 18:19:26
 * @Description: file description
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { getMultiavatarIdByUser } from '../../../utils/multiavatar'
import { ButtonWarning } from '../../common/button/ButtonBase'
import CommunityFollowButton, { FollowStatusType } from '../community/CommunityFollowButton'
import UserAvatar from '../user/UserAvatar'
export type ContributionMyDataType = {
  id: number
  avatar: string
  userName: string
  score: number
  pubkey: string
}

export type ContributionMyViewConfigType = {
  displayFollowCommunity?: boolean
  followStatusType?: FollowStatusType
}

export type ContributionMyDataViewType = {
  data: ContributionMyDataType
  viewConfig?: ContributionMyViewConfigType
}
export type ContributionMyHandlesType = {
  onFollow?: () => void
  onAccountOperation?: () => void
}

export type ContributionMyProps = ContributionMyDataViewType & ContributionMyHandlesType

const defaultViewConfig = {
  displayFollowCommunity: false,
  followStatusType: FollowStatusType.UNKNOWN,
}
const ContributionMy: React.FC<ContributionMyProps> = ({
  data,
  viewConfig,
  onFollow,
  onAccountOperation,
}: ContributionMyProps) => {
  const { avatar, userName, score, pubkey } = data
  const { displayFollowCommunity, followStatusType } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  return (
    <ContributionMyWrapper>
      <Avatar src={avatar} multiavatarId={getMultiavatarIdByUser(data)} />
      <RightBox>
        <UserName>{userName}</UserName>

        {displayFollowCommunity ? (
          <FollowBtn followStatusType={followStatusType} onFollow={onFollow} onAccountOperation={onAccountOperation} />
        ) : (
          <UserScore>My Token : {score}</UserScore>
        )}
      </RightBox>
    </ContributionMyWrapper>
  )
}
export default ContributionMy

const ContributionMyWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 10px;
  }
`
const Avatar = styled(UserAvatar)`
  width: 80px;
  height: 80px;
  border-radius: 10px;
`
const RightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const UserName = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  color: #333333;
`
const UserScore = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
const FollowBtn = styled(CommunityFollowButton)`
  min-width: 100px;
  height: 48px;
  font-weight: 700;
  font-size: 18px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
    height: 40px;
  }
`
