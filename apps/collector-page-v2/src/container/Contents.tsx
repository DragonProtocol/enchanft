/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 14:57:46
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import ContentsHeader from '../components/contents/Header';

import {
  contentParse,
  fetchContents,
  fetchDaylight,
} from '../services/api/contents';
import { ContentListItem, OrderBy } from '../services/types/contents';
import ListItem from '../components/contents/ListItem';
import ContentShower from '../components/contents/ContentShower';
import userFavored from '../hooks/useFavored';
import { useVoteUp } from '../hooks/useVoteUp';
import useContentHidden from '../hooks/useContentHidden';
import ExtensionSupport from '../components/common/ExtensionSupport';
import Loading from '../components/common/loading/Loading';
import { getProjectShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';
import ListScrollBox from '../components/common/box/ListScrollBox';

function Contents() {
  const { user, getBindAccount } = useWlUserReact();
  const evmAccount = getBindAccount(AccountType.EVM);
  const navigate = useNavigate();
  const { id } = useParams();

  const queryRef = useRef<{
    keywords: string;
    type: string;
    orderBy: string;
  }>({
    keywords: '',
    type: '',
    orderBy: 'For U',
  });
  const [currDaylightCursor, setCurrDaylightCursor] = useState('');
  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [daylightContent, setDaylightContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [daylightContentLoading, setDaylightContentLoading] = useState(false);
  const { keysFilter, contentHiddenOrNot } = useContentHidden();
  const [tab, setTab] = useState<'original' | 'readerView'>('readerView');

  const vote = useVoteUp(selectContent?.id, selectContent?.upVoted);

  const favors = userFavored(selectContent?.id, selectContent?.favored);

  const onShare = (data: ContentListItem) => {
    tweetShare(data.title, getProjectShareUrl(data.id));
  };

  const fetchDaylightData = useCallback(
    async (daylightCursor: string) => {
      if (!evmAccount?.thirdpartyId) return [];
      const data = await fetchDaylight(
        daylightCursor,
        evmAccount?.thirdpartyId
      );
      const cursor = data.data.abilities[data.data.abilities.length - 1]?.uid;
      // setCurrDaylightCursor(data.data.links.next);
      setCurrDaylightCursor(cursor);
      return data.data.abilities;
    },
    [evmAccount]
  );

  const fetchData = useCallback(
    async (keywords: string, type: string, orderBy: string) => {
      setLoading(true);
      setContents([]);
      setSelectContent(undefined);
      if (type.toLowerCase() === 'all') {
        type = '';
      }

      try {
        let tmpData = [];
        if (orderBy === OrderBy.FORU) {
          const [dayLightData, { data }] = await Promise.all([
            fetchDaylightData(''),
            fetchContents(
              { keywords, type, orderBy: OrderBy.TRENDING, contentId: id },
              user.token
            ),
          ]);
          tmpData = [...dayLightData, ...data.data];
        } else {
          const { data } = await fetchContents(
            { keywords, type, orderBy, contentId: id },
            user.token
          );
          tmpData = data.data;
        }
        setContents(tmpData);
        if (id) {
          setSelectContent(
            tmpData.find((item) => `${item.id}` === id || item.uid === id)
          );
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [currPageNumber, user.token, id]
  );

  const loadMore = useCallback(
    async (pageNumber: number) => {
      const { keywords, type, orderBy } = queryRef.current;
      try {
        setLoadingMore(true);
        if (orderBy === OrderBy.FORU) {
          const [dayLightData, { data }] = await Promise.all([
            fetchDaylightData(currDaylightCursor),
            fetchContents(
              {
                keywords,
                type,
                orderBy: OrderBy.TRENDING,
                pageNumber,
              },
              user.token
            ),
          ]);
          setHasMore(dayLightData.length > 0 || data.data.length > 0);
          setContents([...contents, ...dayLightData, ...data.data]);
        } else {
          const { data } = await fetchContents(
            { keywords, type, orderBy, pageNumber },
            user.token
          );
          setHasMore(data.data.length > 0);
          setContents([...contents, ...data.data]);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingMore(false);
      }
    },
    [queryRef.current, contents, currDaylightCursor]
  );

  const loadDaylightContent = useCallback(async (url: string) => {
    try {
      setDaylightContentLoading(true);
      const { data } = await contentParse(url);
      setDaylightContent(data.data.content);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDaylightContentLoading(false);
    }
  }, []);

  const contentValue = useMemo(() => {
    if (!selectContent?.value) return '';
    try {
      const content = JSON.parse(selectContent?.value);
      return content.content;
    } catch (error) {
      return selectContent?.value;
    }
  }, [selectContent]);

  const showContents = useMemo(() => {
    return contents.filter((item) => {
      return !keysFilter.includes(item.uid || item.id);
    });
  }, [contents, keysFilter]);

  useEffect(() => {
    if (selectContent?.uid) {
      loadDaylightContent(selectContent.action.linkUrl);
    } else {
      setDaylightContent('');
    }
  }, [selectContent]);

  useEffect(() => {
    fetchData('', '', 'For U');
  }, []);

  return (
    <Box id="box">
      <ContentsHeader
        filterAction={(keywords: string, type: string, orderBy: string) => {
          queryRef.current = {
            keywords,
            type,
            orderBy,
          };
          fetchData(keywords, type, orderBy);
          navigate('/contents/:id');
        }}
        changeOriginalAction={() => {
          setTab('original');
        }}
        changeReaderViewAction={() => {
          setTab('readerView');
        }}
      />
      {(loading && (
        <ContentsWrapper loading="true">
          <div className="loading">
            <Loading />
          </div>
        </ContentsWrapper>
      )) || (
        <ContentsWrapper>
          <ListBox
            onScrollBottom={() => {
              console.log('onScrollBottom LoadMore', loadingMore, hasMore);
              if (loadingMore) return;
              if (!hasMore) return;
              loadMore(currPageNumber + 1);
              setCurrPageNumber(currPageNumber + 1);
            }}
          >
            {showContents.map((item, idx) => {
              let isActive = false;
              if (item.uid) {
                isActive = item.uid === selectContent?.uid;
              } else {
                isActive = item.id === selectContent?.id;
              }
              return (
                <ListItem
                  key={item.id || item.uid}
                  isActive={isActive}
                  clickAction={() => {
                    setSelectContent(item);
                    navigate(`/contents/${item.uid || item.id}`);
                  }}
                  shareAction={() => {
                    onShare(item);
                  }}
                  voteAction={async () => {
                    try {
                      await vote();
                      if (selectContent.upVoted) return;
                      setSelectContent({
                        ...selectContent,
                        upVoteNum: selectContent.upVoteNum + 1,
                        upVoted: true,
                      });
                      setContents([
                        ...showContents.slice(0, idx),
                        {
                          ...showContents[idx],
                          upVoteNum: showContents[idx].upVoteNum + 1,
                          upVoted: true,
                        },
                        ...showContents.slice(idx + 1),
                      ]);
                    } catch (error) {
                      toast.error(error.message);
                    }
                  }}
                  favorsAction={async () => {
                    try {
                      await favors();
                      if (selectContent.favored) return;
                      setSelectContent({
                        ...selectContent,
                        favored: true,
                      });
                      setContents([
                        ...showContents.slice(0, idx),
                        {
                          ...showContents[idx],
                          favored: true,
                        },
                        ...showContents.slice(idx + 1),
                      ]);
                    } catch (error) {
                      toast.error(error.message);
                    }
                  }}
                  hiddenAction={() => {
                    contentHiddenOrNot(selectContent?.uid || selectContent.id);
                    setSelectContent(undefined);
                  }}
                  {...item}
                />
              );
            })}
            {!hasMore && (
              <div className="load-more">
                <div>No other contents</div>
              </div>
            )}
            {loadingMore && (
              <div className="load-more">
                <div className="loading">
                  <Loading />
                </div>
              </div>
            )}
          </ListBox>

          <ContentBox>
            <div className="tabs">
              <div>
                <button
                  type="button"
                  className={tab === 'original' ? 'active' : ''}
                  onClick={() => {
                    setTab('original');
                    // changeOriginalAction();
                  }}
                >
                  Original
                </button>
                <button
                  className={tab === 'readerView' ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setTab('readerView');
                    // changeReaderViewAction();
                  }}
                >
                  ReaderView
                </button>
              </div>
            </div>
            {tab === 'original' && selectContent && (
              <ExtensionSupport
                url={selectContent.action?.linkUrl || selectContent.link}
                title={selectContent.title}
                img={
                  selectContent.imageUrl ||
                  (selectContent.uniProjects &&
                    selectContent.uniProjects[0]?.image)
                }
              />
            )}
            {tab === 'readerView' &&
              selectContent &&
              ((daylightContentLoading && (
                <LoadingBox>
                  <Loading />
                </LoadingBox>
              )) ||
                (selectContent &&
                  ((selectContent.supportReaderView && (
                    <ContentShower
                      {...selectContent}
                      content={daylightContent || contentValue}
                      voteAction={vote}
                      favorsActions={favors}
                      hiddenAction={() => {
                        contentHiddenOrNot(
                          selectContent?.uid || selectContent.id
                        );
                        setSelectContent(undefined);
                      }}
                    />
                  )) || (
                    <ExtensionSupport
                      url={selectContent.action?.linkUrl || selectContent.link}
                      title={selectContent.title}
                      img={
                        selectContent.imageUrl ||
                        (selectContent.uniProjects &&
                          selectContent.uniProjects[0]?.image)
                      }
                    />
                  ))))}
          </ContentBox>
        </ContentsWrapper>
      )}
    </Box>
  );
}
export default Contents;

const Box = styled.div`
  margin: 0 auto;
  height: calc(100vh - 72px);
  box-sizing: border-box;
  padding: 24px 40px 0 40px;
  overflow: hidden;
`;
const ContentsWrapper = styled.div<{ loading?: string }>`
  width: calc(100% - 2px);
  height: calc(100% - 74px);
  box-sizing: border-box;
  border: ${(props) => (props.loading ? 'none' : '1px solid #39424c')};
  background-color: ${(props) => (props.loading ? '' : '#1b1e23')};
  /* border--radius: 20px; */
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  display: flex;
  margin-top: 24px;

  & .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const ListBox = styled(ListScrollBox)`
  min-width: 360px;
  width: 360px;
  height: calc(100%);
  overflow: scroll;
  border-right: 1px solid #39424c;

  & .load-more {
    margin: 20px;
    text-align: center;
    color: #718096;
    > button {
      cursor: pointer;
      background-color: inherit;
      color: #fff;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 10px 20px;
      outline: none;
    }
  }
`;
const ContentBox = styled.div`
  height: calc(100%);
  width: calc(100% - 360px);

  overflow-x: hidden;
  overflow: hidden;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }

  & div.tabs {
    height: 60px;
    background: #1b1e23;
    border-bottom: 1px solid #39424c;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      width: 260px;
      height: 40px;
      background: #14171a;
      border-radius: 100px;
      padding: 4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > button {
        cursor: pointer;
        width: 122px;
        height: 32px;
        border: none;

        box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
          0px 0px 4px rgba(20, 23, 26, 0.04);
        border-radius: 100px;
        outline: none;
        background: inherit;
        color: #a0aec0;

        &.active {
          color: #ffffff;
          background: #21262c;
        }
      }
    }
  }
`;

const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;
