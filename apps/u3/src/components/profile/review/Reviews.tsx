import { getS3LinkModel, useLinkState } from '@us3r-network/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CardBase from '../../common/card/CardBase';
import ReviewItem, { ReviewItemData } from './ReviewItem';
import Loading from '../../common/loading/Loading';
import { fetchDappFavorites } from '../../../services/api/favorite';
import { DappStatus } from '../../../services/types/dapp';

export default function Reviews() {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalAuthed } = useLinkState();
  const [list, setList] = useState<Array<ReviewItemData>>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (s3LinkModalAuthed) {
      setLoading(true);
      s3LinkModel
        .queryPersonalScores({ first: 1000 })
        .then(async (data) => {
          // 获取dapp相关的评分数据
          const dappNodes =
            data?.data.viewer.scoreList.edges
              ?.filter((edge) => edge.node.link.type === 'dapp')
              ?.map((edge) => edge.node) ?? [];
          const dappUrls = dappNodes.map((node) => node.link.url) ?? [];
          const resp = await fetchDappFavorites(dappUrls);
          const dapps = resp?.data?.data ?? [];
          setList(
            dapps.map((dapp) => {
              const findNode = dappNodes.find(
                (node) => dapp.threadStreamId === node.link.id
              );
              return {
                ...findNode,
                threadLogo: dapp?.image,
                threadTitle: dapp?.name,
                isVerified: dapp?.status === DappStatus.VERIFIED,
              };
            })
          );
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [s3LinkModalAuthed]);

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
