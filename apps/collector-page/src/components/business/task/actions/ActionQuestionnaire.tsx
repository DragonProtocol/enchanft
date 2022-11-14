/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-14 16:01:13
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
export type ActionQuestionnaireProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onQuestionConfirm?: (action: TaskActionItemDataType, answer: string) => void
}

const ActionQuestionnaire: React.FC<ActionQuestionnaireProps> = ({
  data,
  allowHandle,
  onQuestionConfirm,
}: ActionQuestionnaireProps) => {
  const { name, progress, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const [answer, setAnswer] = useState(actionData?.answer)
  const isDone = status === UserActionStatus.DONE
  const handleConfim = () => {
    if (onQuestionConfirm && answer) {
      onQuestionConfirm(data, answer)
    }
  }
  const displayConfim =
    allowHandle && !isDone && (!actionData?.answer || (!!actionData?.answer && !!actionData?.nopassReason))
  const isWaitReview = !!actionData?.answer && !!actionData?.nopassReason
  return (
    <ActionQuestionnaireWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <TooltipWrapper title={description}>
          <IconQuestion opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name} {progress && progress != '' && <ProgressSpan>({progress})</ProgressSpan>}
        </ActionNameSpan>
        {allowHandle && !isDone ? (
          <>
            {isWaitReview ? (
              <>
                <ConfirmAnswerText>{actionData?.answer}</ConfirmAnswerText>
                <ConfirmErrorText>Wait for review</ConfirmErrorText>
              </>
            ) : (
              <>
                <ActionFormBox>
                  <AnswerInput
                    placeholder="Please enter the answer"
                    onChange={(e) => setAnswer(e.target.value)}
                    value={answer}
                  />
                  <ConfirmBtn onClick={handleConfim}>Confirm</ConfirmBtn>
                </ActionFormBox>
                <ConfirmErrorText>{actionData?.nopassReason}</ConfirmErrorText>
              </>
            )}
          </>
        ) : (
          <ConfirmAnswerText>{actionData?.answer}</ConfirmAnswerText>
        )}
      </ActionContentBox>
    </ActionQuestionnaireWrapper>
  )
}
export default ActionQuestionnaire
const ActionQuestionnaireWrapper = styled.div`
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
const ConfirmAnswerText = styled.p`
  color: rgba(51, 51, 51, 0.5);
  margin: 0;
`
const ConfirmErrorText = styled.p`
  color: #d60606;
  margin: 0;
`
