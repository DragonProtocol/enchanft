/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 18:47:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 15:17:48
 * @Description: file description
 */
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchConfigsPlatforms,
  selectState,
} from '../features/configs/platforms';
import { AsyncRequestStatus } from '../services/types';

export default () => {
  const dispatch = useAppDispatch();
  const { status, platforms } = useAppSelector(selectState);
  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchConfigsPlatforms());
    }
  }, [status]);
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return {
    loading,
    platforms,
  };
};
