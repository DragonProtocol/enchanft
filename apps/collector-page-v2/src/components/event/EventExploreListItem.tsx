/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 12:59:23
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { EventExploreListItemResponse } from '../../services/types/event';
import { formatDateTime } from '../../utils/time';

export type EventExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: EventExploreListItemResponse;
  isActive: boolean;
};
export default function EventExploreListItem({
  data,
  isActive,
  ...props
}: EventExploreListItemProps) {
  return (
    <EventExploreListItemWrapper {...props}>
      <LayoutLeft>
        <EventName>{data.name}</EventName>
        <LayoutLeftBottom>
          <EventReward>{data.reward}</EventReward>
          <EventStartTime>{formatDateTime(data.startTime)}</EventStartTime>
        </LayoutLeftBottom>
      </LayoutLeft>
      {data.project && (
        <LayoutRight>
          <EventPlatformIcon src={data.project.image} />
        </LayoutRight>
      )}
    </EventExploreListItemWrapper>
  );
}
const EventExploreListItemWrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  background: rgba(64, 149, 229, 1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const LayoutLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const LayoutRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EventName = styled.div`
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  text-transform: uppercase;
  overflow: hidden;
`;
const LayoutLeftBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const EventReward = styled.div`
  width: 80px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(89, 27, 183, 1);
  color: rgba(184, 134, 248, 1);
  font-size: 14px;
  text-align: center;
  line-height: 22px;
`;
const EventStartTime = styled.span`
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
`;
const EventPlatformIcon = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;
