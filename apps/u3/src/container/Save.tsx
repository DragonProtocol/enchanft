import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Thread, useUs3rThreadContext } from '@us3r-network/thread';
import { isMobile } from 'react-device-detect';

import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import PageTitle from '../components/common/PageTitle';
import { contentParse } from '../services/api/contents';
import SaveExploreList from '../components/save/SaveExploreList';
import SaveExploreListMobile from '../components/save/SaveExploreListMobile';
import { getContentPlatformLogoWithJsonValue } from '../utils/content';

function EmptyList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        Nothing to see here！ Explore and favorite what you like！
      </EmptyDesc>
    </EmptyBox>
  );
}

const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background-color: #1b1e23;
`;

const EmptyDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;

export default function Save() {
  const { relationsComposeClient, getPersonalFavorList } =
    useUs3rThreadContext();
  const [list, setList] = useState<
    Array<
      Thread & {
        title?: string;
        logo?: string;
      }
    >
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEmpty = useMemo(() => list.length === 0, [list]);

  useEffect(() => {
    if (relationsComposeClient.context.isAuthenticated()) {
      setIsLoading(true);
      getPersonalFavorList({ first: 1000 })
        .then((d) => {
          // 先显示url列表
          const threads = d?.edges.map((item) => item.node.thread) || [];
          setList(threads);

          // 再异步获取url对应的title
          for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];
            contentParse(thread.url).then(({ data }) => {
              setList((prev) => {
                const index = prev.findIndex((item) => item.id === thread.id);
                if (index === -1) {
                  return prev;
                }
                prev[index] = {
                  ...thread,
                  title: data?.data?.title,
                  logo: getContentPlatformLogoWithJsonValue(
                    data?.data?.content
                  ),
                };
                return [...prev];
              });
            });
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [relationsComposeClient.context, getPersonalFavorList]);

  return (
    <Wrapper>
      {isMobile ? null : <PageTitle>Saves</PageTitle>}
      <ContentWrapper>
        {isLoading ? (
          <Loading />
        ) : isEmpty ? (
          <EmptyList />
        ) : isMobile ? (
          <SaveExploreListMobile
            data={list}
            onItemClick={(item) => {
              window.open(item.url, '_blank');
            }}
          />
        ) : (
          <SaveExploreList
            data={list}
            onItemClick={(item) => {
              window.open(item.url, '_blank');
            }}
          />
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
