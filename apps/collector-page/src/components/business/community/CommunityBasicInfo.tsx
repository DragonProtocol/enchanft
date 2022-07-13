/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 10:11:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-11 17:55:56
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
  isOpenNotification: boolean
}

export type CommunityBasicInfoViewConfigType = {
  displayNotification?: boolean
}

export type CommunityBasicInfoDataViewType = {
  data: CommunityBasicInfoDataType
  viewConfig?: CommunityBasicInfoViewConfigType
}
export type CommunityBasicInfoHandlesType = {
  onNotificationChange?: (open: boolean) => void
}
export type CommunityBasicInfoProps = CommunityBasicInfoDataViewType & CommunityBasicInfoHandlesType

const defaultViewConfig = {
  displayNotification: true,
}
const CommunityBasicInfo: React.FC<CommunityBasicInfoProps> = ({
  data,
  viewConfig,
  onNotificationChange,
}: CommunityBasicInfoProps) => {
  const { name, icon, description, communityFollowerNum, isOpenNotification } = data
  const { displayNotification } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleStatusChange = () => {
    if (onNotificationChange) {
      onNotificationChange(!isOpenNotification)
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
        {displayNotification && (
          <CommunityNotification isOpen={isOpenNotification} onClick={handleStatusChange}>
            {isOpenNotification ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
          </CommunityNotification>
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
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const CommunityNotification = styled.div<{ isOpen: boolean }>`
  width: 40px;
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
