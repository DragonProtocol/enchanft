/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-20 18:19:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 10:26:14
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import ExploreTaskItem, { ExploreTaskItemDataViewType } from './ExploreTaskItem'

export type ExploreTaskListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExploreTaskListItemsType = ExploreTaskItemDataViewType[]
export type ExploreTaskListProps = ExploreTaskListViewConfigType & {
  items: ExploreTaskListItemsType
}
const ExploreTaskList: React.FC<ExploreTaskListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no tasks',
}: ExploreTaskListProps) => (
  <>
    {loading && <ExploreTaskListLoading>{loadingMsg}</ExploreTaskListLoading>}
    {!loading && items.length === 0 && emptyMsg && <ExploreTaskListEmpty>{emptyMsg}</ExploreTaskListEmpty>}
    <ExploreTaskListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => <ExploreTaskItem key={`${item.data.id}`} data={item.data} viewConfig={item.viewConfig} />)}
    </ExploreTaskListWrapper>
  </>
)
export default ExploreTaskList
const ExploreTaskListWrapper = styled.div`
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
const ExploreTaskListLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ExploreTaskListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
