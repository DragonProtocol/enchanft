/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 12:27:51
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Platform } from '../../services/types/common';
import { EventExploreListItemResponse } from '../../services/types/event';
import { formatDateTime } from '../../utils/time';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import CompleteSvg from '../common/icons/svgs/check-circle.svg';
import LikeSvg from '../common/icons/svgs/like.svg';
import ShareSvg from '../common/icons/svgs/share.svg';
import Tag from '../common/tag/Tag';

export type EventExploreListItemData = EventExploreListItemResponse & {
  isDaylight?: boolean;
};
export type EventExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: EventExploreListItemData;
  isActive: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  displayHandles?: boolean;
  onComplete?: () => void;
  onShare?: () => void;
  onFavor?: () => void;
};
const styleMaps = {
  [Platform.GALXE]: {
    bgc: 'none',
    activeColor: '#7854F7',
  },
  [Platform.NOOX]: {
    bgc: 'none',
    activeColor: '#7854F7',
  },
  [Platform.POAP]: {
    bgc: 'none',
    activeColor: '#7854F7',
  },
  [Platform.QUEST3]: {
    bgc: 'none',
    activeColor: '#7854F7',
  },
};
export default function EventExploreListItem({
  data,
  isActive,
  disabledFavor,
  loadingFavor,
  isFavored,
  disabledComplete,
  loadingComplete,
  isCompleted,
  displayHandles = true,
  onComplete,
  onShare,
  onFavor,
  ...props
}: EventExploreListItemProps) {
  // TODO 后期冲data.platform.?中获取
  const bgc = styleMaps[Platform.GALXE]?.bgc || 'none';
  const activeColor = styleMaps[Platform.GALXE]?.activeColor || 'none';
  return (
    <EventExploreListItemWrapper
      bgc={bgc}
      isActive={isActive}
      activeColor={activeColor}
      {...props}
    >
      <EventName>{data.name}</EventName>
      <CenterBox>
        <EventReward>{data.reward}</EventReward>
        <EventStartTime>{formatDateTime(data.startTime)}</EventStartTime>
        {data.platform && <EventPlatformIcon src={data.platform.logo} />}
      </CenterBox>
      {displayHandles && (
        <EventHandles>
          <EventHandleButtonComplete
            onClick={onComplete}
            disabled={disabledComplete}
          >
            <EventHandleButtonIcon src={CompleteSvg} />
            <EventHandleButtonText>
              {loadingComplete
                ? 'loading'
                : isCompleted
                ? 'Completed'
                : 'Mark as complate'}
            </EventHandleButtonText>
          </EventHandleButtonComplete>
          <EventHandleButton onClick={onFavor} disabled={disabledFavor}>
            <EventHandleButtonIcon src={LikeSvg} />
            <EventHandleButtonText>
              {loadingFavor ? 'loading' : isFavored ? 'Favored' : 'Favor'}
            </EventHandleButtonText>
          </EventHandleButton>
          <EventHandleButton onClick={onShare}>
            <EventHandleButtonIcon src={ShareSvg} />
          </EventHandleButton>
        </EventHandles>
      )}
    </EventExploreListItemWrapper>
  );
}
const EventExploreListItemWrapper = styled.div<{
  bgc: string;
  isActive: boolean;
  activeColor: string;
}>`
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 10px;

  background: ${({ bgc }) => bgc};
  border-bottom: 1px solid #39424c;
  ${({ isActive, activeColor }) =>
    isActive &&
    `
    box-shadow: inset -4px 0px 0px ${activeColor};
  `}
`;
const EventName = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CenterBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EventReward = styled(Tag)``;
const EventStartTime = styled.span`
  width: 0;
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
const EventPlatformIcon = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const EventHandles = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const EventHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const EventHandleButtonComplete = styled(EventHandleButton)`
  flex: 1;
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
