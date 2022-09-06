/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-01 16:24:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 17:56:16
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import IconWebsite from '../../common/icons/IconWebsite'
import IconTwitterBlack from '../../common/icons/IconTwitterBlack'
import IconDiscordBlack from '../../common/icons/IconDiscordBlack'
import { getTwitterHomeLink } from '../../../utils/twitter'
import CommunityFollowButton, { CommunityFollowButtonViewConfigType } from '../community/CommunityFollowButton'
export type ProjectDetailCommunityDataType = {
  id: number
  name: string
  icon: string
  website: string
  twitter: string
  twitterId: string
  discord: string
  discordInviteUrl: string
}

export type ProjectDetailCommunityDataViewType = {
  data: ProjectDetailCommunityDataType
  viewConfig?: CommunityFollowButtonViewConfigType
}
export type ProjectDetailCommunityHandlesType = {
  onFollow?: () => void
  onAccountOperation?: () => void
}
export type ProjectDetailCommunityProps = ProjectDetailCommunityDataViewType & ProjectDetailCommunityHandlesType

const ProjectDetailCommunity: React.FC<ProjectDetailCommunityProps> = ({
  data,
  viewConfig,
  onFollow,
  onAccountOperation,
}: ProjectDetailCommunityProps) => {
  const { name, icon, website, twitterId, discordInviteUrl } = data
  const twitterHomeLink = getTwitterHomeLink(twitterId)
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
      <FollowBtn
        followStatusType={viewConfig?.followStatusType}
        followBtnText={viewConfig?.followBtnText}
        onFollow={onFollow}
        onAccountOperation={onAccountOperation}
      />
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
const FollowBtn = styled(CommunityFollowButton)`
  min-width: 100px;
  height: 40px;
`
