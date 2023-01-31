/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-31 10:38:08
 * @Description: file description
 */

import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/common/loading/Loading';
import Carousel from '../components/home/Carousel';
import DiscoverProj from '../components/home/DiscoverProj';
import Platform from '../components/home/Platform';
import RecommendContent from '../components/home/RecommendContent';
import RecommendEvents from '../components/home/RecommendEvents';
import TrendingEvents from '../components/home/TrendingEvents';
import { MainWrapper } from '../components/layout/Index';
import { selectWebsite } from '../features/website/websiteSlice';
import {
  getPlatforms,
  getTrendingProjects,
  getTrendingEvents,
  getTrendingContents,
} from '../services/api/home';
import { ContentListItem } from '../services/types/contents';
import { EventExploreListItemResponse } from '../services/types/event';
import { PlatformData } from '../services/types/home';
import { ProjectExploreListItemResponse } from '../services/types/project';
import { useAppSelector } from '../store/hooks';

function Home() {
  const { homeBannerDisplay } = useAppSelector(selectWebsite);
  const navigate = useNavigate();
  const [showOnBoard, setShowOnBoard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState<Array<PlatformData>>([]);
  const [trendingProjects, setTrendingProjects] = useState<
    Array<ProjectExploreListItemResponse>
  >([]);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);
  const recommendEvents = events.slice(0, 8);
  const trendingEvents = events.slice(-6);

  const loadProjects = useCallback(async () => {
    const { data } = await getTrendingProjects();
    setTrendingProjects(data.data);
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
  const loadPlatforms = useCallback(async () => {
    const { data } = await getPlatforms();
    setPlatforms(data.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadPlatforms(),
      loadEvents(),
      loadContents(),
      loadProjects(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <HomeWrapper>
      {homeBannerDisplay && <Carousel />}
      {(loading && (
        <div className="loading">
          <Loading />
        </div>
      )) || (
        <>
          <div className="row-2">
            <div className="left">
              <RecommendContent
                data={contents}
                viewAllAction={() => {
                  navigate('/contents/:id');
                }}
              />
            </div>
            <div className="right">
              <DiscoverProj
                data={trendingProjects}
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
          {/* <TrendingEvents
            data={trendingEvents}
            viewAllAction={() => {
              navigate('/events');
            }}
          /> */}
          <Platform
            platforms={platforms}
            viewAllAction={() => {
              navigate('/events');
            }}
          />
        </>
      )}
    </HomeWrapper>
  );
}
export default Home;
const HomeWrapper = styled(MainWrapper)`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 40px;
  & div.loading {
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
