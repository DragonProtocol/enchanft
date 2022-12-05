/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 19:34:03
 * @Description: 首页任务看板
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ButtonRadioGroup from '../components/common/button/ButtonRadioGroup';
import EventExploreList from '../components/event/EventExploreList';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import ProjectExploreList from '../components/project/ProjectExploreList';
import { selectAll as selecteAllFovoredEvents } from '../features/event/userFavoredEvents';
import { selectAll as selecteAllFovoredProjects } from '../features/project/userFavoredProjects';
import { useAppSelector } from '../store/hooks';

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
  const navigate = useNavigate();
  const favoredEvents = useAppSelector(selecteAllFovoredEvents);
  const favoredProjects = useAppSelector(selecteAllFovoredProjects);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.event
  );
  return (
    <ListRouteLayout>
      <FavoritesWrapper>
        <ButtonRadioGroup
          options={FavoriteSwitchOptions}
          value={switchValue}
          onChange={(value) => setSwitchValue(value)}
        />
        <FavoritesContentBox>
          {switchValue === FavoriteSwitchValue.event && (
            <EventExploreList
              data={favoredEvents}
              activeId={0}
              onItemClick={(item) => navigate(`/favorites/events/${item.id}`)}
            />
          )}
          {switchValue === FavoriteSwitchValue.project && (
            <ProjectExploreList
              data={favoredProjects}
              activeId={0}
              onItemClick={(item) => navigate(`/favorites/projects/${item.id}`)}
            />
          )}
        </FavoritesContentBox>
      </FavoritesWrapper>
    </ListRouteLayout>
  );
}
export default Favorites;
const FavoritesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FavoritesContentBox = styled.div`
  width: 100%;
  flex: 1;
`;
