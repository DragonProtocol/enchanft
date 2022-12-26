/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 18:15:05
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
import { selectAll as selecteAllCompleted } from '../features/event/eventCompletedList';
import { EventExploreListItemResponse } from '../services/types/event';
import { tweetShare } from '../utils/twitter';
import { getEventShareUrl } from '../utils/share';
import useLogin from './useLogin';
import {
  selectWebsite,
  setOpenEventCompleteGuideModal,
} from '../features/website/websiteSlice';

export default () => {
  const { handleLoginVerify } = useLogin();
  const dispatch = useAppDispatch();
  const { eventIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue);
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const completeQueueIds = useAppSelector(selectIdsCompleteEventQueue);

  const { eventCompleteGuideEnd } = useAppSelector(selectWebsite);
  const onComplete = useCallback(
    (item: EventExploreListItemResponse) => {
      handleLoginVerify(() => {
        if (!eventCompleteGuideEnd) {
          dispatch(setOpenEventCompleteGuideModal(true));
          return;
        }
        dispatch(completeEvent(item));
      });
    },
    [dispatch, handleLoginVerify, eventCompleteGuideEnd]
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
