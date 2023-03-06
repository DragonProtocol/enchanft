/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 11:40:24
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 12:13:54
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

  // 是否是project相关路由
  const { firstRouteMeta } = useRoute();
  const isProjectRoute = useMemo(() => {
    return [RouteKey.projects, RouteKey.project].includes(firstRouteMeta.key);
  }, [firstRouteMeta]);
  // 当前的project信息
  const projectModalData = useMemo(() => {
    if (!isProjectRoute) return null;
    const id = searchParams.get(DAPP_MODAL_SEARCH_KEY);
    if (id) {
      return projects.find((item) => Number(item.id) === Number(id));
    }
    return null;
  }, [isProjectRoute, searchParams, projects]);

  // 是否打开project modal
  const isOpenProjectModal = useMemo(() => {
    return !!projectModalData;
  }, [projectModalData]);
  // 执行打开project modal
  const openProjectModal = useCallback(
    (id: string | number) => {
      searchParams.set(DAPP_MODAL_SEARCH_KEY, String(id));
      setSearchParams(searchParams.toString());
    },
    [searchParams, setSearchParams]
  );
  // 执行关闭project modal
  const closeProjectModal = useCallback(() => {
    searchParams.delete(DAPP_MODAL_SEARCH_KEY);
    setSearchParams(searchParams.toString());
  }, [searchParams, setSearchParams]);

  return {
    isOpenProjectModal,
    projectModalData,
    openProjectModal,
    closeProjectModal,
  };
};
