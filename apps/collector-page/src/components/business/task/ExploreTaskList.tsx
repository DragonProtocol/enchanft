/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-20 18:19:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 19:23:59
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import ButtonBase from '../../common/button/ButtonBase'
import Loading from '../../common/loading/Loading'
import IconPlus from '../../common/icons/IconPlus'
import ExploreTaskItem, { ExploreTaskItemDataViewType } from './ExploreTaskItem'
import CardItemBox from '../../common/card/CardItemBox'

export type ExploreTaskListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  displayCreateTask?: boolean
  maxColumns?: number
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
  maxColumns = 4,
  onCreateTask,
}: ExploreTaskListProps) => (
  <>
    {loading && (
      <ListStatusBox>
        <Loading />
      </ListStatusBox>
    )}
    {!loading && items.length === 0 && emptyMsg && <ListStatusBox>{emptyMsg}</ListStatusBox>}
    <ExploreTaskListWrapper maxColumns={maxColumns}>
      {displayCreateTask && (
        <ExploreTaskItemBox>
          <CreateTaskButton onClick={() => onCreateTask && onCreateTask()}>
            <IconPlus size="2rem" />
            <span>Create</span>
          </CreateTaskButton>
        </ExploreTaskItemBox>
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
const ExploreTaskListWrapper = styled.div<{ maxColumns?: number }>`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(${({ maxColumns = 4 }) => maxColumns}, minmax(220px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(${({ maxColumns = 4 }) => maxColumns - 1}, minmax(220px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(${({ maxColumns = 4 }) => maxColumns - 2}, minmax(220px, 1fr));
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
  /* 鼠标移入整体上移2px */
  &:hover {
    transform: translateY(-4px);
  }
  /* 鼠标点击整体缩小2% */
  &:active {
    transform: scale(0.98);
  }
  transition: all 0.5s ease-out;
  cursor: pointer;
`
const CreateTaskButton = styled(CardItemBox)`
  height: 250px;
  background: #ebeee4;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;

  span {
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    color: #333333;
  }
`
