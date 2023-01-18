/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 17:45:37
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import { ProjectExploreListItemResponse } from '../services/types/project';
import { fetchOneProject } from '../services/api/project';
import { ApiRespCode } from '../services/types';
import Header from '../components/dapp/detail/Header';
import Screeshots from '../components/dapp/detail/Screeshots';
import Events from '../components/dapp/detail/Events';
import Conents from '../components/dapp/detail/Conents';
import UserScore from '../components/dapp/detail/UserScore';
import Contributor from '../components/dapp/detail/Contributor';
import QA from '../components/dapp/detail/QA';

export default function Dapp() {
  const { id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<ProjectExploreListItemResponse | null>(null);
  useEffect(() => {
    if (id) {
      setIsPending(true);
      fetchOneProject(id)
        .then((resp) => {
          if (resp.data.code === ApiRespCode.SUCCESS) {
            setData(resp.data.data);
          } else {
            setData(null);
            toast.error(resp.data.msg);
          }
        })
        .catch((error) => {
          setData(null);
          toast.error(error.message || error.msg);
        })
        .finally(() => {
          setIsPending(false);
        });
    }
  }, [id]);

  return isPending ? (
    <StatusBox>
      <Loading />
    </StatusBox>
  ) : data ? (
    <DappWrapper>
      <Header data={data} />
      <ContentLayout>
        <ContentLayoutLeft>
          <Screeshots />
          <Events data={data.events ?? []} />
          <Conents data={data.contents ?? []} />
          <UserScore />
        </ContentLayoutLeft>
        <ContentLayoutRight>
          <Contributor />
          <QA />
        </ContentLayoutRight>
      </ContentLayout>
    </DappWrapper>
  ) : (
    <StatusBox>The dapp query with id {id} failed</StatusBox>
  );
}

const DappWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
`;
const ContentLayoutLeft = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentLayoutRight = styled.div`
  width: 360px;
  flex-shrink: 0;
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
