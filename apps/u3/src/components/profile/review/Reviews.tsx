import { useUs3rThreadContext } from '@us3r-network/thread';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CardBase from '../../common/card/CardBase';
import ReviewItem, { ReviewItemData } from './ReviewItem';
import Loading from '../../common/loading/Loading';
import { fetchDappFavorites } from '../../../services/api/favorite';
import { DappStatus } from '../../../services/types/dapp';

export default function Reviews() {
  const { relationsComposeClient, getPersonalScoreList } =
    useUs3rThreadContext();
  const [list, setList] = useState<Array<ReviewItemData>>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (relationsComposeClient.context.isAuthenticated()) {
      setLoading(true);
      getPersonalScoreList({ first: 1000 })
        .then(async (data) => {
          // 获取dapp相关的评分数据
          const dappNodes =
            data?.edges
              ?.filter((edge) => edge.node.thread.type === 'dapp')
              ?.map((edge) => edge.node) ?? [];

          // 先展示原始评分数据
          setList(
            dappNodes.map((node) => ({
              ...node,
              threadLogo: '',
              threadTitle: node?.thread?.url,
              isVerified: false,
            })) ?? []
          );
          setLoading(false);

          // 再异步获取并更新dapp详细信息
          const dappUrls =
            data?.edges
              ?.filter((edge) => edge.node.thread.type === 'dapp')
              .map((edge) => edge.node.thread.url) ?? [];
          const resp = await fetchDappFavorites(dappUrls);
          const dapps = resp?.data?.data ?? [];
          // eslint-disable-next-line @typescript-eslint/no-shadow
          setList((list) =>
            list.map((item) => {
              const findDapp = dapps.find(
                (dapp) => dapp.threadStreamId === item.thread.id
              );
              return {
                ...item,
                threadLogo: findDapp?.image,
                threadTitle: findDapp?.name,
                isVerified: findDapp?.status === DappStatus.VERIFIED,
              };
            })
          );
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [relationsComposeClient.context, getPersonalScoreList]);

  return (
    <Wrapper>
      <Title>My Reviews ({list.length})</Title>
      {loading ? (
        <StatusBox>
          <Loading />
        </StatusBox>
      ) : (
        <List>
          {list.map((item) => (
            <ReviewItem key={item.id} data={item} />
          ))}
        </List>
      )}
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  border: none;
`;

const Title = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
`;
const List = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const StatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
`;
