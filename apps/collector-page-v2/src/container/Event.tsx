/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 19:50:36
 * @Description: 首页任务看板
 */
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useWlUserReact } from '@ecnft/wl-user-react';
import EventDetailCard from '../components/event/EventDetailCard';
import { selectById } from '../features/event/eventExploreList';
import {
  completeEvent,
  favorEvent,
  selectIdsFavorEventQueue,
} from '../features/event/eventHandles';
import { selectAll as selecteAllFovored } from '../features/event/userFavoredEvents';
import { selectAll as selecteAllCompleted } from '../features/event/userCompletedEvents';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function Event() {
  const dispatch = useAppDispatch();
  const { isLogin } = useWlUserReact();
  const params = useParams();
  const eventId = Number(params.id);
  const data = useAppSelector((state) => selectById(state, eventId));

  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue).map((id) =>
    Number(id)
  );
  const favoredIds = useAppSelector(selecteAllFovored).map((item) => item.id);
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const onComplete = useCallback(
    () => dispatch(completeEvent({ id: eventId })),
    [dispatch, params]
  );

  const onFavor = useCallback(
    () => dispatch(favorEvent({ id: eventId })),
    [dispatch, params]
  );
  const onShare = () => {};
  return data ? (
    <EventDetailCard
      data={data}
      onComplete={onComplete}
      onShare={onShare}
      onFavor={onFavor}
      displayFavor={isLogin}
      displayComplete={isLogin}
      displayShare={isLogin}
      isFavored={favoredIds.includes(eventId)}
      isCompleted={completedIds.includes(eventId)}
      loadingFavor={favorQueueIds.includes(eventId)}
    />
  ) : null;
}
export default Event;
