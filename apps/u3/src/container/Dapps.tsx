/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 11:21:19
 * @Description:
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  fetchMoreDappExploreList,
  fetchDappExploreList,
  selectAll,
  selectState,
} from '../features/dapp/dappExploreList';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import useDappHandles from '../hooks/useDappHandles';
import {
  DappExploreListFilterValues,
  defaultDappExploreListFilterValues,
} from '../components/dapp/DappExploreListFilter';
import { DappExploreListItemResponse } from '../services/types/dapp';
import DappsPageMobile from '../components/dapp/DappsPageMobile';
import DappsPage from '../components/dapp/DappsPage';
import useDappWebsite from '../hooks/useDappWebsite';

export type DappsPageProps = {
  // Queries
  dapps: DappExploreListItemResponse[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  filter?: DappExploreListFilterValues;
  filterChange?: (values: DappExploreListFilterValues) => void;
  noMore?: boolean;
  getMore?: () => void;
  // Mutations
  installPendingIds?: (string | number)[];
  onInstall?: (item: DappExploreListItemResponse) => Promise<unknown>;
  // Others
};

export default function Dapps() {
  const dispatch = useAppDispatch();
  const { openDappModal } = useDappWebsite();
  const { favorQueueIds, onFavor } = useDappHandles();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dapps = useAppSelector(selectAll);
  const [filter, setFilter] = useState(defaultDappExploreListFilterValues);
  useEffect(() => {
    dispatch(fetchDappExploreList({ ...filter }));
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
    () => dispatch(fetchMoreDappExploreList(filter)),
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
