/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 11:23:45
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import { DappExploreListItemResponse } from '../services/types/dapp';
import { fetchListForDappExplore, fetchOneDapp } from '../services/api/dapp';
import { ApiRespCode } from '../services/types';
import useDappHandles from '../hooks/useDappHandles';
import DappPageMobile from '../components/dapp/DappPageMobile';
import DappPage from '../components/dapp/DappPage';

export type DappPageProps = {
  id: string | number;
  // Queries
  data: DappExploreListItemResponse;
  loading: boolean;
  recommendDapps: DappExploreListItemResponse[];
  recommendDappsLoading: boolean;
  // Mutations
  onInstall?: () => void;
  installLoading?: boolean;
  updateData?: (newData: DappExploreListItemResponse) => void;
  // Others
};
export default function Dapp() {
  const { id } = useParams();
  // Queries
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<DappExploreListItemResponse | null>(null);
  const [isPendingRecommend, setIsPendingRecommend] = useState(false);
  const [recommendDapps, setRecommendDapps] = useState<
    DappExploreListItemResponse[]
  >([]);
  const getRecommendDapps = useCallback((types: string[]) => {
    setIsPendingRecommend(true);
    fetchListForDappExplore({
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
      fetchOneDapp(id)
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

  // Mutations
  const { favorQueueIds, onFavor } = useDappHandles();
  const handleInstall = useCallback(async () => {
    const newData = await onFavor(data);
    if (newData) {
      setData(newData as DappExploreListItemResponse);
    }
  }, [onFavor, data]);
  const installLoading = useMemo(
    () => favorQueueIds.includes(data?.id),
    [data, favorQueueIds]
  );
  const updateData = useCallback(
    (newData) => {
      setData({ ...data, ...newData });
    },
    [data, setData]
  );

  return isMobile ? (
    <DappPageMobile
      id={id}
      data={data}
      recommendDapps={recommendDapps}
      loading={isPending}
      recommendDappsLoading={isPendingRecommend}
      onInstall={handleInstall}
      installLoading={installLoading}
      updateData={updateData}
    />
  ) : (
    <DappPage
      id={id}
      data={data}
      recommendDapps={recommendDapps}
      loading={isPending}
      recommendDappsLoading={isPendingRecommend}
      onInstall={handleInstall}
      installLoading={installLoading}
      updateData={updateData}
    />
  );
}
