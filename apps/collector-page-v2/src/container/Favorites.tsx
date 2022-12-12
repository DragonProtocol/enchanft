/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 12:07:13
 * @Description: 首页任务看板
 */
import { useState } from 'react';
import styled from 'styled-components';
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup';
import ContentList from '../components/contents/ContentList';
import EventExploreList from '../components/event/EventExploreList';
import { MainWrapper } from '../components/layout/Index';
import ProjectExploreList from '../components/project/ProjectExploreList';
import {
  ContentsEntityItem,
  EventsEntityItem,
  ProjectsEntityItem,
} from '../features/favorite/userGroupFavorites';
import useContentHidden from '../hooks/useContentHidden';
import useUserFavorites from '../hooks/useUserFavorites';
import Content from './Content';
import Event from './Event';
import Project from './Project';

enum FavoriteSwitchValue {
  event = 'event',
  content = 'content',
  project = 'project',
}
export const FavoriteSwitchOptions = [
  {
    label: 'Event',
    value: FavoriteSwitchValue.event,
  },
  {
    label: 'Content',
    value: FavoriteSwitchValue.content,
  },
  {
    label: 'Project',
    value: FavoriteSwitchValue.project,
  },
];
function Favorites() {
  const { events, projects, contents } = useUserFavorites();
  const [event, setEvent] = useState<EventsEntityItem | null>(null);
  const [project, setProject] = useState<ProjectsEntityItem | null>(null);
  const [content, setContent] = useState<ContentsEntityItem | null>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.event
  );

  const { keysFilter, contentHiddenOrNot } = useContentHidden();
  return (
    <FavoritesWrapper>
      <FavoritesListBox>
        <ButtonRadioGroup
          options={FavoriteSwitchOptions}
          value={switchValue}
          onChange={(value) => setSwitchValue(value)}
        />
        <FavoritesList>
          {switchValue === FavoriteSwitchValue.event && (
            <EventExploreList
              data={events}
              activeId={event?.id || 0}
              onItemClick={setEvent}
            />
          )}
          {switchValue === FavoriteSwitchValue.project && (
            <ProjectExploreList
              data={projects}
              activeId={project?.id || 0}
              onItemClick={setProject}
            />
          )}
          {switchValue === FavoriteSwitchValue.content && (
            <ContentList
              data={contents.filter((item) => {
                return !keysFilter.includes(item.id);
              })}
              activeId={content?.id || 0}
              onItemClick={(item: ContentsEntityItem) => setContent(item)}
            />
          )}
        </FavoritesList>
      </FavoritesListBox>
      <FavoritesContentBox>
        {switchValue === FavoriteSwitchValue.event && event && (
          <Event data={event} />
        )}
        {switchValue === FavoriteSwitchValue.project && project && (
          <Project data={project} />
        )}
        {switchValue === FavoriteSwitchValue.content &&
          content &&
          !keysFilter.includes(content.id) && (
            <Content
              data={content}
              onHidden={() => contentHiddenOrNot(content.id)}
            />
          )}
      </FavoritesContentBox>
    </FavoritesWrapper>
  );
}
export default Favorites;
const FavoritesWrapper = styled(MainWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
`;
const FavoritesListBox = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FavoritesList = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  border-radius: 10px;
  background-color: rgba(41, 41, 41, 1);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;
const FavoritesContentBox = styled.div`
  width: 0;
  flex: 1;
  overflow-y: auto;
`;
