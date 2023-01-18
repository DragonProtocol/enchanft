/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 10:45:14
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
    <DappWrapper>
      <Loading />
    </DappWrapper>
  ) : data ? (
    <DappWrapper>{JSON.stringify(data, null, 2)}</DappWrapper>
  ) : (
    <DappWrapper>The dapp query with id {id} failed</DappWrapper>
  );
}

const DappWrapper = styled(MainWrapper)`
  display: flex;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
