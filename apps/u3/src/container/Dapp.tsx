/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-13 12:07:11
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import {
  UpdateProjectData,
  ProjectExploreListItemResponse,
} from '../services/types/project';
import {
  fetchListForProjectExplore,
  fetchOneProject,
  updateProject,
} from '../services/api/project';
import { ApiRespCode } from '../services/types';
import Header from '../components/dapp/detail/Header';
import Screeshots from '../components/dapp/detail/Screeshots';
import Events from '../components/dapp/detail/Events';
import Conents from '../components/dapp/detail/Conents';
import UserScore from '../components/dapp/detail/UserScore';
import Contributor from '../components/dapp/detail/Contributor';
import QA from '../components/dapp/detail/QA';
import useDappWebsite from '../hooks/useDappWebsite';
import useProjectHandles from '../hooks/useProjectHandles';
import RecommendDapps from '../components/dapp/detail/RecommendDapps';
import DappEditModal from '../components/dapp/DappEditModal';
import { messages } from '../utils/message';

export default function Dapp() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<ProjectExploreListItemResponse | null>(null);
  const { openDappModal } = useDappWebsite();
  const { favorQueueIds, onFavor } = useProjectHandles();
  const [isPendingRecommend, setIsPendingRecommend] = useState(false);
  const [recommendDapps, setRecommendDapps] = useState<
    ProjectExploreListItemResponse[]
  >([]);
  const getRecommendDapps = useCallback((types: string[]) => {
    setIsPendingRecommend(true);
    fetchListForProjectExplore({
      types,
      pageSize: 6,
      pageNumber: 0,
    })
      .then((resp) => {
        if (resp.data.code === ApiRespCode.SUCCESS) {
          setRecommendDapps(resp.data.data);
        } else {
          setRecommendDapps([]);
          toast.error(resp.data.msg);
        }
      })
      .catch((error) => {
        setRecommendDapps([]);
        toast.error(error.message || error.msg);
      })
      .finally(() => {
        setIsPendingRecommend(false);
      });
  }, []);
  useEffect(() => {
    if (id) {
      setIsPending(true);
      fetchOneProject(id)
        .then((resp) => {
          if (resp.data.code === ApiRespCode.SUCCESS) {
            setData(resp.data.data);
            getRecommendDapps(resp.data.data?.types || []);
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
  const handleInstall = useCallback(async () => {
    const newData = await onFavor(data);
    if (newData) {
      setData(newData as ProjectExploreListItemResponse);
    }
  }, [onFavor, data]);
  const [openEdit, setOpenEdit] = useState(false);

  const [adminEditPending, setAdminEditPending] = useState(false);
  const handleEditSubmit = useCallback(
    async (form: UpdateProjectData) => {
      if (adminEditPending) return;
      try {
        setAdminEditPending(true);
        const resp = await updateProject(id, form);
        const { code, msg } = resp.data;
        if (code === 0) {
          setData((oldData) => ({ ...oldData, ...form }));
          toast.success(messages.dapp.admin_update);
          setOpenEdit(false);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setAdminEditPending(false);
      }
    },
    [adminEditPending]
  );
  return isPending ? (
    <StatusBox>
      <Loading />
    </StatusBox>
  ) : data ? (
    <DappWrapper>
      <Header
        data={data}
        disabledInstall={data.favored || favorQueueIds.includes(data.id)}
        loadingInstall={favorQueueIds.includes(data.id)}
        isInstalled={data.favored}
        onInstall={handleInstall}
        onOpen={() => openDappModal(data.id)}
        onEdit={() => setOpenEdit(true)}
      />
      <ContentLayout>
        <ContentLayoutLeft>
          <Screeshots />
          {data?.contents?.length && (
            <Conents
              data={data.contents}
              onItemClick={(item) => navigate(`/contents/${item.id}`)}
            />
          )}
          {data?.events?.length && (
            <Events
              data={data.events}
              onItemClick={(item) => navigate(`/events/${item.id}`)}
            />
          )}

          <UserScore />
        </ContentLayoutLeft>
        <ContentLayoutRight>
          <Contributor />
          <QA />
          <RecommendDapps
            data={recommendDapps}
            loading={isPendingRecommend}
            onItemClick={(item) => navigate(`/dapps/${item.id}`)}
          />
        </ContentLayoutRight>
      </ContentLayout>
      <DappEditModal
        isOpen={openEdit}
        data={data}
        disabled={adminEditPending}
        loading={adminEditPending}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
      />
    </DappWrapper>
  ) : (
    <StatusBox>The dapp query with id {id} failed</StatusBox>
  );
}

const DappWrapper = styled(MainWrapper)`
  height: auto;
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
