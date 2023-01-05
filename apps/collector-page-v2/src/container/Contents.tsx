/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 17:19:57
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import ContentsHeader from '../components/contents/Header';

import ListItem, { ListItemHidden } from '../components/contents/ListItem';
import {
  complete,
  fetchContents,
  personalComplete,
  updateContent,
} from '../services/api/contents';
import {
  ContentLang,
  ContentListItem,
  ContentStatus,
} from '../services/types/contents';
import userFavored from '../hooks/useFavored';
import { useVoteUp } from '../hooks/useVoteUp';
import Loading from '../components/common/loading/Loading';
import { getProjectShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';
import ListScrollBox from '../components/common/box/ListScrollBox';
import ConfirmModal from '../components/contents/ConfirmModal';
import ContentShowerBox, {
  ContentBoxContainer,
} from '../components/contents/ContentShowerBox';
import useContentHandles from '../hooks/useContentHandles';
import { MainWrapper } from '../components/layout/Index';
import FeedsMenu from '../components/layout/FeedsMenu';

function Contents() {
  const { user, getBindAccount } = useWlUserReact();
  const navigate = useNavigate();
  const { id } = useParams();

  const queryRef = useRef<{
    keywords: string;
    type: string;
    orderBy: string;
    lang: string;
  }>({
    keywords: '',
    type: '',
    orderBy: 'For U',
    lang: ContentLang.All,
  });
  const removeTimer = useRef<NodeJS.Timeout>();

  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    onFavor: favors,
    onVote: vote,
    onHidden: hiddenData,
    formatCurrentContents,
  } = useContentHandles();

  const onShare = (data: ContentListItem) => {
    tweetShare(data.title, getProjectShareUrl(data.id));
  };

  const fetchData = useCallback(
    async (keywords: string, type: string, orderBy: string, lang: string) => {
      setLoading(true);
      setContents([]);
      setSelectContent(undefined);
      if (type.toLowerCase() === 'all') {
        type = '';
      }

      try {
        let tmpData: ContentListItem[] = [];
        const { data } = await fetchContents(
          { keywords, type, orderBy, contentId: id, lang },
          user.token
        );
        tmpData = data.data;
        setContents(tmpData);
        if (id !== ':id' && id) {
          const itemData = tmpData.find(
            (item) => `${item.id}` === id || item.uuid === id
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
      const { keywords, type, orderBy, lang } = queryRef.current;
      try {
        setLoadingMore(true);
        const { data } = await fetchContents(
          { keywords, type, orderBy, pageNumber, lang },
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
    (idx: number) => {
      removeTimer.current = setTimeout(() => {
        if (idx === -1) return;

        const dataItem = contents[idx];
        clearTimeout(removeTimer.current);
        removeTimer.current = undefined;
        hiddenData(dataItem);
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
      }, 3250);
    },
    [contents, hiddenData]
  );

  const scoreContent = useCallback(
    async (editId: number) => {
      if (updating) return;
      setUpdating(true);
      try {
        await updateContent({ id: editId, adminScore: 10 }, user.token);
        toast.success('score content success!!!');
        const idx = contents.findIndex((item) => {
          if (item?.id && item.id === editId) return true;
          return false;
        });
        const curr = contents[idx];
        curr.adminStore = (curr.adminStore || 0) + 10;

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
    [user.token, updating]
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
    fetchData('', '', 'For U', ContentLang.All);
  }, []);

  return (
    <Box>
      <FeedsMenu />
      <ContentsHeader
        filterAction={(
          keywords: string,
          type: string,
          orderBy: string,
          lang: string
        ) => {
          queryRef.current = {
            keywords,
            type,
            orderBy,
            lang,
          };
          fetchData(keywords, type, orderBy, lang);
          navigate('/contents/:id');
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
            {formatCurrentContents(contents).map((item, idx) => {
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
                    undoAction={() => {
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
                    }}
                  />
                );
              }

              return (
                <ListItem
                  key={item.id || item.uuid}
                  isActive={isActive}
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
                    setContents([
                      ...contents.slice(0, idx),
                      {
                        ...contents[idx],
                        hidden: true,
                      },
                      ...contents.slice(idx + 1),
                    ]);
                    removeContent(idx);
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
                <div className="loading">loading</div>
              </div>
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
      )}
      <ConfirmModal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        confirmAction={() => {
          try {
            const idx = contents.findIndex((item) => {
              if (item?.uuid && item?.uuid === selectContent?.uuid) return true;
              if (item?.id && item.id === selectContent.id) return true;
              return false;
            });

            setContents([
              ...contents.slice(0, idx),
              {
                ...contents[idx],
                hidden: true,
              },
              ...contents.slice(idx + 1),
            ]);
            removeContent(idx);
            setShowModal(false);
          } catch (error) {
            toast.error(error.message);
          }
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
