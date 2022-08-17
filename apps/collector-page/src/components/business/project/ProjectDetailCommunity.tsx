import React from 'react'
import styled from 'styled-components'
import { ButtonWarning } from '../../common/button/ButtonBase'
import IconWebsite from '../../common/icons/IconWebsite'
import IconTwitterBlack from '../../common/icons/IconTwitterBlack'
import IconDiscordBlack from '../../common/icons/IconDiscordBlack'
import { getTwitterHomeLink } from '../../../utils/twitter'
export type ProjectDetailCommunityDataType = {
  id: number
  name: string
  icon: string
  website: string
  twitter: string
  twitterId: string
  discord: string
  discordInviteUrl: string
  isFollowed: boolean
}

export type ProjectDetailCommunityViewConfigType = {
  displayFollow?: boolean
  loadingFollow?: boolean
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
  displayFollow: false,
  loadingFollow: false,
}
const ProjectDetailCommunity: React.FC<ProjectDetailCommunityProps> = ({
  data,
  viewConfig,
  onFollowChange,
}: ProjectDetailCommunityProps) => {
  const { name, icon, website, twitterId, discordInviteUrl, isFollowed } = data
  const twitterHomeLink = getTwitterHomeLink(twitterId)
  const { displayFollow, loadingFollow } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleFollowChange = () => {
    if (onFollowChange) {
      onFollowChange(!isFollowed)
    }
  }
  let followText = isFollowed ? 'Joined' : 'Join'
  if (loadingFollow) {
    followText = 'Loading ...'
  }
  return (
    <ProjectDetailCommunityWrapper>
      {/* <CommunityImg src={icon} /> */}
      {/* <CommunityName>{name}</CommunityName> */}
      <CommunityLeftBox>
        <ProjectLink href={website} target="_blank" rel="noopener noreferrer">
          <IconWebsite />
        </ProjectLink>
        <ProjectLink href={twitterHomeLink} target="_blank" rel="noopener noreferrer">
          <IconTwitterBlack />
        </ProjectLink>
        <ProjectLink href={discordInviteUrl} target="_blank" rel="noopener noreferrer">
          <IconDiscordBlack />
        </ProjectLink>
      </CommunityLeftBox>
      {displayFollow && (
        <CommunityFollowBtn disabled={isFollowed} onClick={handleFollowChange}>
          {followText}
        </CommunityFollowBtn>
      )}
    </ProjectDetailCommunityWrapper>
  )
}
export default ProjectDetailCommunity
const ProjectDetailCommunityWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CommunityImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
`
const CommunityName = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 24px;
  color: #333333;
`

const CommunityLeftBox = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`
const ProjectLink = styled.a`
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const CommunityFollowBtn = styled(ButtonWarning)`
  min-width: 100px;
  height: 40px;
  font-weight: 700;
  font-size: 18px;
`
