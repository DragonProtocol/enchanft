/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 17:48:13
 * @Description: 首页任务看板
 */
import { useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import ProjectDetailCard from '../components/project/ProjectDetailCard';
import { selectById } from '../features/project/projectExploreList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAll as selecteAllFovored } from '../features/project/userFavoredProjects';
import { selectAll as selecteAllCompletedEvents } from '../features/event/userCompletedEvents';
import {
  favorProject,
  selectIdsFavorProjectQueue,
} from '../features/project/projectHandles';
import { completeEvent } from '../features/event/eventHandles';

function Project() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const projectId = Number(params.id);
  const data = useAppSelector((state) => selectById(state, params.id));
  const favorProjectQueueIds = useAppSelector(selectIdsFavorProjectQueue).map(
    (id) => Number(id)
  );
  const favoredProjectIds = useAppSelector(selecteAllFovored).map(
    (item) => item.id
  );
  const completedEventIds = useAppSelector(selecteAllCompletedEvents).map(
    (item) => item.id
  );
  const onShare = () => {};
  const onFavor = useCallback(
    () => dispatch(favorProject({ id: projectId })),
    [dispatch, params]
  );
  const onEventComplete = useCallback(
    (eventId) => dispatch(completeEvent({ id: eventId })),
    [dispatch]
  );
  const isFavored = useMemo(
    () => favoredProjectIds.includes(projectId),
    [favoredProjectIds, projectId]
  );
  const loadingFavor = useMemo(
    () => favorProjectQueueIds.includes(projectId),
    [favorProjectQueueIds, projectId]
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
    />
  );
}
export default Project;
