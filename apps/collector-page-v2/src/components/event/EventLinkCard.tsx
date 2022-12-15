/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 23:13:55
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Reward } from '../../services/types/common';
import { formatDateTime } from '../../utils/time';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import CardBase from '../common/card/CardBase';
import CompleteSvg from '../common/icons/svgs/check-circle.svg';
import Tag from '../common/tag/Tag';

export type EventLinkCardData = {
  name: string;
  link: string;
  startTime: number;
  endTime: number;
  reward: Reward;
  platform?: {
    name: string;
    logo: string;
  };
};

export type EventLinkCardProps = StyledComponentPropsWithRef<'div'> & {
  data: EventLinkCardData;
  displayComplete?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
};
export default function EventLinkCard({
  data,
  displayComplete = true,
  disabledComplete,
  loadingComplete,
  isCompleted,
  onComplete,
  ...props
}: EventLinkCardProps) {
  return (
    <EventLinkCardWrapper
      onClick={() => window.open(data.link, '__blank')}
      {...props}
    >
      <LayoutLeft>
        <PlatformImg src={data.platform.logo} />
      </LayoutLeft>

      <LayoutCenter>
        <LayoutCenterRow>
          <EventName>{data.name}</EventName>
        </LayoutCenterRow>
        <LayoutCenterRow>
          <EventReward>{data.reward}</EventReward>
          <LayoutText>{formatDateTime(data.startTime)}</LayoutText>
        </LayoutCenterRow>
      </LayoutCenter>
      {displayComplete && (
        <EventHandleButton
          onClick={(e) => {
            e.stopPropagation();
            if (onComplete) onComplete();
          }}
          disabled={disabledComplete}
        >
          <EventHandleButtonIcon src={CompleteSvg} />
          <EventHandleButtonText>
            {loadingComplete ? 'loading' : isCompleted ? 'Archived' : 'Archive'}
          </EventHandleButtonText>
        </EventHandleButton>
      )}
    </EventLinkCardWrapper>
  );
}
const EventLinkCardWrapper = styled(CardBase)`
  background: #14171a;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;
const LayoutLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const PlatformImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
const LayoutCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const LayoutCenterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const EventReward = styled(Tag)``;
const EventName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const LayoutText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #718096;
`;
const EventHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const EventHandleButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const EventHandleButtonText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  white-space: nowrap;
`;
