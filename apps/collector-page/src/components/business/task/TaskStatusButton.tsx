import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from '../../common/button/ButtonBase'

export type TaskStatusButtonDataType = {}

export enum TaskStatusButtonType {
  CONNECT_WALLET = 'CONNECT_WALLET',
  BIND_WALLET = 'BIND_WALLET',
  TAKE = 'TAKE',
  TODO = 'TODO',
  COMPLETE = 'COMPLETE',
}
const buttonTextMap = {
  [TaskStatusButtonType.CONNECT_WALLET]: 'Connect Wallet',
  [TaskStatusButtonType.BIND_WALLET]: 'Bind Wallet',
  [TaskStatusButtonType.TAKE]: 'Take The Task',
  [TaskStatusButtonType.TODO]: 'Already Accepted',
  [TaskStatusButtonType.COMPLETE]: 'Completed!',
}
export type TaskStatusButtonDataViewType = {
  type: TaskStatusButtonType
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  btnText?: string
}

export type TaskStatusButtonProps = TaskStatusButtonDataViewType & {
  onConnectWallet?: () => void
  onBindWallet?: () => void
  onTake?: () => void
}

const TaskStatusButton: React.FC<TaskStatusButtonProps> = ({
  type,
  loading = false,
  loadingText = 'loading ...',
  disabled = false,
  btnText,
  onConnectWallet,
  onBindWallet,
  onTake,
}: TaskStatusButtonProps) => {
  const _btnText = btnText || buttonTextMap[type]
  const isCompleteStatusBtn = [TaskStatusButtonType.TODO, TaskStatusButtonType.COMPLETE].includes(type)
  const handleTake = () => {
    if (onTake) {
      onTake()
    }
  }
  const handleWalletBind = () => {
    if (onBindWallet) {
      onBindWallet()
    }
  }
  const handleConnectWallet = () => {
    if (onConnectWallet) {
      onConnectWallet()
    }
  }
  const handleClick = useCallback(() => {
    switch (type) {
      case TaskStatusButtonType.TAKE:
        handleTake()
        break
      case TaskStatusButtonType.BIND_WALLET:
        handleWalletBind()
        break
      case TaskStatusButtonType.CONNECT_WALLET:
        handleConnectWallet()
        break
      default:
        break
    }
  }, [type])
  return (
    <TaskStatusButtonWrapper>
      {isCompleteStatusBtn ? (
        <TaskCompleteStatusBtn>{btnText}</TaskCompleteStatusBtn>
      ) : (
        <TaskBtn onClick={handleClick} disabled={disabled}>
          {loading ? loadingText : _btnText}
        </TaskBtn>
      )}
    </TaskStatusButtonWrapper>
  )
}
export default TaskStatusButton
const TaskStatusButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const TaskBtn = styled(ButtonPrimary)`
  width: 100%;
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
`

const TaskCompleteStatusBtn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
  height: 48px;
  background: #f8f8f8;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
