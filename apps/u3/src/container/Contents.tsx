/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-30 18:30:14
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePermissions, useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import {
  URLSearchParamsInit,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { fetchContents, updateContent } from '../services/api/contents';
import { ContentLang, ContentListItem } from '../services/types/contents';
import Loading from '../components/common/loading/Loading';
import ListScrollBox from '../components/common/box/ListScrollBox';
import { ContentBoxContainer } from '../components/contents/ContentShowerBox';
import useContentHandles from '../hooks/useContentHandles';
import { MainWrapper } from '../components/layout/Index';
import FeedsMenu from '../components/layout/FeedsMenu';
import GridModal from '../components/contents/GridModal';
import FeedsMenuRight, { Layout } from '../components/layout/FeedsMenuRight';
import FeedsFilterBox from '../components/layout/FeedsFilterBox';
import Filter from '../components/contents/Filter';
import SearchInput from '../components/common/input/SearchInput';
import NoResult from '../components/common/NoResult';
import ContentOrderBySelect, {
  defaultContentOrderBy,
} from '../components/contents/ContentOrderBySelect';
import {
  getContentsLayoutFromLocal,
  setContentsLayoutToLocal,
} from '../utils/localLayout';
import ContentList from '../components/contents/ContentList';
import ContentGridList from '../components/contents/ContentGridList';
import useAdminContentHandles from '../hooks/useAdminContentHandles';
import ContentPreview from '../components/contents/ContentPreview';
import { ButtonPrimaryLine } from '../components/common/button/ButtonBase';

const NEWEST_CONTENT_ID_KEY = 'NEWEST_CONTENT_ID';
function getNewestContentIdForStore(): number {
  return Number(localStorage.getItem(NEWEST_CONTENT_ID_KEY));
}

function setNewestContentIdToStore(id: number) {
  localStorage.setItem(NEWEST_CONTENT_ID_KEY, String(id));
}

function Contents() {
  const { user } = useWlUserReact();
  const { isAdmin } = usePermissions();
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

  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContentId, setSelectContentId] = useState<string | number>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [layout, setLayout] = useState(getContentsLayoutFromLocal());
  const [gridModalShow, setGridModalShow] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(false);

  const [hasNewest, setHasNewest] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const oldId = getNewestContentIdForStore();
        const { data } = await fetchContents({
          orderBy: 'NEWEST',
          pageSize: 1,
          pageNumber: 0,
        });
        if (data.code === 0) {
          const newId = data.data[0]?.id;
          if (newId !== oldId) {
            setHasNewest(true);
          }
          setNewestContentIdToStore(newId);
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, []);

  const {
    votePendingIds,
    onVote,
    favorPendingIds,
    onFavor,
    hiddenPendingIds,
    onHiddenAction,
    onHiddenUndoAction,
    onShare,
  } = useContentHandles(contents, setContents);

  const { onAdminScore, onAdminDelete } = useAdminContentHandles(
    contents,
    setContents
  );

  const selectContent = useMemo(() => {
    return contents.find(
      (item) => item?.id === selectContentId || item?.uuid === selectContentId
    );
  }, [contents, selectContentId]);

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
      setSelectContentId(undefined);

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
          setSelectContentId(itemData?.id || itemData?.uuid);
        } else if (tmpData.length > 0) {
          setSelectContentId(tmpData[0]?.id || tmpData[0]?.uuid);
        }
        if (orderBy === 'NEWEST') {
          setHasNewest(false);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [currPageNumber, user.token, id]
  );
  const loadMore = useCallback(async () => {
    const pageNumber = currPageNumber + 1;
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
      setCurrPageNumber(pageNumber);
    } catch (error) {
      toast.error(error.message);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [currentSearchParams, contents, currPageNumber]);

  useEffect(() => {
    const { keywords, types, orderBy, lang } = currentSearchParams;
    fetchData(keywords, types, orderBy, lang);
  }, [currentSearchParams]);

  const getMore = useCallback(() => {
    if (loadingMore) return;
    if (!hasMore) return;
    loadMore();
  }, [loadingMore, hasMore, loadMore]);

  const renderMoreLoading = useMemo(
    () =>
      loadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : !hasMore ? (
        <MoreLoading>No other contents</MoreLoading>
      ) : null,
    [loadingMore, hasMore]
  );

  useEffect(() => {
    if (id && id !== ':id' && selectContent && layout === Layout.GRID) {
      setGridModalShow(true);
    }
  }, [id, selectContent, layout]);
  return (
    <Box>
      <FeedsMenu
        rightEl={
          <FeedsMenuRight
            displayFilterButton
            isActiveFilter={isActiveFilter}
            onChangeActiveFilter={setIsActiveFilter}
            orderByEl={
              <>
                <ContentOrderBySelect
                  value={currentSearchParams.orderBy}
                  onChange={(value) =>
                    setSearchParams({
                      ...currentUrlQuery,
                      orderBy: value,
                    } as unknown as URLSearchParamsInit)
                  }
                />
                <NewestButton
                  isActive={currentUrlQuery.orderBy === 'NEWEST'}
                  onClick={() => {
                    setSearchParams({
                      ...currentUrlQuery,
                      orderBy: 'NEWEST',
                    } as unknown as URLSearchParamsInit);
                  }}
                >
                  Mempool
                  {hasNewest && <HasNewestTag />}
                </NewestButton>
              </>
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
              setContentsLayoutToLocal(l);
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
        if (contents.length === 0) {
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
                <ContentList
                  data={contents}
                  activeId={selectContentId}
                  loadingVoteIds={votePendingIds}
                  loadingFavorIds={favorPendingIds}
                  loadingHiddenIds={hiddenPendingIds}
                  onVote={onVote}
                  onFavor={onFavor}
                  onShare={onShare}
                  onHidden={onHiddenAction}
                  onHiddenUndo={onHiddenUndoAction}
                  onItemClick={(item) => {
                    setSelectContentId(item?.id || item?.uuid);
                  }}
                />
                {renderMoreLoading}
              </ListBox>
              <ContentBoxContainer>
                {selectContent && (
                  <ContentPreview
                    data={selectContent}
                    showAdminOps={!selectContent.isForU && isAdmin}
                    onAdminScore={() => {
                      onAdminScore(selectContent);
                    }}
                    onAdminDelete={() => {
                      onAdminDelete(selectContent);
                    }}
                  />
                )}
              </ContentBoxContainer>
            </ContentsWrapper>
          );
        }
        if (layout === Layout.GRID) {
          return (
            <GrideListBox onScrollBottom={getMore}>
              <ContentGridList
                data={contents}
                activeId={selectContent?.uuid || selectContent?.id}
                onHiddenUndo={onHiddenUndoAction}
                onItemClick={(item) => {
                  setSelectContentId(item?.id || item?.uuid);
                  setGridModalShow(true);
                }}
              />
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
        onAdminScore={() => {
          onAdminScore(selectContent);
        }}
        onAdminDelete={() => {
          onAdminDelete(selectContent).then(() => {
            setGridModalShow(false);
          });
        }}
        shareAction={() => {
          if (!selectContent) return;
          onShare(selectContent);
        }}
        voteAction={async () => {
          if (!selectContent) return;
          if (selectContent.upVoted) return;
          await onVote(selectContent);
        }}
        favorsAction={async () => {
          if (!selectContent) return;
          await onFavor(selectContent);
        }}
        hiddenAction={() => {
          if (!selectContent) return;
          onHiddenAction(selectContent);
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

const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
const NewestButton = styled(ButtonPrimaryLine)<{ isActive?: boolean }>`
  height: 40px;
  border-radius: 100px;
  position: relative;
  ${({ isActive }) =>
    isActive &&
    `
    background: #718096;
    transition: all 0.3s ease-out;
    color: #14171A;
  `}
  &:not(:disabled):hover {
    ${({ isActive }) =>
      isActive &&
      `
        background: #718096;
        color: #14171A;
      `}
  }
`;
const HasNewestTag = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff0000;
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%);
`;
