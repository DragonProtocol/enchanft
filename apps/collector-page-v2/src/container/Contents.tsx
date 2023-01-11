/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 10:30:12
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

import ListItem, { ListItemHidden } from '../components/contents/ListItem';
import { fetchContents, updateContent } from '../services/api/contents';
import {
  ContentLang,
  ContentListItem,
  ContentStatus,
  OrderBy,
} from '../services/types/contents';
import Loading from '../components/common/loading/Loading';
import { getProjectShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';
import ListScrollBox from '../components/common/box/ListScrollBox';
import ContentShowerBox, {
  ContentBoxContainer,
} from '../components/contents/ContentShowerBox';
import useContentHandles from '../hooks/useContentHandles';
import { MainWrapper } from '../components/layout/Index';
import FeedsMenu from '../components/layout/FeedsMenu';
import GridItem, { GridItemHidden } from '../components/contents/GridItem';
import GridModal from '../components/contents/GridModal';
import FeedsMenuRight, { Layout } from '../components/layout/FeedsMenuRight';
import FeedsFilterBox from '../components/layout/FeedsFilterBox';
import Filter from '../components/contents/Filter';
import SearchInput from '../components/common/input/SearchInput';
import { DropDown } from '../components/contents/DropDown';
import { Favors } from '../components/icons/favors';
import NoResult from '../components/common/NoResult';

function Contents() {
  const { user, getBindAccount } = useWlUserReact();
  const navigate = useNavigate();
  const { id } = useParams();

  const queryRef = useRef<{
    keywords: string;
    types: string[];
    orderBy: string;
    lang: string[];
  }>({
    keywords: '',
    types: [],
    orderBy: 'For U',
    lang: [],
  });
  const removeTimer = useRef<NodeJS.Timeout>();

  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [layout, setLayout] = useState(Layout.LIST);
  const [gridModalShow, setGridModalShow] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(false);

  const {
    onFavor: favors,
    onVote: vote,
    onHidden: hiddenData,
    favorPendingIds,
    newList,
  } = useContentHandles(contents);

  const onShare = (data: ContentListItem) => {
    tweetShare(data.title, getProjectShareUrl(data.id));
  };

  const undoHiddenAction = useCallback(
    (idx: number) => {
      setContents([
        ...contents.slice(0, idx),
        {
          ...contents[idx],
          hidden: false,
        },
        ...contents.slice(idx + 1),
      ]);
      if (removeTimer.current) {
        clearTimeout(removeTimer.current);
      }
    },
    [contents, removeTimer]
  );

  const hiddenAction = useCallback(
    (itemData: ContentListItem) => {
      const idx = contents.findIndex((item) => {
        if (item?.uuid && item?.uuid === itemData?.uuid) return true;
        if (item?.id && item.id === itemData.id) return true;
        return false;
      });
      if (idx === -1) return;
      setContents([
        ...contents.slice(0, idx),
        {
          ...contents[idx],
          hidden: true,
        },
        ...contents.slice(idx + 1),
      ]);
      if (removeTimer.current) {
        clearTimeout(removeTimer.current);
        removeTimer.current = undefined;
      }
      removeTimer.current = setTimeout(() => {
        removeContent(idx);
      }, 3000);
    },
    [contents]
  );

  const fetchData = useCallback(
    async (
      keywords: string,
      types: string[],
      orderBy: string,
      lang: string[],
      renav?: boolean
    ) => {
      let queryId = id;
      if (renav) {
        navigate('/contents/:id');
        queryId = ':id';
      }
      setLoading(true);
      setContents([]);
      setSelectContent(undefined);

      try {
        let tmpData: ContentListItem[] = [];
        const langQuery =
          lang.length === 0 || lang.length === 2 ? ContentLang.All : lang[0];
        const { data } = await fetchContents(
          { keywords, types, orderBy, contentId: queryId, lang: langQuery },
          user.token
        );
        tmpData = data.data;
        setContents(tmpData);
        if (queryId !== ':id' && queryId) {
          const itemData = tmpData.find(
            (item) => `${item.id}` === queryId || item.uuid === queryId
          );
          setSelectContent(itemData);
        } else if (tmpData.length > 0) {
          setSelectContent(tmpData[0]);
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
      const { keywords, types, orderBy, lang } = queryRef.current;
      const langQuery =
        lang.length === 0 || lang.length === 2 ? ContentLang.All : lang[0];
      try {
        setLoadingMore(true);
        const { data } = await fetchContents(
          { keywords, types, orderBy, pageNumber, lang: langQuery },
          user.token
        );
        setHasMore(data.data.length > 0);
        setContents([...contents, ...data.data]);
      } catch (error) {
        toast.error(error.message);
        setHasMore(false);
      } finally {
        setLoadingMore(false);
      }
    },
    [queryRef.current, contents]
  );

  const removeContent = useCallback(
    async (idx: number) => {
      if (idx === -1) return;

      const dataItem = contents[idx];
      clearTimeout(removeTimer.current);
      removeTimer.current = undefined;
      await hiddenData(dataItem);
      setContents([...contents.slice(0, idx), ...contents.slice(idx + 1)]);
      let item;
      if (contents[idx + 1]) {
        item = contents[idx + 1];
      } else if (contents[idx - 1]) {
        item = contents[idx - 1];
      } else {
        setSelectContent(undefined);
      }

      if (item) {
        navigate(`/contents/${item.id || item.uuid}`);
        setSelectContent(item);
      }
    },
    [contents, hiddenData, selectContent]
  );

  const scoreContent = useCallback(
    async (editId: number) => {
      if (updating) return;
      setUpdating(true);
      try {
        const idx = contents.findIndex((item) => {
          if (item?.id && item.id === editId) return true;
          return false;
        });
        const curr = contents[idx];
        if (!curr) return;

        curr.editorScore = Number(curr.editorScore || 0) + 10;
        await updateContent(
          { id: editId, editorScore: curr.editorScore },
          user.token
        );
        toast.success('score content success!!!');

        setContents([
          ...contents.slice(0, idx),
          { ...curr },
          ...contents.slice(idx + 1),
        ]);
        setSelectContent({
          ...curr,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setUpdating(false);
      }
    },
    [user.token, updating, contents]
  );

  const delContent = useCallback(
    async (editId: number) => {
      if (updating) return;
      setUpdating(true);
      try {
        await updateContent(
          { id: editId, status: ContentStatus.HIDDEN },
          user.token
        );
        const idx = contents.findIndex((item) => {
          if (item?.id && item.id === editId) return true;
          return false;
        });

        setContents([...contents.slice(0, idx), ...contents.slice(idx + 1)]);
        setSelectContent(undefined);
        toast.success('delete content success!!!');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setUpdating(false);
      }
    },
    [user.token, contents, updating]
  );

  const fetchDataWithFilter = useCallback(
    debounce((...args) => fetchData.apply(null, [...args, true]), 3000),
    []
  );

  useEffect(() => {
    fetchData('', [], 'For U', []);
  }, []);

  return (
    <Box>
      <FeedsMenu
        rightEl={
          <FeedsMenuRight
            displayFilterButton
            isActiveFilter={isActiveFilter}
            onChangeActiveFilter={setIsActiveFilter}
            orderByEl={
              <DropDown
                items={Object.values(OrderBy)}
                Icon={<Favors />}
                width={145}
                title="For U"
                selectAction={(item) => {
                  queryRef.current = {
                    keywords: queryRef.current.keywords,
                    types: queryRef.current.types,
                    orderBy: item,
                    lang: queryRef.current.lang,
                  };
                  fetchData(
                    queryRef.current.keywords,
                    queryRef.current.types,
                    queryRef.current.orderBy,
                    queryRef.current.lang,
                    true
                  );
                }}
              />
            }
            searchEl={
              <SearchInput
                debounceMs={1000}
                onSearch={(value) => {
                  queryRef.current = {
                    keywords: value,
                    types: queryRef.current.types,
                    orderBy: queryRef.current.orderBy,
                    lang: queryRef.current.lang,
                  };
                  fetchData(
                    queryRef.current.keywords,
                    queryRef.current.types,
                    queryRef.current.orderBy,
                    queryRef.current.lang,
                    true
                  );
                }}
              />
            }
            multiLayout
            layout={layout}
            setLayout={(l) => {
              setLayout(l);
            }}
          />
        }
        bottomEl={
          <FeedsFilterBox open={isActiveFilter}>
            <Filter
              filterAction={(data) => {
                queryRef.current = {
                  keywords: queryRef.current.keywords,
                  types: data.types,
                  orderBy: queryRef.current.orderBy,
                  lang: data.lang,
                };
                fetchDataWithFilter(
                  queryRef.current.keywords,
                  queryRef.current.types,
                  queryRef.current.orderBy,
                  queryRef.current.lang
                );
              }}
            />
          </FeedsFilterBox>
        }
      />
      {(() => {
        if (loading) {
          return (
            <ContentsWrapper loading="true">
              <div className="loading">
                <Loading />
              </div>
            </ContentsWrapper>
          );
        }
        if (newList.length === 0) {
          return (
            <ContentsWrapper>
              <NoResult />
            </ContentsWrapper>
          );
        }

        if (layout === Layout.LIST) {
          return (
            <ContentsWrapper>
              <ListBox
                onScrollBottom={() => {
                  console.log('onScrollBottom LoadMore', loadingMore, hasMore);
                  if (newList.length === 0) return;
                  if (loadingMore) return;
                  if (!hasMore) return;
                  loadMore(currPageNumber + 1);
                  setCurrPageNumber(currPageNumber + 1);
                }}
              >
                {newList.map((item, idx) => {
                  let isActive = false;
                  if (item.id) {
                    isActive = item.id === selectContent?.id;
                  } else {
                    isActive = item.uuid === selectContent?.uuid;
                  }

                  if (item.hidden) {
                    return (
                      <ListItemHidden
                        key={item.id || item.uuid}
                        isActive={isActive}
                        hidden
                        undoAction={() => undoHiddenAction(idx)}
                      />
                    );
                  }

                  return (
                    <ListItem
                      key={item.id || item.uuid}
                      isActive={isActive}
                      favorPendingIds={favorPendingIds}
                      clickAction={() => {
                        setSelectContent(item);
                        navigate(`/contents/${item.id || item.uuid}`);
                      }}
                      shareAction={() => {
                        onShare(item);
                      }}
                      voteAction={() => {
                        vote(item);
                      }}
                      favorsAction={() => {
                        favors(item);
                      }}
                      hiddenAction={() => {
                        hiddenAction(item);
                      }}
                      {...item}
                    />
                  );
                })}
                {(!hasMore && (
                  <LoadingMore className="load-more nomore">
                    No other contents
                  </LoadingMore>
                )) || (
                  <LoadingMore
                    className={
                      loadingMore ? 'load-more loadmoreing' : 'load-more'
                    }
                  >
                    loading
                  </LoadingMore>
                )}
              </ListBox>
              <ContentBoxContainer>
                <ContentShowerBox
                  selectContent={selectContent}
                  deleteAction={() => {
                    if (selectContent?.id) delContent(selectContent.id);
                  }}
                  editAction={() => {
                    if (selectContent?.id)
                      navigate(`/contents/create?id=${selectContent.id}`);
                  }}
                  thumbUpAction={() => {
                    if (selectContent?.id) scoreContent(selectContent.id);
                  }}
                />
              </ContentBoxContainer>
            </ContentsWrapper>
          );
        }
        if (layout === Layout.GRID) {
          return (
            <ContentsGridWrapper
              onScrollBottom={() => {
                console.log('onScrollBottom LoadMore', loadingMore, hasMore);
                if (newList.length === 0) return;
                if (loadingMore) return;
                if (!hasMore) return;
                loadMore(currPageNumber + 1);
                setCurrPageNumber(currPageNumber + 1);
              }}
            >
              <div className="list">
                {newList.map((item, idx) => {
                  let isActive = false;
                  if (item.id) {
                    isActive = item.id === selectContent?.id;
                  } else {
                    isActive = item.uuid === selectContent?.uuid;
                  }

                  if (item.hidden) {
                    return (
                      <GridItemHidden
                        key={item.id || item.uuid}
                        isActive={isActive}
                        hidden
                        undoAction={() => undoHiddenAction(idx)}
                      />
                    );
                  }

                  return (
                    <GridItem
                      key={item.id || item.uuid}
                      clickAction={() => {
                        setSelectContent(item);
                        navigate(`/contents/${item.id || item.uuid}`);
                        setGridModalShow(true);
                      }}
                      {...{ isActive, ...item }}
                    />
                  );
                })}
              </div>
              {(!hasMore && (
                <LoadingMore className="load-more nomore">
                  No other contents
                </LoadingMore>
              )) || (
                <LoadingMore
                  className={
                    loadingMore ? 'load-more loadmoreing' : 'load-more'
                  }
                >
                  loading
                </LoadingMore>
              )}
            </ContentsGridWrapper>
          );
        }
        return null;
      })()}

      <GridModal
        show={gridModalShow}
        favorPendingIds={favorPendingIds}
        closeModal={() => {
          setGridModalShow(false);
        }}
        selectContent={selectContent}
        scoreContent={(currId) => {
          scoreContent(currId);
        }}
        delContent={async (currId) => {
          await delContent(currId);
          setGridModalShow(false);
        }}
        shareAction={() => {
          if (!selectContent) return;
          onShare(selectContent);
        }}
        voteAction={async () => {
          if (!selectContent) return;
          if (selectContent.upVoted) return;
          await vote(selectContent);
          setSelectContent({
            ...selectContent,
            upVoted: true,
            upVoteNum: selectContent.upVoteNum + 1,
          });
        }}
        favorsAction={async () => {
          if (!selectContent) return;
          const favorsAgain = !selectContent.favored;
          await favors(selectContent);
          setSelectContent({
            ...selectContent,
            favored: favorsAgain,
          });
        }}
        hiddenAction={() => {
          if (!selectContent) return;
          hiddenAction(selectContent);
          setGridModalShow(false);
        }}
      />
    </Box>
  );
}
export default Contents;

const Box = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0;
`;
// const Box = styled.div`
//   margin: 0 auto;
//   height: calc(100vh - 72px);
//   box-sizing: border-box;
//   padding: 24px 40px 0 40px;
//   overflow: hidden;
// `;
const ContentsWrapper = styled.div<{ loading?: string }>`
  /* width: calc(100% - 2px);
  height: calc(100% - 94px); */
  /* box-sizing: border-box; */
  border: ${(props) => (props.loading ? 'none' : '1px solid #39424c')};
  background-color: ${(props) => (props.loading ? '' : '#1b1e23')};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  /* margin-top: 24px; */
  flex-grow: 1;

  & .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
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

const ContentsGridWrapper = styled(ListScrollBox)`
  height: 100%;
  overflow: scroll;
  & .list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
`;

const LoadingMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: #fff;
  opacity: 0;
  min-height: 25px;

  &.nomore {
    opacity: 1;
  }

  &.loadmoreing {
    opacity: 1;
  }
`;
