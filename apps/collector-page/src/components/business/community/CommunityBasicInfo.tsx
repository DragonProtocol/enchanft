/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 10:11:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 16:36:57
 * @Description: file description
 */
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import React from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'

export type CommunityBasicInfoDataType = {
  id: number
  name: string
  icon: string
  description: string
  communityFollowerNum: number
  isFollowed: boolean
}

export type CommunityBasicInfoViewConfigType = {
  displayFollow?: boolean
}

export type CommunityBasicInfoDataViewType = {
  data: CommunityBasicInfoDataType
  viewConfig?: CommunityBasicInfoViewConfigType
}
export type CommunityBasicInfoHandlesType = {
  onFollowChange?: (open: boolean) => void
}
export type CommunityBasicInfoProps = CommunityBasicInfoDataViewType & CommunityBasicInfoHandlesType

const defaultViewConfig = {
  displayFollow: true,
}
const CommunityBasicInfo: React.FC<CommunityBasicInfoProps> = ({
  data,
  viewConfig,
  onFollowChange,
}: CommunityBasicInfoProps) => {
  const { name, icon, description, communityFollowerNum, isFollowed } = data
  const { displayFollow } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleFollowChange = () => {
    if (onFollowChange) {
      onFollowChange(!isFollowed)
    }
  }
  return (
    <CommunityBasicInfoWrapper>
      <CommunityImg src={icon} />
      <CommunityCenter>
        <CommunityName>{name}</CommunityName>
        <CommunityMembers>{communityFollowerNum || 0} members</CommunityMembers>
        <CommunityDescription number={3}>{description}</CommunityDescription>
      </CommunityCenter>
      <CommunityRightBox>
        {displayFollow && (
          <CommunityFollow isOpen={isFollowed} onClick={handleFollowChange}>
            {isFollowed ? 'Joined' : 'Join'}
          </CommunityFollow>
        )}
      </CommunityRightBox>
    </CommunityBasicInfoWrapper>
  )
}
export default CommunityBasicInfo
const CommunityBasicInfoWrapper = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
`
const CommunityImg = styled.img`
  width: 160px;
  height: 100%;
  border-radius: 10px;
  border: 1px solid rgba(187, 187, 187, 100);
`
const CommunityCenter = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const CommunityName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 32px;
`
const CommunityMembers = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
`
const CommunityDescription = styled(OverflowEllipsisBox)`
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  overflow: hidden;
`
const CommunityRightBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const CommunityFollow = styled.div<{ isOpen: boolean }>`
  width: 80px;
  height: 40px;
  border: 1px solid rgba(51, 53, 54, 100);
  box-sizing: border-box;
  border-radius: 4px;
  background-color: ${(props) => (props.isOpen ? '#fff' : 'rgba(51, 53, 54, 100)')};
  color: ${(props) => (props.isOpen ? 'rgba(51, 53, 54, 100)' : '#fff')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
