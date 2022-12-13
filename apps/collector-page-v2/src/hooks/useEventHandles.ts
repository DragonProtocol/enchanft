/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 09:43:20
 * @Description: file description
 */
import { useCallback } from 'react';
import {
  completeEvent,
  favorEvent,
  selectIdsFavorEventQueue,
} from '../features/event/eventHandles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useUserFavorites from './useUserFavorites';
import { selectAll as selecteAllCompleted } from '../features/event/userCompletedEvents';
import { EventExploreListItemResponse } from '../services/types/event';

export default () => {
  const dispatch = useAppDispatch();
  const { eventIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue).map((id) =>
    Number(id)
  );
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const onComplete = useCallback(
    (item: EventExploreListItemResponse) =>
      dispatch(completeEvent({ id: item.id })),
    [dispatch]
  );

  const onFavor = useCallback(
    (item: EventExploreListItemResponse) => dispatch(favorEvent(item)),
    [dispatch]
  );
  const onShare = useCallback((item: EventExploreListItemResponse) => {
    alert(item.id);
  }, []);
  return {
    favoredIds,
    favorQueueIds,
    completedIds,
    onComplete,
    onFavor,
    onShare,
  };
};