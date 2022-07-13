/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:49:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 14:40:47
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import ProjectItem, { ProjectItemDataViewType } from './ProjectItem'

export type ProjectListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ProjectListItemsType = ProjectItemDataViewType[]
export type ProjectListProps = ProjectListViewConfigType & {
  items: ProjectListItemsType
}
const ProjectList: React.FC<ProjectListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no project',
}: ProjectListProps) => (
  <>
    {loading && <ProjectListLoading>{loadingMsg}</ProjectListLoading>}
    {!loading && items.length === 0 && emptyMsg && <ProjectListEmpty>{emptyMsg}</ProjectListEmpty>}
    <ProjectListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => <ProjectItem key={`${item.data.id}`} data={item.data} viewConfig={item.viewConfig} />)}
    </ProjectListWrapper>
  </>
)
export default ProjectList
const ProjectListWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  grid-gap: 26px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }
`
const ProjectListLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ProjectListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
