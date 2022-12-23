/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 15:56:27
 * @Description: file description
 */
import { useCallback } from 'react';
import {
  completeEvent,
  favorEvent,
  selectIdsFavorEventQueue,
  selectIdsCompleteEventQueue,
} from '../features/event/eventHandles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useUserFavorites from './useUserFavorites';
import { selectAll as selecteAllCompleted } from '../features/event/userCompletedEvents';
import { EventExploreListItemResponse } from '../services/types/event';
import { tweetShare } from '../utils/twitter';
import { getEventShareUrl } from '../utils/share';
import useLogin from './useLogin';

export default () => {
  const { handleLoginVerify } = useLogin();
  const dispatch = useAppDispatch();
  const { eventIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue);
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const completeQueueIds = useAppSelector(selectIdsCompleteEventQueue);
  const onComplete = useCallback(
    (item: EventExploreListItemResponse) => {
      handleLoginVerify(() => {
        dispatch(completeEvent(item));
      });
    },
    [dispatch, handleLoginVerify]
  );

  const onFavor = useCallback(
    (item: EventExploreListItemResponse) => {
      handleLoginVerify(() => {
        dispatch(favorEvent(item));
      });
    },
    [dispatch, handleLoginVerify]
  );
  const onShare = useCallback((item: EventExploreListItemResponse) => {
    tweetShare(item.name, getEventShareUrl(item.id));
  }, []);
  return {
    favoredIds,
    favorQueueIds,
    completedIds,
    completeQueueIds,
    onComplete,
    onFavor,
    onShare,
  };
};
