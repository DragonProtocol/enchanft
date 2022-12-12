/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-09 18:31:27
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import type { EventExploreListItemResponse } from '../../services/types/event';
import { formatDateTime } from '../../utils/time';

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
          <EventAvatar src={data.platform.logo} />
        </EventHeaderLeft>

        <EventHeaderCenter>
          <EventHeaderCenterRow>
            <EventReward>{data.reward}</EventReward>
            <EventName>{data.name}</EventName>
          </EventHeaderCenterRow>
          <EventHeaderCenterRow>
            {!!data.project && (
              <>
                <EventPlatformIcon src={data.project.image} />
                <EventHeaderText>{data.project.name}</EventHeaderText>
              </>
            )}
            <EventHeaderText>{formatDateTime(data.startTime)}</EventHeaderText>
          </EventHeaderCenterRow>
        </EventHeaderCenter>
        <EventHeaderHandles>
          {displayComplete && (
            <EventHandleIconButton
              onClick={onComplete}
              disabled={disabledComplete}
            >
              {loadingComplete
                ? 'loading'
                : isCompleted
                ? 'Completed'
                : 'Mark as complate'}
            </EventHandleIconButton>
          )}
          {displayFavor && (
            <EventHandleIconButton onClick={onFavor} disabled={disabledFavor}>
              {loadingFavor ? 'loading' : isFavored ? 'Favored' : 'Favor'}
            </EventHandleIconButton>
          )}
          {displayShare && (
            <EventHandleIconButton onClick={onShare}>
              Share
            </EventHandleIconButton>
          )}
        </EventHeaderHandles>
      </EventHeader>
      {data.supportIframe ? (
        <EventIframe src={data.link} />
      ) : (
        <EventPreview>
          <EventDescription>{data.description}</EventDescription>
          {data.image && <EventImage src={data.image} />}
        </EventPreview>
      )}

      <EventLinkHandles>
        <EventLinkHandleButton onClick={() => window.open(data.link, '_blank')}>
          newtab
        </EventLinkHandleButton>
        <EventLinkHandleButton onClick={() => alert('add extension')}>
          add extension
        </EventLinkHandleButton>
      </EventLinkHandles>
    </EventDetailCardWrapper>
  );
}
const EventDetailCardWrapper = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: rgba(41, 41, 41, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const EventHeader = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(255, 255, 255, 1);
`;
const EventHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const EventAvatar = styled.img`
  width: 52px;
  height: 52px;
`;
const EventHeaderCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
`;
const EventHeaderCenterRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  overflow: hidden;
`;
const EventReward = styled.div`
  width: 80px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(89, 27, 183, 1);
  color: rgba(184, 134, 248, 1);
  font-size: 14px;
  text-align: center;
`;
const EventName = styled.span`
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
`;
const EventPlatformIcon = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;
const EventHeaderText = styled.span`
  color: rgba(187, 187, 187, 1);
  font-size: 18px;
`;
const EventHeaderHandles = styled.div`
  overflow: hidden;
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;
const EventHandleIconButton = styled.button`
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.01);
  text-align: center;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
`;
const EventIframe = styled.iframe`
  flex: 1;
  width: 100%;
  border: none;
`;
const EventPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20;
`;
const EventDescription = styled.div`
  font-size: 18px;
`;
const EventImage = styled.img`
  width: 100%;
  object-fit: cover;
`;
const EventLinkHandles = styled.div`
  display: flex;
  gap: 20px;
`;
const EventLinkHandleButton = styled.button``;
