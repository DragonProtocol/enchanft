/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:56:55
 * @Description: file description
 */
import { useWlUserReact } from '@ecnft/wl-user-react';
import { useEffect } from 'react';
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

export default () => {
  const { isLogin } = useWlUserReact();
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
  useEffect(() => {
    if (!isLogin) {
      dispatch(removeAllFavorites());
      return;
    }
    dispatch(fetchUserGroupFavorites());
  }, [isLogin]);
  return {
    events,
    eventIds,
    projects,
    projectIds,
    dapps,
    dappIds,
    contents,
    contentIds,
  };
};
