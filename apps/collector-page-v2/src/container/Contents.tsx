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
  complete,
  fetchContents,
  personalComplete,
} from '../services/api/contents';
import { ContentLang, ContentListItem } from '../services/types/contents';
import ListItem from '../components/contents/ListItem';
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

  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const {
    onFavor: favors,
    onVote: vote,
    formatCurrentContents,
  } = useContentHandles();

  const hiddenContent = useCallback(
    async (uuid: string | number) => {
      if (Number.isNaN(Number(uuid))) {
        await personalComplete(`${uuid}`, user.token);
      } else {
        await complete(Number(uuid), user.token);
      }
    },
    [user.token]
  );

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

  useEffect(() => {
    fetchData('', '', 'For U', ContentLang.All);
  }, []);

  return (
    <Box>
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
                    vote(selectContent);
                  }}
                  favorsAction={() => {
                    favors(selectContent);
                  }}
                  hiddenAction={() => {
                    setShowModal(true);
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
            <ContentShowerBox selectContent={selectContent} />
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
            hiddenContent(selectContent?.uuid || selectContent.id);
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
            setTimeout(() => {
              setContents([
                ...contents.slice(0, idx),
                ...contents.slice(idx + 1),
              ]);
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
            }, 550);

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
  /* gap: 20px; */
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
// const ContentBox = styled.div`
//   height: calc(100%);
//   width: calc(100% - 360px);

//   overflow-x: hidden;
//   overflow: hidden;

//   & img {
//     max-width: 100%;
//   }

//   & pre {
//     overflow: scroll;
//   }

//   & div.tabs {
//     height: 60px;
//     background: #1b1e23;
//     border-bottom: 1px solid #39424c;
//     box-sizing: border-box;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     > div {
//       width: 260px;
//       height: 40px;
//       background: #14171a;
//       border-radius: 100px;
//       padding: 4px;
//       box-sizing: border-box;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       > button {
//         cursor: pointer;
//         width: 122px;
//         height: 32px;
//         border: none;

//         box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
//           0px 0px 4px rgba(20, 23, 26, 0.04);
//         border-radius: 100px;
//         outline: none;
//         background: inherit;
//         color: #a0aec0;

//         &.active {
//           color: #ffffff;
//           background: #21262c;
//         }
//       }
//     }
//   }
// `;

// const LoadingBox = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-top: 40px;
// `;
