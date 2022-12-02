/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 19:47:57
 * @Description: file description
 */
import styled from 'styled-components';
import type {
  ProjectExploreListItemEventResponse,
  ProjectExploreListItemResponse,
} from '../../services/types/project';
import EventDetailCard from '../event/EventDetailCard';

export type ProjectDetailCardProps = {
  data: ProjectExploreListItemResponse;
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
        <LayoutHeaderTop>
          <LayoutHeaderTopLeft>
            <ProjectAvatar src={data.image} />
          </LayoutHeaderTopLeft>

          <LayoutHeaderTopRight>
            <LayoutHeaderTopRightRow>
              <ProjectName>{data.name}</ProjectName>
            </LayoutHeaderTopRightRow>
          </LayoutHeaderTopRight>
          <LayoutHeaderHandles>
            {displayFavor && (
              <ProjectHandleIconButton
                onClick={onFavor}
                disabled={disabledFavor}
              >
                {loadingFavor ? 'loading' : isFavored ? 'Favored' : 'Favor'}
              </ProjectHandleIconButton>
            )}
            {displayShare && (
              <ProjectHandleIconButton onClick={onShare}>
                Share
              </ProjectHandleIconButton>
            )}
          </LayoutHeaderHandles>
        </LayoutHeaderTop>
        <LayoutHeaderBottom>
          <PorjectDescription>{data.description}</PorjectDescription>
        </LayoutHeaderBottom>
      </LayoutHeader>
      <LayoutMain>
        {data.events.map((item) => (
          <EventCard
            key={item.id}
            data={item}
            onComplete={() => onEventComplete && onEventComplete(item)}
            displayFavor={false}
            displayShare={false}
          />
        ))}
      </LayoutMain>
    </ProjectDetailCardWrapper>
  );
}
const ProjectDetailCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: rgba(41, 41, 41, 1);
  display: flex;
  flex-direction: column;
`;
const LayoutHeader = styled.div``;
const LayoutHeaderTop = styled.div`
  display: flex;
  gap: 20px;
`;
const LayoutHeaderTopLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ProjectAvatar = styled.img`
  width: 52px;
  height: 52px;
`;

const LayoutHeaderTopRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
`;
const LayoutHeaderTopRightRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  overflow: hidden;
`;
const ProjectName = styled.span`
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
`;

const LayoutHeaderHandles = styled.div`
  overflow: hidden;
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;
const ProjectHandleIconButton = styled.button`
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.01);
  text-align: center;
  color: rgba(255, 255, 255, 1);
`;
const LayoutHeaderBottom = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
`;
const PorjectDescription = styled.div`
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
`;
const LayoutMain = styled.div`
  flex: 1;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 255, 255, 1);
  box-sizing: border-box;
  display: flex;
  gap: 20px;
  overflow-y: auto;
`;
const EventCard = styled(EventDetailCard)`
  background-color: rgba(79, 79, 79, 1);
`;
