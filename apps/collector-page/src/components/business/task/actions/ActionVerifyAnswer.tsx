/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-14 15:00:47
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper'
import IconQuestion from '../../../common/icons/IconQuestion'
import { useEffect } from 'react'
import { useState } from 'react'
import ActionIconBox from './ActionIconBox'
import ActionNameSpan from './ActionNameSpan'
import { ButtonInfo } from '../../../common/button/ButtonBase'
import InputBase from '@mui/material/InputBase'

export type ActionVerifyAnswerProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onQuestionVerifyConfirm?: (
    action: TaskActionItemDataType,
    answer: string,
    confirmCallback: (assertAnswer: boolean) => void,
  ) => void
}

const ActionVerifyAnswer: React.FC<ActionVerifyAnswerProps> = ({
  data,
  allowHandle,
  onQuestionVerifyConfirm,
}: ActionVerifyAnswerProps) => {
  const { name, progress, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const [answer, setAnswer] = useState({
    text: '',
    displayError: false,
  })
  useEffect(() => {
    setAnswer({ ...answer, displayError: false })
  }, [answer.text])
  const isDone = status === UserActionStatus.DONE
  const handleConfirmCallback = (assertAnswer: boolean) => {
    setAnswer({ ...answer, displayError: !assertAnswer })
  }
  const handleConfim = () => {
    if (onQuestionVerifyConfirm && answer.text) {
      onQuestionVerifyConfirm(data, answer.text, handleConfirmCallback)
    }
  }
  return (
    <ActionVerifyAnswerWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <TooltipWrapper title={description}>
          <IconQuestion opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name} {progress && progress != '' && <ProgressSpan>({progress})</ProgressSpan>}
        </ActionNameSpan>

        {allowHandle && !isDone && (
          <ActionFormBox>
            <AnswerInput
              placeholder="Please enter the answer"
              onChange={(e) => setAnswer({ ...answer, text: e.target.value })}
              value={answer.text}
            />
            <ConfirmBtn onClick={handleConfim}>Confirm</ConfirmBtn>
          </ActionFormBox>
        )}
        {answer.displayError && <ConfirmErrorText>Not correct answer</ConfirmErrorText>}
      </ActionContentBox>
    </ActionVerifyAnswerWrapper>
  )
}
export default ActionVerifyAnswer
const ActionVerifyAnswerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`
const ActionContentBox = styled.div`
  flex: 1;
`
const ProgressSpan = styled.span`
  color: rgba(51, 51, 51, 0.5);
`
const ActionFormBox = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-top: 6px;
  box-sizing: border-box;
`
const AnswerInput = styled(InputBase)`
  flex: 1;
  height: 100%;
  background: #f7f9f1;
  border: 2px solid #333333;
  border-radius: 10px;
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 14px;
`
const ConfirmBtn = styled(ButtonInfo)`
  height: 100%;
  background-color: #333333;
  color: #ebeee4;
  font-size: 14px;
`
const ConfirmErrorText = styled.span`
  color: #d60606;
`
