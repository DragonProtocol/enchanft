/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:33:18
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 11:26:03
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getMultiavatarIdByUser } from '../../../utils/multiavatar'
import RichTextBox from '../../common/text/RichTextBox'
import UserAvatar from '../user/UserAvatar'

export type ProjectTeamMemberItemDataType = {
  id: number
  partner: string
  role: string
  avatar: string
  description: string
}

export type ProjectTeamMemberItemViewConfigType = {}

export type ProjectTeamMemberItemDataViewType = {
  data: ProjectTeamMemberItemDataType
  viewConfig?: ProjectTeamMemberItemViewConfigType
}

export type ProjectTeamMemberItemProps = ProjectTeamMemberItemDataViewType

const defaultViewConfig = {}
const ProjectTeamMemberItem: React.FC<ProjectTeamMemberItemProps> = ({
  data,
  viewConfig,
}: ProjectTeamMemberItemProps) => {
  const navigate = useNavigate()
  const { id, partner, role, avatar, description } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }

  return (
    <ProjectTeamMemberItemWrapper>
      <TeamMemberTopBox>
        <TeamMemberAvatar src={avatar} multiavatarId={getMultiavatarIdByUser(data)} />
        <TeamMemberInfoBox>
          <TeamMemberName>{partner}</TeamMemberName>
          <TeamMemberRole>{role}</TeamMemberRole>
        </TeamMemberInfoBox>
      </TeamMemberTopBox>
      <TeamMemberDescription value={description} />
    </ProjectTeamMemberItemWrapper>
  )
}
export default ProjectTeamMemberItem
const ProjectTeamMemberItemWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`
const TeamMemberTopBox = styled.div`
  display: flex;
  gap: 20px;
`
const TeamMemberAvatar = styled(UserAvatar)`
  width: 120px;
  height: 120px;
`
const TeamMemberInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`
const TeamMemberName = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #333333;
`
const TeamMemberRole = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: #3dd606;
`
const TeamMemberDescription = styled(RichTextBox)`
  width: 100%;
  margin-top: 10px;
`
