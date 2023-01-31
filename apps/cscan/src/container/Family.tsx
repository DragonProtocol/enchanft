import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Network } from '../types';
import ListTable from '../components/ListTable';
import useListData from '../hooks/useListData';

export default function Family() {
  let { network, familyOrApp } = useParams();

  const { pageNum, data, hasMore, loadData, fetchMoreData } = useListData({
    network: network as Network,
    familyOrApp,
  });

  useEffect(() => {
    if (!network || !familyOrApp) return;
    loadData({ network: network as Network, familyOrApp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, familyOrApp]);

  return (
    <div>
      <Title>
        <h2>Family or App </h2>
      </Title>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          pageNum.current += 1;
          fetchMoreData(pageNum.current);
        }}
        hasMore={hasMore}
        loader={<Loading>Loading...</Loading>}
      >
        <ListTable data={data} network={network?.toLowerCase()} showDid />
      </InfiniteScroll>
      {!hasMore && <Loading>no more data</Loading>}
    </div>
  );
}

const Title = styled.div`
  position: sticky;
  background-color: #14171a;
  padding: 20px 0;
  top: 0;

  > h2 {
    margin: 0;
  }
`;

const Loading = styled.div`
  padding: 20px;
  text-align: center;
  color: gray;
`;
