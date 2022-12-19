/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 13:35:11
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ScrollBox from '../components/common/box/ScrollBox';
import Tab from '../components/common/tab/Tab';
import ContentList from '../components/contents/ContentList';
import EventExploreList from '../components/event/EventExploreList';
import EventLinkPreview from '../components/event/EventLinkPreview';
import { MainWrapper } from '../components/layout/Index';
import ProjectExploreList from '../components/project/ProjectExploreList';
import {
  ContentsEntityItem,
  EventsEntityItem,
  fetchUserGroupFavorites,
  ProjectsEntityItem,
  selectState,
} from '../features/favorite/userGroupFavorites';
import useContentHidden from '../hooks/useContentHidden';
import useEventHandles from '../hooks/useEventHandles';
import useUserFavorites from '../hooks/useUserFavorites';
import Content from './Content';
import Project from './Project';
import ArchiveSvg from '../components/common/icons/svgs/archive.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { AsyncRequestStatus } from '../services/types';
import Loading from '../components/common/loading/Loading';

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
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserGroupFavorites());
  }, []);
  const {
    favoredIds,
    favorQueueIds,
    completedIds,
    onComplete,
    onFavor,
    onShare,
  } = useEventHandles();
  const { events, projects, contents } = useUserFavorites();
  const { status } = useAppSelector(selectState);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [event, setEvent] = useState<EventsEntityItem | null>(null);
  const [project, setProject] = useState<ProjectsEntityItem | null>(null);
  const [content, setContent] = useState<ContentsEntityItem | null>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.event
  );

  const { keysFilter, contentHiddenOrNot } = useContentHidden();
  return (
    <FavoritesWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <FavoritesLayout>
          <FavoritesListBox>
            <FavoritesListHeader>
              <TabSwitch
                options={FavoriteSwitchOptions}
                value={switchValue}
                onChange={(value) => setSwitchValue(value)}
              />
              <HeaderLine />
              <ArchiveIconButton src={ArchiveSvg} />
            </FavoritesListHeader>

            <FavoritesList>
              {switchValue === FavoriteSwitchValue.event && (
                <EventExploreList
                  data={events}
                  activeId={event?.id || 0}
                  favoredIds={favoredIds}
                  favorQueueIds={favorQueueIds}
                  completedIds={completedIds}
                  displayHandles
                  onComplete={onComplete}
                  onFavor={onFavor}
                  onShare={onShare}
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
              <EventLinkPreview data={event} />
            )}
            {switchValue === FavoriteSwitchValue.project && project && (
              <ContentScrollBox>
                <Project data={project} />
              </ContentScrollBox>
            )}
            {switchValue === FavoriteSwitchValue.content &&
              content &&
              !keysFilter.includes(content.id) && (
                <ContentScrollBox>
                  <Content
                    data={content}
                    onHidden={() => contentHiddenOrNot(content.id)}
                  />
                </ContentScrollBox>
              )}
          </FavoritesContentBox>
        </FavoritesLayout>
      )}
    </FavoritesWrapper>
  );
}
export default Favorites;
const FavoritesWrapper = styled(MainWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FavoritesLayout = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const FavoritesListBox = styled.div`
  width: 360px;
  height: 100%;
  background: #1b1e23;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const FavoritesListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid #39424c;
  padding: 0 20px;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
`;
const HeaderLine = styled.div`
  width: 1px;
  height: 10px;
  background: #718096;
`;
const ArchiveIconButton = styled.img`
  width: 24px;
  height: 24px;
`;
const FavoritesList = styled(ScrollBox)`
  width: 100%;
  height: 0px;
  flex: 1;
`;
const FavoritesContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
const ContentScrollBox = styled(ScrollBox)`
  width: 100%;
  height: 100%;
  padding: 20px;
`;
