/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 13:28:58
 * @Description: file description
 */
import styled from 'styled-components';
import type {
  ProjectExploreListItemEventResponse,
  ProjectExploreListItemResponse,
} from '../../services/types/project';
import { getContentWithJsonValue } from '../../utils/content';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import ContentShower from '../contents/ContentShower';
import EventDetailView from '../event/EventDetailView';
import LikeSvg from '../common/icons/svgs/like.svg';
import ShareSvg from '../common/icons/svgs/share.svg';
import TwitterSvg from '../common/icons/svgs/twitter.svg';
import DiscordSvg from '../common/icons/svgs/discord.svg';
import CardBase from '../common/card/CardBase';

export type ProjectDetailCardProps = {
  data: ProjectExploreListItemResponse;
  completedEventIds: number[];
  displayFavor?: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  displayShare?: boolean;
  onShare?: () => void;
  onFavor?: () => void;
  onEventComplete?: (event: ProjectExploreListItemEventResponse) => void;
};
export default function ProjectDetailCard({
  data,
  completedEventIds,
  displayFavor = true,
  disabledFavor,
  loadingFavor,
  isFavored,
  displayShare = true,
  onShare,
  onFavor,
  onEventComplete,
}: ProjectDetailCardProps) {
  return (
    <ProjectDetailCardWrapper>
      <LayoutHeader>
        <LayoutHeaderLeft>
          <ProjectImg src={data.image} />
        </LayoutHeaderLeft>

        <LayoutHeaderRight>
          <LayoutHeaderRightRow>
            <ProjectName>{data.name}</ProjectName>
            <LayoutHeaderHandles>
              {displayFavor && (
                <ProjectHandleButton onClick={onFavor} disabled={disabledFavor}>
                  <ProjectHandleButtonIcon src={LikeSvg} />
                  {/* {loadingFavor ? 'loading' : isFavored ? 'Favored' : 'Favor'} */}
                </ProjectHandleButton>
              )}
              {displayShare && (
                <ProjectHandleButton onClick={onShare}>
                  <ProjectHandleButtonIcon src={ShareSvg} />
                </ProjectHandleButton>
              )}
            </LayoutHeaderHandles>
          </LayoutHeaderRightRow>
          <LayoutHeaderRightRow>
            <LinkButton>
              <LinkIcon src={TwitterSvg} />
            </LinkButton>
            <LinkButton>
              <LinkIcon src={DiscordSvg} />
            </LinkButton>
          </LayoutHeaderRightRow>
          <LayoutHeaderRightRow>
            <PorjectDescription>{data.description}</PorjectDescription>
          </LayoutHeaderRightRow>
        </LayoutHeaderRight>
      </LayoutHeader>
      <LayoutMain>
        {data.events &&
          data.events.map((item) => (
            <CardBox key={item.id}>
              <EventCard
                data={item}
                onComplete={() => onEventComplete && onEventComplete(item)}
                displayFavor={false}
                displayShare={false}
                disabledComplete={completedEventIds.includes(item.id)}
                isCompleted={completedEventIds.includes(item.id)}
              />
            </CardBox>
          ))}
        {data.contents &&
          data.contents.map((item) => (
            <CardBox key={item.id}>
              <ContentCard
                {...item}
                content={getContentWithJsonValue(item.value)}
                voteAction={() => alert('在此页面，此按钮后期会隐藏')}
                favorsActions={() => alert('在此页面，此按钮后期会隐藏')}
                hiddenAction={() => alert('在此页面，此按钮后期会隐藏')}
              />
            </CardBox>
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
const ProjectImg = styled.img`
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

const LayoutHeaderHandles = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;
const ProjectHandleButton = styled(ButtonPrimaryLine)`
  width: 44px;
  height: 32px;
  padding: 6px 12px;
`;
const ProjectHandleButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const LinkButton = styled.button`
  padding: 10px;
  width: 40px;
  height: 40px;
  background: #14171a;
  border-radius: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
`;
const LinkIcon = styled.img`
  width: 24px;
  height: 24px;
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
const CardBox = styled(CardBase)`
  background: #14171a;
`;
const EventCard = styled(EventDetailView)`
  min-height: 50vh;
`;
const ContentCard = styled(ContentShower)`
  min-height: 50vh;
`;
