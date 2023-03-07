/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-07 15:52:58
 * @Description: file description
 */

import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/common/loading/Loading';
import DappExploreListMobile from '../components/dapp/DappExploreListMobile';
import Carousel from '../components/home/Carousel';
import DiscoverProj from '../components/home/DiscoverProj';
import Platform from '../components/home/Platform';
import RecommendContent from '../components/home/RecommendContent';
import RecommendContentMobile from '../components/home/RecommendContentMobile';
import RecommendEvents from '../components/home/RecommendEvents';
import TrendingEvents from '../components/home/TrendingEvents';
import Poster from '../components/home/Poster';
import { MainWrapper } from '../components/layout/Index';
import { selectWebsite } from '../features/website/websiteSlice';
import useConfigsPlatforms from '../hooks/useConfigsPlatforms';
import {
  getPlatforms,
  getTrendingDapps,
  getTrendingEvents,
  getTrendingContents,
} from '../services/api/home';
import { ContentListItem } from '../services/types/contents';
import { EventExploreListItemResponse } from '../services/types/event';
import { PlatformData } from '../services/types/home';
import { DappExploreListItemResponse } from '../services/types/dapp';
import { useAppSelector } from '../store/hooks';
import PopularDappsMobile from '../components/home/PopularDappsMobile';
import RecommendEventMobile from '../components/home/RecommendEventsMobile';

function Home() {
  const { homeBannerDisplay } = useAppSelector(selectWebsite);
  const navigate = useNavigate();
  const [showOnBoard, setShowOnBoard] = useState(true);
  const [loading, setLoading] = useState(true);
  const { platforms, loading: platformsLoading } = useConfigsPlatforms();
  const showPlatforms = useMemo(
    () => platforms.filter((item) => !!item.number).slice(0, 16),
    [platforms]
  );
  const [trendingDapps, setTrendingDapps] = useState<
    Array<DappExploreListItemResponse>
  >([]);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);
  const recommendEvents = events.slice(0, 8);
  const trendingEvents = events.slice(-6);

  const loadDapps = useCallback(async () => {
    const { data } = await getTrendingDapps();
    setTrendingDapps(data.data);
  }, []);
  const loadContents = useCallback(async () => {
    const { data } = await getTrendingContents();
    // 按总体分值排序
    const sortData = [...(data?.data || [])].sort((a, b) => {
      const aScore = Number(a?.upVoteNum) + Number(a?.editorScore);
      const bScore = Number(b?.upVoteNum) + Number(b?.editorScore);
      return bScore - aScore;
    });
    setContents(sortData);
  }, []);
  const loadEvents = useCallback(async () => {
    const { data } = await getTrendingEvents();
    setEvents(data.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEvents(), loadContents(), loadDapps()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <HomeWrapper>
      {!isMobile && homeBannerDisplay && <Carousel />}
      {(loading && (
        <div className="loading">
          <Loading />
        </div>
      )) || (
        <>
          {isMobile && (
            <>
              <RecommendContentMobile
                data={contents}
                viewAllAction={() => {
                  navigate('/contents');
                }}
              />
              <PopularDappsMobile
                data={trendingDapps}
                viewAllAction={() => navigate('/dapps')}
              />
              <RecommendEventMobile data={recommendEvents} />
            </>
          )}

          {!isMobile && (
            <>
              <div className="row-2">
                <div className="left">
                  <RecommendContent
                    data={contents}
                    viewAllAction={() => {
                      navigate('/contents');
                    }}
                  />
                </div>
                <div className="right">
                  <DiscoverProj
                    data={trendingDapps}
                    viewAllAction={() => {
                      navigate('/dapps');
                    }}
                  />
                </div>
              </div>

              <RecommendEvents
                data={recommendEvents}
                viewAllAction={() => {
                  navigate('/events');
                }}
              />
              <Platform
                platforms={showPlatforms}
                viewAllAction={() => {
                  navigate('/events');
                }}
              />
            </>
          )}

          <Poster
            data={{
              contents,
              dapps: trendingDapps,
              // dapps: trendingProjects,
              events: recommendEvents,
            }}
            isMobile={isMobile}
          />
        </>
      )}
    </HomeWrapper>
  );
}
export default Home;
const HomeWrapper = styled(MainWrapper)`
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  ${isMobile &&
  `
    gap: 20px;
  `}
  & div.loading {
    height: 0;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & div.row-2 {
    display: flex;
    gap: 20px;
    .left {
      flex: 3;
    }
    .right {
      flex: 1;
    }
  }
`;
