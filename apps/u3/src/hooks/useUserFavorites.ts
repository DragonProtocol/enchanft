/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:56:55
 * @Description: file description
 */
import { useCallback, useEffect, useMemo } from 'react';
import { getS3LinkModel, useLinkState } from '@us3r-network/link';
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
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalAuthed } = useLinkState();
  const { isLogin } = useLogin();
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
    if (s3LinkModalAuthed) {
      s3LinkModel
        .queryPersonalFavors({ first: 1000 })
        .then((data) => {
          const contentUrls =
            data?.data.viewer.favorList.edges
              ?.filter((item) => item.node.link.type === 'content')
              .map((item) => item.node.link.url) || [];

          const eventUrls =
            data?.data.viewer.favorList.edges
              ?.filter((item) => item.node.link.type === 'event')
              .map((item) => item.node.link.url) || [];

          const projectUrls =
            data?.data.viewer.favorList.edges
              ?.filter((item) => item.node.link.type === 'project')
              .map((item) => item.node.link.url) || [];

          const dappUrls =
            data?.data.viewer.favorList.edges
              ?.filter((item) => item.node.link.type === 'dapp')
              .map((item) => item.node.link.url) || [];

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
  }, [isLogin, s3LinkModalAuthed]);

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
