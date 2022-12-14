/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 09:42:20
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import type { EventExploreListItemResponse } from '../../services/types/event';
import { formatDateTime } from '../../utils/time';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';
import CompleteSvg from '../common/icons/svgs/check-circle.svg';
import LikeSvg from '../common/icons/svgs/like.svg';
import ShareSvg from '../common/icons/svgs/share.svg';
import Tag from '../common/tag/Tag';

export type EventDetailCardData = Omit<
  EventExploreListItemResponse,
  'project' | 'id'
> &
  Partial<Pick<EventExploreListItemResponse, 'project' | 'id'>>;

export type EventDetailCardProps = StyledComponentPropsWithRef<'div'> & {
  data: EventDetailCardData;
  displayFavor?: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  displayComplete?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  displayShare?: boolean;
  onComplete?: () => void;
  onShare?: () => void;
  onFavor?: () => void;
};
export default function EventDetailCard({
  data,
  displayFavor = true,
  disabledFavor,
  loadingFavor,
  isFavored,
  displayComplete = true,
  disabledComplete,
  loadingComplete,
  isCompleted,
  displayShare = true,
  onComplete,
  onShare,
  onFavor,
  ...props
}: EventDetailCardProps) {
  return (
    <EventDetailCardWrapper {...props}>
      <EventHeader>
        <EventHeaderLeft>
          <PlatformImg src={data.platform.logo} />
        </EventHeaderLeft>

        <EventHeaderCenter>
          <EventHeaderCenterRow>
            <EventName>{data.name}</EventName>
          </EventHeaderCenterRow>
          <EventHeaderCenterRow>
            <EventReward>{data.reward}</EventReward>
            <EventHeaderText>{formatDateTime(data.startTime)}</EventHeaderText>
          </EventHeaderCenterRow>
        </EventHeaderCenter>
        <EventHeaderHandles>
          {displayComplete && (
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
          )}
          {displayFavor && (
            <EventHandleButton onClick={onFavor} disabled={disabledFavor}>
              <EventHandleButtonIcon src={LikeSvg} />
              <EventHandleButtonText>
                {loadingFavor ? 'loading' : isFavored ? 'Favored' : 'Favor'}
              </EventHandleButtonText>
            </EventHandleButton>
          )}
          {displayShare && (
            <EventHandleButton onClick={onShare}>
              <EventHandleButtonIcon src={ShareSvg} />
            </EventHandleButton>
          )}
        </EventHeaderHandles>
      </EventHeader>
      {/* <EventContent>
        {data.supportIframe ? (
          <EventIframe src={data.link} />
        ) : (
          <CannotOpenPlatFormLink
            iconUrl={data.platform.logo}
            linkUrl={data.link}
          />
        )}
      </EventContent> */}
    </EventDetailCardWrapper>
  );
}
const EventDetailCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const EventHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const EventHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const PlatformImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
const EventHeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const EventHeaderCenterRow = styled.div`
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

const EventHeaderText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #718096;
`;
const EventHeaderHandles = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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

const EventContent = styled.div`
  height: 100%;
  flex: 1;
  width: 100%;
  background: #1b1e23;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 10px;
`;
const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  overflow: 'visible';
  border: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;
