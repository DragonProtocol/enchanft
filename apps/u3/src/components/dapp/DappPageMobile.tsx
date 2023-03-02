/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:25:26
 * @Description:
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import Loading from '../common/loading/Loading';
import type { DappPageProps } from '../../container/Dapp';
import { HeaderMobile } from './detail/Header';
import { ScreeshotsMobile } from './detail/Screeshots';
import { UserScoreMobile } from './detail/UserScore';
import { RecommendDappsMobile } from './detail/RecommendDapps';
import { IntroductionMobile } from './detail/Introduction';

export default function DappPageMobile({
  id,
  // Queries
  data,
  loading,
  recommendDapps,
  recommendDappsLoading,
}: DappPageProps) {
  const navigate = useNavigate();
  return loading ? (
    <StatusBox>
      <Loading />
    </StatusBox>
  ) : data ? (
    <Wrapper>
      <HeaderMobile data={data} />
      <ScreeshotsMobile />
      <IntroductionMobile text={data.description} />
      <UserScoreMobile />
      <RecommendDappsMobile
        data={recommendDapps}
        loading={recommendDappsLoading}
        onItemClick={(item) => navigate(`/dapps/${item.id}`)}
      />
    </Wrapper>
  ) : (
    <StatusBox>The dapp query with id {id} failed</StatusBox>
  );
}
const Wrapper = styled(MainWrapper)`
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const StatusBox = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
