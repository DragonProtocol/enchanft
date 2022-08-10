/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-20 18:19:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-10 15:58:47
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import ButtonBase from '../../common/button/ButtonBase'
import Loading from '../../common/loading/Loading'
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
    {loading && (
      <ListStatusBox>
        <Loading />
      </ListStatusBox>
    )}
    {!loading && items.length === 0 && emptyMsg && <ListStatusBox>{emptyMsg}</ListStatusBox>}
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
  display: grid;
  grid-gap: 20px;
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
const ListStatusBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ExploreTaskItemBox = styled.div`
  // 为了显现出阴影，grid布局会不留空隙，需为子项预留box-shadow的空间
  padding-bottom: 4px;
  /* 鼠标移入整体上移2px */
  &:hover {
    transform: translateY(-4px);
  }
  /* 鼠标点击整体缩小2% */
  &:active {
    transform: scale(0.98);
  }
  transition: all 0.5s ease-out;
`
const CreateTaskButton = styled(ButtonBase)`
  box-shadow: none;
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
