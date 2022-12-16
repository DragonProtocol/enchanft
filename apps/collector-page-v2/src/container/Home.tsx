/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 14:00:51
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

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState<Array<PlatformData>>([]);
  const [trendingProjects, setTrendingProjects] = useState<
    Array<ProjectExploreListItemResponse>
  >([]);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);

  const loadProjects = useCallback(async () => {
    const { data } = await getTrendingProjects();
    setTrendingProjects(data.data);
  }, []);
  const loadContents = useCallback(async () => {
    const { data } = await getTrendingContents();
    setContents(data.data);
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
      <div>
        <Carousel />
        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) || (
          <>
            <RecommendEvents
              data={events}
              viewAllAction={() => {
                navigate('/events');
              }}
            />
            <div className="row-2">
              <RecommendContent
                data={contents}
                viewAllAction={() => {
                  navigate('/contents/:id');
                }}
              />
              <DiscoverProj
                data={trendingProjects}
                viewAllAction={() => {
                  navigate('/projects');
                }}
              />
            </div>
            <Platform
              platforms={platforms}
              viewAllAction={() => {
                navigate('/events');
              }}
            />
          </>
        )}
        <br />
      </div>
    </HomeWrapper>
  );
}
export default Home;
const HomeWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  > div {
    margin: 0 auto;
    width: 1160px;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  & div.loading {
    width: 1160px;
    display: flex;
    justify-content: center;
  }

  & div.row-2 {
    display: flex;
    gap: 40px;
  }
`;
