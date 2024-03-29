/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:44:38
 * @Description: file description
 */
import styled from 'styled-components';
import { useCallback } from 'react';
import type { ProjectExploreListItemResponse } from '../../services/types/project';
import EventLinkCard from '../event/EventLinkCard';
import TwitterSvg from '../common/icons/svgs/twitter.svg';
import DiscordSvg from '../common/icons/svgs/discord.svg';
import ContentLinkCard from '../contents/ContentLinkCard';
import ProjectImgDefault from './ProjectImgDefault';
import { ContentListItem } from '../../services/types/contents';
import { EventExploreListItemResponse } from '../../services/types/event';

export type ProjectDetailCardProps = {
  data: ProjectExploreListItemResponse;
  eventCompletedIds?: Array<number | string>;
  eventCompleteQueueIds: Array<number | string>;
  onEventComplete?: (event: EventExploreListItemResponse) => void;
  contentVotedIds?: Array<number | string>;
  onContentVote: (content: ContentListItem) => void;
};
export default function ProjectDetailCard({
  data,
  eventCompletedIds = [],
  eventCompleteQueueIds,
  onEventComplete,
  contentVotedIds = [],
  onContentVote,
}: ProjectDetailCardProps) {
  const isCompletedEvent = useCallback(
    (item: EventExploreListItemResponse) =>
      item.completed || eventCompletedIds.includes(item.id),
    [eventCompletedIds]
  );
  const loadingComplete = useCallback(
    (id: number | string) => eventCompleteQueueIds.includes(id),
    [eventCompleteQueueIds]
  );
  const isVotedContent = useCallback(
    (item: ContentListItem) =>
      item.upVoted || contentVotedIds.includes(item.id),
    [contentVotedIds]
  );
  return (
    <ProjectDetailCardWrapper>
      <LayoutHeader>
        <LayoutHeaderLeft>
          <ProjectImg src={data.image} />
        </LayoutHeaderLeft>

        <LayoutHeaderRight>
          <LayoutHeaderRightRow>
            <ProjectName>{data.name}</ProjectName>
          </LayoutHeaderRightRow>
          {/* <LayoutHeaderRightRow>
            <LinkButton>
              <LinkIcon src={TwitterSvg} />
            </LinkButton>
            <LinkButton>
              <LinkIcon src={DiscordSvg} />
            </LinkButton>
          </LayoutHeaderRightRow> */}
          <LayoutHeaderRightRow>
            <PorjectDescription>{data.description}</PorjectDescription>
          </LayoutHeaderRightRow>
        </LayoutHeaderRight>
      </LayoutHeader>
      <LayoutMain>
        {data.events &&
          data.events.map((item) => (
            <EventLinkCard
              key={item.id}
              data={item}
              onComplete={() => onEventComplete && onEventComplete(item)}
              disabledComplete={isCompletedEvent(item)}
              isCompleted={isCompletedEvent(item)}
              loadingComplete={loadingComplete(item.id)}
            />
          ))}
        {data.contents &&
          data.contents.map((item) => (
            <ContentLinkCard
              key={item.id}
              data={item}
              onVote={() => onContentVote(item)}
              disabledVote={isVotedContent(item)}
            />
          ))}
      </LayoutMain>
    </ProjectDetailCardWrapper>
  );
}
const ProjectDetailCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
const LayoutHeader = styled.div`
  display: flex;
  gap: 20px;
`;
const LayoutHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ProjectImg = styled(ProjectImgDefault)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const LayoutHeaderRight = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const LayoutHeaderRightRow = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ProjectName = styled.span`
  width: 0;
  flex: 1;
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
`;

const PorjectDescription = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
  opacity: 0.8;
`;
const LayoutMain = styled.div`
  height: 0;
  flex: 1;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
