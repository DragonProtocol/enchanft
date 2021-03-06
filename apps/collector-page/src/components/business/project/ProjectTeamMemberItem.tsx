/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:33:18
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-11 18:18:16
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType } from '../../../types/api'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'

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
        <TeamMemberAvatar src={avatar} />
        <TeamMemberInfoBox>
          <TeamMemberName>{partner}</TeamMemberName>
          <TeamMemberRole>{role}</TeamMemberRole>
        </TeamMemberInfoBox>
      </TeamMemberTopBox>
      <TeamMemberDescription number={3}>{description}</TeamMemberDescription>
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
const TeamMemberAvatar = styled.img`
  width: 200px;
  height: 200px;
`
const TeamMemberInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`
const TeamMemberName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  font-weight: bold;
`
const TeamMemberRole = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  font-weight: bold;
`
const TeamMemberDescription = styled(OverflowEllipsisBox)`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  margin-top: 25px;
`
