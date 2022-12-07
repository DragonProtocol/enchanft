/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 19:25:06
 * @Description: 首页任务看板
 */
import { useState } from 'react';
import styled from 'styled-components';
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup';
import EventExploreList from '../components/event/EventExploreList';
import ProjectExploreList from '../components/project/ProjectExploreList';
import useUserFavorites from '../hooks/useUserFavorites';
import { EventExploreListItemResponse } from '../services/types/event';
import { ProjectExploreListItemResponse } from '../services/types/project';
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
  const { events, projects } = useUserFavorites();
  const [event, setEvent] = useState<Maybe<EventExploreListItemResponse>>(null);
  const [project, setProject] =
    useState<Maybe<ProjectExploreListItemResponse>>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.event
  );
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
              activeId={0}
              onItemClick={setEvent}
            />
          )}
          {switchValue === FavoriteSwitchValue.project && (
            <ProjectExploreList
              data={projects}
              activeId={0}
              onItemClick={setProject}
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
      </FavoritesContentBox>
    </FavoritesWrapper>
  );
}
export default Favorites;
const FavoritesWrapper = styled.div`
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
  flex: 1;
`;
const FavoritesContentBox = styled.div`
  flex: 1;
`;
