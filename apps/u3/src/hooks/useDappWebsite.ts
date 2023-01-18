/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 11:40:24
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 13:47:19
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RouteKey } from '../route/routes';
import useRoute from '../route/useRoute';
import useUserFavorites from './useUserFavorites';

const DAPP_MODAL_SEARCH_KEY = 'id';
export default () => {
  const { projects } = useUserFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  // 是否是dapp相关路由
  const { firstRouteMeta } = useRoute();
  const isDappRoute = useMemo(() => {
    return [RouteKey.dapps, RouteKey.dapp].includes(firstRouteMeta.key);
  }, [firstRouteMeta]);
  // 当前的dapp信息
  const dappModalData = useMemo(() => {
    if (!isDappRoute) return null;
    const id = searchParams.get(DAPP_MODAL_SEARCH_KEY);
    if (id) {
      return projects.find((item) => Number(item.id) === Number(id));
    }
    return null;
  }, [isDappRoute, searchParams, projects]);

  // 是否打开dapp modal
  const isOpenDappModal = useMemo(() => {
    return !!dappModalData;
  }, [dappModalData]);
  // 执行打开dapp modal
  const openDappModal = useCallback(
    (id: string | number) => {
      searchParams.set(DAPP_MODAL_SEARCH_KEY, String(id));
      setSearchParams(searchParams.toString());
    },
    [searchParams, setSearchParams]
  );
  // 执行关闭dapp modal
  const closeDappModal = useCallback(() => {
    searchParams.delete(DAPP_MODAL_SEARCH_KEY);
    setSearchParams(searchParams.toString());
  }, [searchParams, setSearchParams]);

  return {
    isOpenDappModal,
    dappModalData,
    openDappModal,
    closeDappModal,
  };
};
