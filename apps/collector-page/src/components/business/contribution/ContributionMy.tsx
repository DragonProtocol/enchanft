/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:30:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-01 14:22:29
 * @Description: file description
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import UserAvatar from '../user/UserAvatar'
export type ContributionMyDataType = {
  avatar: string
  userName: string
  score: number
}

export type ContributionMyViewConfigType = {}

export type ContributionMyDataViewType = {
  data: ContributionMyDataType
  viewConfig?: ContributionMyViewConfigType
}
export type ContributionMyHandlesType = {}

export type ContributionMyProps = ContributionMyDataViewType & ContributionMyHandlesType

const defaultViewConfig = {}
const ContributionMy: React.FC<ContributionMyProps> = ({ data, viewConfig }: ContributionMyProps) => {
  const { avatar, userName, score } = data
  const {} = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  return (
    <ContributionMyWrapper>
      <Avatar src={avatar} />
      <RightBox>
        <UserName>{userName}</UserName>
        <UserScore>{score}</UserScore>
      </RightBox>
    </ContributionMyWrapper>
  )
}
export default ContributionMy

const ContributionMyWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`
const Avatar = styled(UserAvatar)`
  width: 80px;
  height: 80px;
`
const RightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const UserName = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  color: #333333;
`
const UserScore = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: rgba(51, 51, 51, 0.6);
`
