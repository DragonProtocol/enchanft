/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 15:31:55
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import {
  URLSearchParamsInit,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

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
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../components/animation/AnimatedListItem';
import { MEDIA_BREAK_POINTS } from '../constants';
import ContentOrderBySelect, {
  defaultContentOrderBy,
} from '../components/contents/ContentOrderBySelect';

function Contents() {
  const { user } = useWlUserReact();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUrlQuery = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultContentOrderBy,
      types: searchParams.get('types') || '',
      lang: searchParams.get('lang') || '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );
  const currentSearchParams = useMemo(
    () => ({
      orderBy: currentUrlQuery.orderBy,
      types: currentUrlQuery.types.split(','),
      lang: currentUrlQuery.lang.split(','),
      keywords: currentUrlQuery.keywords,
    }),
    [currentUrlQuery]
  );
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
      const { keywords, types, orderBy, lang } = currentSearchParams;
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
    [currentSearchParams, contents]
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

  useEffect(() => {
    const { keywords, types, orderBy, lang } = currentSearchParams;
    fetchData(keywords, types, orderBy, lang);
  }, [currentSearchParams]);

  const transitions = useAnimatedListTransition(newList);

  const getMore = useCallback(() => {
    if (newList.length === 0) return;
    if (loadingMore) return;
    if (!hasMore) return;
    loadMore(currPageNumber + 1);
    setCurrPageNumber(currPageNumber + 1);
  }, [newList, loadingMore, hasMore, currPageNumber]);

  const renderMoreLoading = useMemo(
    () =>
      loadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : !hasMore ? (
        <MoreLoading>No other contents</MoreLoading>
      ) : null,
    [loadingMore, hasMore]
  );

  return (
    <Box>
      <FeedsMenu
        rightEl={
          <FeedsMenuRight
            displayFilterButton
            isActiveFilter={isActiveFilter}
            onChangeActiveFilter={setIsActiveFilter}
            orderByEl={
              <ContentOrderBySelect
                value={currentSearchParams.orderBy}
                onChange={(value) =>
                  setSearchParams({
                    ...currentUrlQuery,
                    orderBy: value,
                  } as unknown as URLSearchParamsInit)
                }
              />
            }
            searchEl={
              <SearchInput
                debounceMs={1000}
                onSearch={(value) => {
                  setSearchParams({
                    ...currentUrlQuery,
                    keywords: value,
                  } as unknown as URLSearchParamsInit);
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
              values={currentSearchParams}
              filterAction={(data) => {
                setSearchParams({
                  ...currentUrlQuery,
                  types: data.types.join(','),
                  lang: data.lang.join(','),
                });
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
              <ListBox onScrollBottom={getMore}>
                {transitions((styles, item, transition, idx) => {
                  let isActive = false;
                  if (item.id) {
                    isActive = item.id === selectContent?.id;
                  } else {
                    isActive = item.uuid === selectContent?.uuid;
                  }
                  return (
                    <AnimatedListItem
                      key={item.id || item.uuid}
                      styles={{ ...styles }}
                    >
                      {item.hidden ? (
                        <ListItemHidden
                          isActive={isActive}
                          hidden
                          undoAction={() => undoHiddenAction(idx)}
                        />
                      ) : (
                        <ListItem
                          isActive={isActive}
                          favorPendingIds={favorPendingIds}
                          clickAction={() => {
                            setSelectContent(item);
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
                      )}
                    </AnimatedListItem>
                  );
                })}
                {renderMoreLoading}
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
            <GrideListBox onScrollBottom={getMore}>
              <ContentsGridWrapper>
                {transitions((styles, item, transition, idx) => {
                  let isActive = false;
                  if (item.id) {
                    isActive = item.id === selectContent?.id;
                  } else {
                    isActive = item.uuid === selectContent?.uuid;
                  }
                  return (
                    <AnimatedListItem
                      key={item.id || item.uuid}
                      styles={{ ...styles }}
                    >
                      {item.hidden ? (
                        <GridItemHidden
                          isActive={isActive}
                          hidden
                          undoAction={() => undoHiddenAction(idx)}
                        />
                      ) : (
                        <GridItem
                          clickAction={() => {
                            setSelectContent(item);
                            navigate(`/contents/${item.id || item.uuid}`);
                            setGridModalShow(true);
                          }}
                          {...{ isActive, ...item }}
                        />
                      )}
                    </AnimatedListItem>
                  );
                })}
              </ContentsGridWrapper>
              {renderMoreLoading}
            </GrideListBox>
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
const GrideListBox = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const ContentsGridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 4) / 5), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 3) / 4), 1fr));
  }
`;

const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
