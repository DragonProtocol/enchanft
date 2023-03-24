/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:56:55
 * @Description: file description
 */
import { useUs3rAuth } from '@us3r-network/authkit';
import { useUs3rThreadContext } from '@us3r-network/thread';
import { useCallback, useEffect, useMemo } from 'react';
import {
  fetchUserGroupFavorites,
  removeAllFavorites,
  selectAllForContents,
  selectAllForEvents,
  selectAllForProjects,
  selectAllForDapps,
  selectIdsForContents,
  selectIdsForEvents,
  selectIdsForProjects,
  selectIdsForDapps,
  addOneWithDapps,
  selectState,
} from '../features/favorite/userGroupFavorites';
import { AsyncRequestStatus } from '../services/types';
import { DappExploreListItemResponse } from '../services/types/dapp';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useLogin from './useLogin';

export default () => {
  const { authComposeClientsValid } = useUs3rAuth();
  const { isLogin } = useLogin();
  const { relationsComposeClient, getPersonalFavorList } =
    useUs3rThreadContext();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectAllForEvents);
  const eventIds = useAppSelector(selectIdsForEvents).map((id) => Number(id));
  const projects = useAppSelector(selectAllForProjects);
  const projectIds = useAppSelector(selectIdsForProjects).map((id) =>
    Number(id)
  );
  const dapps = useAppSelector(selectAllForDapps);
  const dappIds = useAppSelector(selectIdsForDapps).map((id) => Number(id));
  const contents = useAppSelector(selectAllForContents);
  const contentIds = useAppSelector(selectIdsForContents).map((id) =>
    Number(id)
  );
  const userFavoritesState = useAppSelector(selectState);

  const refreshFavorites = useCallback(() => {
    if (!isLogin) {
      dispatch(removeAllFavorites());
      return;
    }
    if (
      authComposeClientsValid &&
      relationsComposeClient.context.isAuthenticated()
    ) {
      getPersonalFavorList({ first: 1000 })
        .then((data) => {
          const contentUrls =
            data?.edges
              ?.filter((item) => item.node.thread.type === 'content')
              .map((item) => item.node.thread.url) || [];

          const eventUrls =
            data?.edges
              ?.filter((item) => item.node.thread.type === 'event')
              .map((item) => item.node.thread.url) || [];

          const projectUrls =
            data?.edges
              ?.filter((item) => item.node.thread.type === 'project')
              .map((item) => item.node.thread.url) || [];

          const dappUrls =
            data?.edges
              ?.filter((item) => item.node.thread.type === 'dapp')
              .map((item) => item.node.thread.url) || [];

          dispatch(
            fetchUserGroupFavorites({
              contentUrls,
              eventUrls,
              projectUrls,
              dappUrls,
            })
          );
        })
        .catch(console.error);
    }
  }, [
    isLogin,
    authComposeClientsValid,
    relationsComposeClient.context,
    getPersonalFavorList,
  ]);

  const addOneToFavoredDapps = useCallback(
    (dapp: DappExploreListItemResponse) => {
      dispatch(addOneWithDapps(dapp));
    },
    [dispatch]
  );

  const favoredDappStreamIds = useMemo(
    () => dapps.map((item) => item.threadStreamId),
    [dapps]
  );

  const isFavoredDapp = useCallback(
    (threadStreamId: string) => {
      return favoredDappStreamIds.includes(threadStreamId);
    },
    [favoredDappStreamIds]
  );

  const userFavoritesLoaded = useMemo(
    () => userFavoritesState.status === AsyncRequestStatus.FULFILLED,
    [userFavoritesState.status]
  );
  return {
    events,
    eventIds,
    projects,
    projectIds,
    dapps,
    dappIds,
    contents,
    contentIds,
    refreshFavorites,
    addOneToFavoredDapps,
    favoredDappStreamIds,
    isFavoredDapp,
    userFavoritesLoaded,
  };
};
