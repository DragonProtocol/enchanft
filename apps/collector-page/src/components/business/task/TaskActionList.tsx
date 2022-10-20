/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-17 14:25:55
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import Loading from '../../common/loading/Loading'

import TaskActionItem, {
  TaskActionItemDataType,
  TaskActionItemStaticAttrGetters,
  TaskActionItemStaticFuncGetters,
} from './TaskActionItem'
export type TaskActionListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  displayVerify?: boolean
  disabledVerify?: boolean
  loadingVerify?: boolean
  loadingVerifyMsg?: string
  verifyingActions?: number[]
  verifyBgc?: string
}
export type TaskActionItemsType = TaskActionItemDataType[]
export type TaskActionsListHandlesType = TaskActionItemStaticFuncGetters & {
  onVerifyActions?: () => void
}
export type TaskActionListProps = TaskActionListViewConfigType &
  TaskActionItemStaticAttrGetters &
  TaskActionsListHandlesType & {
    items: TaskActionItemsType
  }
const TaskActionList: React.FC<TaskActionListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  onVerifyActions,
  displayVerify,
  disabledVerify,
  loadingVerify,
  loadingVerifyMsg = 'verifying...',
  verifyingActions = [],
  verifyBgc,
  ...taskActionItemStaticProps
}: TaskActionListProps) => {
  const itemLen = items.length
  const onVerifyActionsClick = () => {
    if (onVerifyActions) {
      onVerifyActions()
    }
  }
  const verifyText = loadingVerify ? loadingVerifyMsg : 'Verify & Apply for WL'
  return (
    <TaskActionListWrapper>
      {loading ? (
        <TaskActionListLoading>
          <Loading />
        </TaskActionListLoading>
      ) : (
        <>
          {displayVerify && (
            <VerifyBtn onClick={onVerifyActionsClick} disabled={disabledVerify} bgc={verifyBgc}>
              {verifyText}
            </VerifyBtn>
          )}
          {items.map((item) => (
            <TaskActionItem
              key={item.id}
              data={item}
              verifying={verifyingActions.includes(item.id)}
              {...taskActionItemStaticProps}
            />
          ))}
        </>
      )}

      {!loading && itemLen === 0 && emptyMsg && <TaskActionListEmpty>{emptyMsg}</TaskActionListEmpty>}
    </TaskActionListWrapper>
  )
}
export default TaskActionList
const TaskActionListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`
const TaskActionListLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TaskActionListEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
const VerifyBtn = styled(ButtonBase)<{ bgc?: string }>`
  width: 100%;
  height: 40px;
  background: ${({ bgc }) => bgc || '#f8f8f8'};
  box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #3dd606;
`
