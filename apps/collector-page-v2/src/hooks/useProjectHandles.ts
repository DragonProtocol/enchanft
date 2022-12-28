/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-20 14:51:24
 * @Description: file description
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  favorProject,
  selectIdsFavorProjectQueue,
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
      handleCallbackVerifyLogin(() => {
        dispatch(favorProject(item));
      });
    },
    [dispatch, handleCallbackVerifyLogin]
  );
  return {
    favoredIds,
    favorQueueIds,
    onFavor,
    onShare,
  };
};
