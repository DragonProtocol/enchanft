/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:24:26
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Platform } from '../../services/types/common';
import { EventExploreListItemResponse } from '../../services/types/event';
import { getChainInfo } from '../../utils/chain';
import { defaultFormatFromNow } from '../../utils/time';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import IconLike from '../common/icons/IconLike';
import CompleteSvg from '../common/icons/svgs/check-circle.svg';
import CompletedSvg from '../common/icons/svgs/checked-circle.svg';
import ShareSvg from '../common/icons/svgs/share.svg';
import EllipsisText from '../common/text/EllipsisText';
import RewardTag from './RewardTag';

export type EventExploreListItemData = EventExploreListItemResponse;
export type EventExploreItemHandles = {
  displayFavor?: boolean;
  displayComplete?: boolean;
  displayShare?: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
  onShare?: () => void;
  onFavor?: () => void;
};
export type EventExploreListItemProps = StyledComponentPropsWithRef<'div'> &
  EventExploreItemHandles & {
    data: EventExploreListItemData;
    isActive: boolean;
    displayHandles?: boolean;
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
  // const chainIconUrl = getChainInfo(data.chain)?.iconUrl;
  return (
    <EventExploreListItemWrapper
      bgc={bgc}
      isActive={isActive}
      activeColor={activeColor}
      {...props}
    >
      <ListItemInner>
        {data?.platform?.logo && <EventPlatformIcon src={data.platform.logo} />}
        <RightBox>
          <EventName row={isActive ? 999 : 2}>{data.name}</EventName>
          <CenterBox>
            <RewardTag value={data.reward} />
            {data?.endTime && (
              <EventStartTime>
                {defaultFormatFromNow(data.endTime)}
              </EventStartTime>
            )}
            {/* {chainIconUrl && <ChainIcon src={chainIconUrl} />} */}
          </CenterBox>
          {displayHandles && (
            <EventExploreListItemHandles
              displayFavor={!data?.isForU}
              displayComplete
              displayShare={!data?.isForU}
              disabledFavor={disabledFavor}
              loadingFavor={loadingFavor}
              isFavored={isFavored}
              disabledComplete={disabledComplete}
              loadingComplete={loadingComplete}
              isCompleted={isCompleted}
              onComplete={onComplete}
              onShare={onShare}
              onFavor={onFavor}
            />
          )}
        </RightBox>
      </ListItemInner>
    </EventExploreListItemWrapper>
  );
}

export type EventExploreListItemHandlesProps =
  StyledComponentPropsWithRef<'div'> & EventExploreItemHandles;
export function EventExploreListItemHandles({
  displayFavor = true,
  displayComplete = true,
  displayShare = true,
  disabledFavor,
  loadingFavor,
  isFavored,
  disabledComplete,
  loadingComplete,
  isCompleted,
  onComplete,
  onShare,
  onFavor,
  ...props
}: EventExploreListItemHandlesProps) {
  return (
    <EventHandles {...props}>
      {displayComplete && (
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
      )}

      {displayFavor && (
        <EventHandleButton onClick={onFavor} disabled={disabledFavor}>
          <EventHandleButtonLikeIcon fill={isFavored ? '#718096' : 'none'} />
        </EventHandleButton>
      )}
      {displayShare && (
        <EventHandleButton onClick={onShare}>
          <EventHandleButtonIcon src={ShareSvg} />
        </EventHandleButton>
      )}
    </EventHandles>
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
  padding: 16px;
  background: ${({ bgc }) => bgc};
  border-bottom: 1px solid #39424c;
  ${({ isActive, activeColor }) =>
    isActive &&
    `
    border-right: 4px solid  ${activeColor};
  `}
  transition: background-color 0.5s, box-shadow 0.5s;
  ${({ isActive }) =>
    !isActive &&
    `
    &:hover {
      & > * {
        transform: scale(1.05);
      }
    }
  `}
`;
const ListItemInner = styled.div`
  display: flex;
  gap: 10px;
  transition: all 0.3s;
`;
const RightBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const EventName = styled(EllipsisText)`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CenterBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const EventStartTime = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
const EventPlatformIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: auto;
`;

const EventHandles = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const EventHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const EventHandleButtonComplete = styled(EventHandleButton)`
  width: 200px;
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
