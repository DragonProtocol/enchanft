/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-05 11:22:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-05 13:23:48
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { formatNumberToUnitString } from '../../../utils/number'
import UserAvatar from '../user/UserAvatar'
export type TaskDetailParticipantsDataType = {
  userDetails: Array<{
    name: string
    avatar: string
  }>
  takers: number
  finishers: number
}

export type TaskDetailParticipantsDataViewType = {
  data: TaskDetailParticipantsDataType
}

export type TaskDetailParticipantsProps = TaskDetailParticipantsDataViewType

const TaskDetailParticipants: React.FC<TaskDetailParticipantsProps> = ({ data }: TaskDetailParticipantsProps) => {
  const { userDetails, takers, finishers } = data
  const takersText = formatNumberToUnitString(takers)
  const finishersText = formatNumberToUnitString(finishers)
  return (
    <TaskDetailParticipantsWrapper>
      <ParticipantsHeader>
        <ParticipantsTitle>Participants</ParticipantsTitle>
        <ParticipantsNumText>
          {finishersText}/{takersText} compteted
        </ParticipantsNumText>
      </ParticipantsHeader>
      <ParticipantsListBox>
        {userDetails.map((item, index) => (
          <AvatarItem src={item.avatar} key={index} title={item.name} />
        ))}
      </ParticipantsListBox>
    </TaskDetailParticipantsWrapper>
  )
}
export default TaskDetailParticipants
const TaskDetailParticipantsWrapper = styled.div`
  width: 100%;
`
const ParticipantsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ParticipantsTitle = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`
const ParticipantsNumText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: rgba(51, 51, 51, 0.6);
`
const ParticipantsListBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`
const AvatarItem = styled(UserAvatar)`
  width: 60px;
  height: 60px;
`
