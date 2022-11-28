/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-05 11:22:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 17:02:57
 * @Description: file description
 */
import { UserAvatar } from '@ecnft/wl-user-react';
import React from 'react';
import styled from 'styled-components';
import { formatNumberToUnitString } from '../../../utils/number';

export type TaskDetailParticipantsDataViewType = {
  items: Array<{
    name: string;
    avatar: string;
    pubkey: string;
    id: number;
  }>;
  takers: number;
  finishers: number;
};

export type TaskDetailParticipantsProps = TaskDetailParticipantsDataViewType;

const TaskDetailParticipants: React.FC<TaskDetailParticipantsProps> = ({
  items,
  takers,
  finishers,
}: TaskDetailParticipantsProps) => {
  const takersText = formatNumberToUnitString(takers);
  // const finishersText = formatNumberToUnitString(finishers)
  return (
    <TaskDetailParticipantsWrapper>
      <ParticipantsHeader>
        <ParticipantsTitle>Participants</ParticipantsTitle>
        <ParticipantsNumText>
          {/* {finishersText}/{takersText} compteted */}
          {takersText} applied
        </ParticipantsNumText>
      </ParticipantsHeader>
      <ParticipantsListBox>
        {items.map((item, index) => (
          <AvatarItem key={index} title={item.name} user={item} />
        ))}
      </ParticipantsListBox>
    </TaskDetailParticipantsWrapper>
  );
};
export default TaskDetailParticipants;
const TaskDetailParticipantsWrapper = styled.div`
  width: 100%;
`;
const ParticipantsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ParticipantsTitle = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`;
const ParticipantsNumText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: rgba(51, 51, 51, 0.6);
`;
const ParticipantsListBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;
const AvatarItem = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`;
