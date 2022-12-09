/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-09 15:58:35
 * @Description: event detail container
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useWlUserReact } from '@ecnft/wl-user-react';
import EventDetailCard from '../components/event/EventDetailCard';
import {
  completeEvent,
  favorEvent,
  selectIdsFavorEventQueue,
} from '../features/event/eventHandles';
import { selectAll as selecteAllCompleted } from '../features/event/userCompletedEvents';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useUserFavorites from '../hooks/useUserFavorites';
import { EventChain } from '../services/types/event';
import { Reward } from '../services/types/common';
import { addHideDaylightIdToStorage } from '../utils/daylight';

export type EventContainerProps = {
  data: {
    id: number;
    name: string;
    description: string;
    image: string;
    link: string;
    chain: EventChain;
    startTime: number;
    endTime: number;
    reward: Reward;
    project: {
      id: number;
      name: string;
      description: string;
      image: string;
    };
    platform: {
      logo: string;
    };
    isDaylight?: boolean;
  };
};
function Event({ data }: EventContainerProps) {
  const dispatch = useAppDispatch();
  const { isLogin } = useWlUserReact();
  const { eventIds } = useUserFavorites();
  const { id: eventId } = data;
  useEffect(() => {
    if (data.isDaylight) {
      addHideDaylightIdToStorage(data.id as unknown as string);
    }
  }, [data]);

  const favorQueueIds = useAppSelector(selectIdsFavorEventQueue).map((id) =>
    Number(id)
  );
  const completedIds = useAppSelector(selecteAllCompleted).map(
    (item) => item.id
  );
  const onComplete = useCallback(
    () => dispatch(completeEvent({ id: eventId })),
    [dispatch, eventId]
  );

  const onFavor = useCallback(
    () => dispatch(favorEvent(data)),
    [dispatch, data]
  );
  const onShare = () => {};

  const isFavored = useMemo(
    () => eventIds.includes(eventId),
    [eventIds, eventId]
  );
  const loadingFavor = useMemo(
    () => favorQueueIds.includes(eventId),
    [favorQueueIds, eventId]
  );
  const isCompleted = useMemo(
    () => completedIds.includes(eventId),
    [completedIds, eventId]
  );
  return (
    <EventDetailCard
      data={data}
      onComplete={onComplete}
      onShare={onShare}
      onFavor={onFavor}
      displayFavor={isLogin}
      displayComplete={isLogin}
      displayShare={isLogin}
      isFavored={isFavored}
      loadingFavor={loadingFavor}
      disabledFavor={isFavored || loadingFavor}
      isCompleted={isCompleted}
      disabledComplete={isCompleted}
    />
  );
}
export default Event;
