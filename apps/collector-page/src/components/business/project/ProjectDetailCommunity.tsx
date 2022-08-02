import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import React from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import WebsiteIcon from '../../imgs/internet.svg'
import TwitterIcon from '../../imgs/twitter.svg'
import { ButtonWarning } from '../../common/button/ButtonBase'
export type ProjectDetailCommunityDataType = {
  id: number
  name: string
  icon: string
  website: string
  twitter: string
  isFollowed: boolean
}

export type ProjectDetailCommunityViewConfigType = {
  displayFollow?: boolean
}

export type ProjectDetailCommunityDataViewType = {
  data: ProjectDetailCommunityDataType
  viewConfig?: ProjectDetailCommunityViewConfigType
}
export type ProjectDetailCommunityHandlesType = {
  onFollowChange?: (open: boolean) => void
}
export type ProjectDetailCommunityProps = ProjectDetailCommunityDataViewType & ProjectDetailCommunityHandlesType

const defaultViewConfig = {
  displayFollow: true,
}
const ProjectDetailCommunity: React.FC<ProjectDetailCommunityProps> = ({
  data,
  viewConfig,
  onFollowChange,
}: ProjectDetailCommunityProps) => {
  const { name, icon, website, twitter, isFollowed } = data
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
    <ProjectDetailCommunityWrapper>
      <CommunityImg src={icon} />
      <CommunityName>{name}</CommunityName>
      <CommunityRightBox>
        <a href={website} target="_blank" rel="noopener noreferrer">
          <ProjectLinkIcon src={WebsiteIcon} />
        </a>
        <a href={twitter} target="_blank" rel="noopener noreferrer">
          <ProjectLinkIcon src={TwitterIcon} />
        </a>
        {displayFollow && (
          <CommunityFollow disabled={isFollowed} onClick={handleFollowChange}>
            {isFollowed ? 'Joined' : 'Join'}
          </CommunityFollow>
        )}
      </CommunityRightBox>
    </ProjectDetailCommunityWrapper>
  )
}
export default ProjectDetailCommunity
const ProjectDetailCommunityWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`
const CommunityImg = styled.img`
  width: 60px;
  height: 60px;
`
const CommunityName = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 24px;
  color: #333333;
`

const CommunityRightBox = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`
const ProjectLinkIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const CommunityFollow = styled(ButtonWarning)`
  width: 100px;
  height: 48px;
  font-weight: 700;
  font-size: 18px;
`
