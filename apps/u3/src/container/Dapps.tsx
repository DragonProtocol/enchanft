/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-23 11:59:36
 * @Description:
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  fetchMoreProjectExploreList,
  fetchProjectExploreList,
  selectAll,
  selectState,
} from '../features/project/projectExploreList';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useProjectHandles from '../hooks/useProjectHandles';
import {
  DappExploreListFilterValues,
  defaultDappExploreListFilterValues,
} from '../components/dapp/DappExploreListFilter';
import { ProjectExploreListItemResponse } from '../services/types/project';
import DappsPageMobile from '../components/dapp/DappsPageMobile';
import DappsPage from '../components/dapp/DappsPage';

export type DappsPageProps = {
  // Queries
  dapps: ProjectExploreListItemResponse[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  filter?: DappExploreListFilterValues;
  filterChange?: (values: DappExploreListFilterValues) => void;
  noMore?: boolean;
  getMore?: () => void;
  // Mutations
  installPendingIds?: (string | number)[];
  onInstall?: (item: ProjectExploreListItemResponse) => Promise<unknown>;
  // Others
};

export default function Dapps() {
  const dispatch = useAppDispatch();
  const { favorQueueIds, onFavor } = useProjectHandles();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dapps = useAppSelector(selectAll);
  const [filter, setFilter] = useState(defaultDappExploreListFilterValues);
  useEffect(() => {
    dispatch(fetchProjectExploreList({ ...filter }));
  }, [filter]);

  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmpty = useMemo(() => !dapps.length, [dapps]);

  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const getMore = useCallback(
    () => dispatch(fetchMoreProjectExploreList(filter)),
    [filter]
  );

  const filterChange = useCallback(
    (values: DappExploreListFilterValues) => {
      const newFilter = { ...filter };
      // eslint-disable-next-line guard-for-in
      for (const key in values) {
        newFilter[key] = values[key];
      }
      setFilter(newFilter);
    },
    [filter]
  );
  return isMobile ? (
    <DappsPageMobile
      // Queries
      dapps={dapps}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      isEmpty={isEmpty}
      filter={filter}
      filterChange={filterChange}
      noMore={noMore}
      getMore={getMore}
      // Mutations
      installPendingIds={favorQueueIds}
      onInstall={onFavor}
    />
  ) : (
    <DappsPage
      // Queries
      dapps={dapps}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      isEmpty={isEmpty}
      filter={filter}
      filterChange={filterChange}
      noMore={noMore}
      getMore={getMore}
      // Mutations
      installPendingIds={favorQueueIds}
      onInstall={onFavor}
    />
  );
}
