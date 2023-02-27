/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:33:42
 * @Description:
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../components/layout/Index';
import ListScrollBox from '../components/common/box/ListScrollBox';
import {
  fetchMoreDappExploreList,
  fetchDappExploreList,
  selectAll,
  selectState,
} from '../features/dapp/dappExploreList';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Loading from '../components/common/loading/Loading';
import useDappHandles from '../hooks/useDappHandles';
import NoResult from '../components/common/NoResult';
import DappExploreListFilter, {
  defaultDappExploreListFilterValues,
} from '../components/dapp/DappExploreListFilter';
import DappExploreList from '../components/dapp/DappExploreList';
import useDappWebsite from '../hooks/useDappWebsite';

export default function Dapps() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { openDappModal } = useDappWebsite();
  const { favorQueueIds, onFavor } = useDappHandles();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dappExploreList = useAppSelector(selectAll);
  const [filter, setFilter] = useState(defaultDappExploreListFilterValues);
  useEffect(() => {
    dispatch(fetchDappExploreList({ ...filter }));
  }, [filter]);

  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmpty = useMemo(() => !dappExploreList.length, [dappExploreList]);

  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const getMore = useCallback(
    () => dispatch(fetchMoreDappExploreList(filter)),
    [filter]
  );

  return (
    <DappsWrapper>
      <DappExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <MainBox>
        {isLoading ? (
          <Loading />
        ) : isEmpty ? (
          <MainBody>
            <NoResult />
          </MainBody>
        ) : (
          <MainBody
            onScrollBottom={() => {
              getMore();
            }}
          >
            <DappExploreList
              data={dappExploreList}
              installPendingIds={favorQueueIds}
              onInstall={onFavor}
              onOpen={(item) => openDappModal(item.id)}
              onItemClick={(item) => navigate(`/dapps/${item.id}`)}
            />
            {isLoadingMore ? (
              <MoreLoading>loading ...</MoreLoading>
            ) : noMore ? (
              <MoreLoading>No other dapps</MoreLoading>
            ) : null}
          </MainBody>
        )}
      </MainBox>
    </DappsWrapper>
  );
}
const DappsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainBody = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  background: #1b1e23;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
