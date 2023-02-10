/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 14:11:54
 * @Description: file description
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  favorProject,
  selectIdsFavorProjectQueue,
  unfavorProject,
} from '../features/project/projectHandles';
import { ProjectExploreListItemResponse } from '../services/types/project';
import useUserFavorites from './useUserFavorites';
import { tweetShare } from '../utils/twitter';
import { getProjectShareUrl } from '../utils/share';
import useLogin from './useLogin';

export default () => {
  const { handleCallbackVerifyLogin } = useLogin();
  const dispatch = useAppDispatch();
  const { projectIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorProjectQueue).map((id) =>
    Number(id)
  );
  const onShare = useCallback((item: ProjectExploreListItemResponse) => {
    tweetShare(item.name, getProjectShareUrl(item.id));
  }, []);
  const onFavor = useCallback(
    (item: ProjectExploreListItemResponse) => {
      return new Promise((resolve, reject) => {
        handleCallbackVerifyLogin(async () => {
          const data = await dispatch(favorProject(item));
          resolve(data.payload);
        });
      });
    },
    [dispatch, handleCallbackVerifyLogin]
  );
  const onUnfavor = useCallback(
    (item: ProjectExploreListItemResponse) => {
      return new Promise((resolve, reject) => {
        handleCallbackVerifyLogin(async () => {
          const data = await dispatch(unfavorProject(item));
          resolve(data.payload);
        });
      });
    },
    [dispatch, handleCallbackVerifyLogin]
  );
  return {
    favoredIds,
    favorQueueIds,
    onFavor,
    onUnfavor,
    onShare,
  };
};
