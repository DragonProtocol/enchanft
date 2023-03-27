/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-23 11:49:06
 * @Description:
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import ListScrollBox from '../common/box/ListScrollBox';
import Loading from '../common/loading/Loading';
import NoResult from '../common/NoResult';
import DappExploreListFilter from './DappExploreListFilter';
import DappExploreList from './DappExploreList';
import useDappWebsite from '../../hooks/useDappWebsite';
import type { DappsPageProps } from '../../container/Dapps';
import useUserFavorites from '../../hooks/useUserFavorites';

export default function DappsPage({
  // Queries
  dapps,
  isLoading,
  isLoadingMore,
  isEmpty,
  filter,
  filterChange,
  noMore,
  getMore,
}: // Others
DappsPageProps) {
  const navigate = useNavigate();
  const { openDappModal } = useDappWebsite();
  const { addOneToFavoredDapps } = useUserFavorites();

  return (
    <DappsPageWrapper>
      <DappExploreListFilter values={filter} onChange={filterChange} />
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
              data={dapps}
              onFavorSuccess={addOneToFavoredDapps}
              onOpen={(item) => openDappModal(item.id)}
              onItemClick={(item) => navigate(`/dapp-store/${item.id}`)}
            />
            {isLoadingMore ? (
              <MoreLoading>loading ...</MoreLoading>
            ) : noMore ? (
              <MoreLoading>No other dapps</MoreLoading>
            ) : null}
          </MainBody>
        )}
      </MainBox>
    </DappsPageWrapper>
  );
}
const DappsPageWrapper = styled(MainWrapper)`
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
