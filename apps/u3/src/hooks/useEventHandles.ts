/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 17:27:12
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
  setEventCompleteGuideEnd,
  setEventCompleteGuideEndCallback,
  setOpenEventCompleteGuideModal,
} from '../features/website/websiteSlice';
import { useGAEvent } from './useGoogleAnalytics';

export default () => {
  const gaEvent = useGAEvent('u3-event');
  const { handleCallbackVerifyLogin } = useLogin();
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
      handleCallbackVerifyLogin(() => {
        if (!eventCompleteGuideEnd) {
          dispatch(setOpenEventCompleteGuideModal(true));
          dispatch(
            setEventCompleteGuideEndCallback(() => {
              dispatch(setEventCompleteGuideEnd());
              dispatch(completeEvent(item));
            })
          );
          return;
        }
        gaEvent('completeEvent', item.name);
        dispatch(completeEvent(item));
      });
    },
    [dispatch, handleCallbackVerifyLogin, eventCompleteGuideEnd, gaEvent]
  );

  const onFavor = useCallback(
    (item: EventExploreListItemResponse) => {
      handleCallbackVerifyLogin(() => {
        gaEvent('favorEvent', item.name);
        dispatch(favorEvent(item));
      });
    },
    [dispatch, handleCallbackVerifyLogin, gaEvent]
  );
  const onShare = useCallback(
    (item: EventExploreListItemResponse) => {
      gaEvent('shareEvent', item.name);
      tweetShare(item.name, getEventShareUrl(item.id));
    },
    [gaEvent]
  );
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
