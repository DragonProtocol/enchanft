/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 14:36:47
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Platform } from '../../services/types/common';
import { EventExploreListItemResponse } from '../../services/types/event';
import { getChainInfo } from '../../utils/chain';
import { formatDateTime } from '../../utils/time';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import IconLike from '../common/icons/IconLike';
import CompleteSvg from '../common/icons/svgs/check-circle.svg';
import CompletedSvg from '../common/icons/svgs/checked-circle.svg';
import ShareSvg from '../common/icons/svgs/share.svg';
import RewardTag from './RewardTag';

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
export const defaultStyle = {
  bgc: 'rgba(16, 16, 20, 0.1)',
  activeColor: '#FFFFFF',
};
export const styleMaps = {
  [Platform.GALXE]: {
    bgc: '#14171a',
    activeColor: '#FFFFFF',
  },
  [Platform.NOOX]: {
    bgc: 'rgba(56, 3, 168, 0.1)',
    activeColor: '#3803A8',
  },
  [Platform.POAP]: {
    bgc: 'rgba(148, 86, 209, 0.1)',
    activeColor: '#9456D1',
  },
  [Platform.QUEST3]: {
    bgc: 'rgba(203, 255, 4, 0.1)',
    activeColor: '#CBFF04',
  },
  [Platform.RABBIT_HOLE]: {
    bgc: 'rgba(160, 247, 189, 0.1)',
    activeColor: '#A0F7BD',
  },
  [Platform.LINK3]: {
    bgc: 'rgba(28, 91, 245, 0.1)',
    activeColor: '#1C5BF5',
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
  let style = defaultStyle;
  if (isActive && data?.platform?.name) {
    style = styleMaps[data.platform.name] || defaultStyle;
  }
  const { bgc, activeColor } = style;
  return (
    <EventExploreListItemWrapper
      bgc={bgc}
      isActive={isActive}
      activeColor={activeColor}
      {...props}
    >
      <TopBox>
        <ChainIcon src={getChainInfo(data.chain)?.iconUrl} />
        <EventName>{data.name}</EventName>
      </TopBox>

      <CenterBox>
        <RewardTag value={data.reward} />
        {data?.startTime && (
          <EventStartTime>{formatDateTime(data.startTime)}</EventStartTime>
        )}
        {data?.platform?.logo && <EventPlatformIcon src={data.platform.logo} />}
      </CenterBox>
      {displayHandles && (
        <EventHandles>
          <EventHandleButtonComplete
            onClick={onComplete}
            disabled={disabledComplete}
          >
            <EventHandleButtonIcon
              src={isCompleted ? CompletedSvg : CompleteSvg}
            />
            <EventHandleButtonText>
              {loadingComplete
                ? 'loading'
                : isCompleted
                ? 'Completed'
                : 'Mark as Complete'}
            </EventHandleButtonText>
          </EventHandleButtonComplete>
          <EventHandleButton onClick={onFavor} disabled={disabledFavor}>
            <EventHandleButtonLikeIcon fill={isFavored ? '#718096' : 'none'} />
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
  cursor: pointer;

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
  transition: background-color 0.5s, box-shadow 0.5s;
`;
const TopBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const EventName = styled.div`
  flex: 1;
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
const EventStartTime = styled.span`
  width: 0;
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
const EventPlatformIcon = styled.img`
  width: 24px;
  height: 24px;
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
const EventHandleButtonLikeIcon = styled(IconLike)`
  width: 20px;
  height: 20px;
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
