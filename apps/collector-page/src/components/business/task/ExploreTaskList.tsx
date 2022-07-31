/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-20 18:19:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 18:27:40
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import ButtonBase from '../../common/button/ButtonBase'
import ExploreTaskItem, { ExploreTaskItemDataViewType } from './ExploreTaskItem'

export type ExploreTaskListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  displayCreateTask?: boolean
}
export type ExploreTaskListItemsType = ExploreTaskItemDataViewType[]
export type ExploreTaskListProps = ExploreTaskListViewConfigType & {
  items: ExploreTaskListItemsType
  onCreateTask?: () => void
}
const ExploreTaskList: React.FC<ExploreTaskListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no tasks',
  displayCreateTask,
  onCreateTask,
}: ExploreTaskListProps) => (
  <>
    {loading && <ExploreTaskListLoading>{loadingMsg}</ExploreTaskListLoading>}
    {!loading && items.length === 0 && emptyMsg && <ExploreTaskListEmpty>{emptyMsg}</ExploreTaskListEmpty>}
    <ExploreTaskListWrapper>
      {displayCreateTask && (
        <CreateTaskButton onClick={() => onCreateTask && onCreateTask()}>
          <span>+</span>
          <span>Create</span>
        </CreateTaskButton>
      )}
      {!loading &&
        items.length > 0 &&
        items.map((item) => (
          <ExploreTaskItemBox key={`${item.data.id}`}>
            <ExploreTaskItem data={item.data} viewConfig={item.viewConfig} />
          </ExploreTaskItemBox>
        ))}
    </ExploreTaskListWrapper>
  </>
)
export default ExploreTaskList
const ExploreTaskListWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  grid-gap: 20px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(4, minmax(265px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(3, minmax(265px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(2, minmax(265px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }
`
const ExploreTaskItemBox = styled.div`
  // 为了显现出阴影，grid布局会不留空隙，需为子项预留box-shadow的空间
  padding-bottom: 4px;
`
const CreateTaskButton = styled(ButtonBase)`
  width: 265px;
  height: 243px;
  background: #f8f8f8;
  border: 2px solid #333333;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-align: center;
  color: #333333;
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
