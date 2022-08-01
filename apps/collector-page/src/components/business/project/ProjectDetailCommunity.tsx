import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import React from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import WebsiteIcon from '../../imgs/internet.svg'
import TwitterIcon from '../../imgs/twitter.svg'
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
      <CommunityCenter>
        <CommunityName>{name}</CommunityName>
        <PorjectLinksBox>
          <a href={website} target="_blank" rel="noopener noreferrer">
            <ProjectLinkIcon src={WebsiteIcon} />
          </a>
          <a href={twitter} target="_blank" rel="noopener noreferrer">
            <ProjectLinkIcon src={TwitterIcon} />
          </a>
        </PorjectLinksBox>
      </CommunityCenter>
      <CommunityRightBox>
        {displayFollow && (
          <CommunityFollow isOpen={isFollowed} onClick={handleFollowChange}>
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
const PorjectLinksBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 23px;
`
const ProjectLinkIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
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
