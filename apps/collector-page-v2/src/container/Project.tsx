/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 19:04:48
 * @Description: 首页任务看板
 */
import { useCallback, useMemo, useState } from 'react';
import { useWlUserReact } from '@ecnft/wl-user-react';
import ProjectDetailCard from '../components/project/ProjectDetailView';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAll as selecteAllCompletedEvents } from '../features/event/userCompletedEvents';
import {
  favorProject,
  selectIdsFavorProjectQueue,
} from '../features/project/projectHandles';
import { completeEvent } from '../features/event/eventHandles';
import { ProjectExploreListItemResponse } from '../services/types/project';
import useUserFavorites from '../hooks/useUserFavorites';
import { tweetShare } from '../utils/twitter';
import { getProjectShareUrl } from '../utils/share';
import { voteContent } from '../services/api/contents';

export type ProjectContainerProps = {
  data: ProjectExploreListItemResponse;
};
function Project({ data }: ProjectContainerProps) {
  const { user } = useWlUserReact();
  const dispatch = useAppDispatch();
  const { projectIds } = useUserFavorites();
  const { id: projectId } = data;
  const favorProjectQueueIds = useAppSelector(selectIdsFavorProjectQueue).map(
    (id) => Number(id)
  );
  const completedEventIds = useAppSelector(selecteAllCompletedEvents).map(
    (item) => item.id
  );
  const onShare = () => {
    tweetShare(data.name, getProjectShareUrl(data.id));
  };
  const onFavor = useCallback(
    () => dispatch(favorProject(data)),
    [dispatch, data]
  );
  const onEventComplete = useCallback(
    (eventId) => dispatch(completeEvent({ id: eventId })),
    [dispatch]
  );
  const isFavored = useMemo(
    () => projectIds.includes(projectId),
    [projectIds, projectId]
  );
  const loadingFavor = useMemo(
    () => favorProjectQueueIds.includes(projectId),
    [favorProjectQueueIds, projectId]
  );
  const [currentVotedContentIds, setVotedContentIds] = useState([]);
  const onContentVote = useCallback(
    async (id) => {
      await voteContent(id, user.token);
      setVotedContentIds([...currentVotedContentIds, id]);
    },
    [currentVotedContentIds, setVotedContentIds]
  );
  return (
    <ProjectDetailCard
      data={data}
      completedEventIds={completedEventIds}
      isFavored={isFavored}
      loadingFavor={loadingFavor}
      disabledFavor={isFavored || loadingFavor}
      onEventComplete={(event) => onEventComplete(event.id)}
      onShare={onShare}
      onFavor={onFavor}
      currentVotedContentIds={currentVotedContentIds}
      onContentVote={onContentVote}
    />
  );
}
export default Project;
