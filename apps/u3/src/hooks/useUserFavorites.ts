/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:56:55
 * @Description: file description
 */
import { useUs3rAuth } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useUs3rThreadContext } from '@us3r-network/thread';
import { useCallback, useEffect } from 'react';
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
} from '../features/favorite/userGroupFavorites';
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

  const refreshFavorites = useCallback(() => {
    if (!isLogin) {
      dispatch(removeAllFavorites());
      return;
    }
    if (
      authComposeClientsValid &&
      relationsComposeClient.context.isAuthenticated()
    ) {
      getPersonalFavorList({})
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
    authComposeClientsValid,
    relationsComposeClient.context,
    getPersonalFavorList,
  ]);

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
  };
};
