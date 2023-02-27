/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:54:35
 * @Description: file description
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  favorDapp,
  selectIdsFavorDappQueue,
  unfavorDapp,
} from '../features/dapp/dappHandles';
import { DappExploreListItemResponse } from '../services/types/dapp';
import useUserFavorites from './useUserFavorites';
import { tweetShare } from '../utils/twitter';
import { getDappShareUrl } from '../utils/share';
import useLogin from './useLogin';

export default () => {
  const { handleCallbackVerifyLogin } = useLogin();
  const dispatch = useAppDispatch();
  const { dappIds: favoredIds } = useUserFavorites();
  const favorQueueIds = useAppSelector(selectIdsFavorDappQueue).map((id) =>
    Number(id)
  );
  const onShare = useCallback((item: DappExploreListItemResponse) => {
    tweetShare(item.name, getDappShareUrl(item.id));
  }, []);
  const onFavor = useCallback(
    (item: DappExploreListItemResponse) => {
      return new Promise((resolve, reject) => {
        handleCallbackVerifyLogin(async () => {
          const data = await dispatch(favorDapp(item));
          resolve(data.payload);
        });
      });
    },
    [dispatch, handleCallbackVerifyLogin]
  );
  const onUnfavor = useCallback(
    (item: DappExploreListItemResponse) => {
      return new Promise((resolve, reject) => {
        handleCallbackVerifyLogin(async () => {
          const data = await dispatch(unfavorDapp(item));
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
