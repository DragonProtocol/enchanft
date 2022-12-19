/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 11:29:23
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
import { tweetShare } from '../utils/twitter';
import { US_HOST_URI } from '../constants';
import { getEventShareUrl } from '../utils/share';
import useLogin from './useLogin';

export default () => {
  const { handleLoginVerify } = useLogin();
  const dispatch = useAppDispatch();
  const { eventIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue).map((id) =>
    Number(id)
  );
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const onComplete = useCallback(
    (item: EventExploreListItemResponse) => {
      handleLoginVerify(() => {
        dispatch(completeEvent({ id: item.id }));
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
    onComplete,
    onFavor,
    onShare,
  };
};
