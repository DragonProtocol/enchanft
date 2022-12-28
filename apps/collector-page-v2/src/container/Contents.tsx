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
  contentParse,
  fetchContents,
  personalComplete,
} from '../services/api/contents';
import {
  ContentLang,
  ContentListItem,
  OrderBy,
} from '../services/types/contents';
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
import { selectWebsite } from '../features/website/websiteSlice';
import { useAppSelector } from '../store/hooks';
import ConfirmModal from '../components/contents/ConfirmModal';

function Contents() {
  const { user, getBindAccount } = useWlUserReact();
  const evmAccount = getBindAccount(AccountType.EVM);
  const navigate = useNavigate();
  const { id } = useParams();
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);

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
  const [daylightContent, setDaylightContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [daylightContentLoading, setDaylightContentLoading] = useState(false);
  const [tab, setTab] = useState<'original' | 'readerView'>(
    u3ExtensionInstalled ? 'original' : 'readerView'
  );
  const [showModal, setShowModal] = useState(false);

  const vote = useVoteUp(
    selectContent?.uuid || selectContent?.id,
    selectContent?.upVoted
  );

  const favors = userFavored(
    selectContent?.uuid || selectContent?.id,
    selectContent?.favored
  );

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
          if (itemData?.supportReaderView === false) {
            loadDaylightContent(itemData.link);
          }
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

  const loadDaylightContent = useCallback(async (url: string) => {
    setDaylightContent('');
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

  useEffect(() => {
    fetchData('', '', 'For U', ContentLang.All);
  }, []);

  return (
    <Box id="box">
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
            {contents.map((item, idx) => {
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
                    if (item?.supportReaderView === false) {
                      loadDaylightContent(item.link);
                    } else {
                      setDaylightContent('');
                    }
                  }}
                  shareAction={() => {
                    onShare(item);
                  }}
                  voteAction={async () => {
                    try {
                      const voteSuccess = await vote();
                      if (selectContent.upVoted) return;
                      if (voteSuccess) {
                        setSelectContent({
                          ...selectContent,
                          upVoteNum: selectContent.upVoteNum + 1,
                          upVoted: true,
                        });
                        setContents([
                          ...contents.slice(0, idx),
                          {
                            ...contents[idx],
                            upVoteNum: contents[idx].upVoteNum + 1,
                            upVoted: true,
                          },
                          ...contents.slice(idx + 1),
                        ]);
                      }
                    } catch (error) {
                      toast.error(error.message);
                    }
                  }}
                  favorsAction={async () => {
                    try {
                      const favorsSuccess = await favors();
                      if (selectContent.favored) return;
                      if (favorsSuccess) {
                        setSelectContent({
                          ...selectContent,
                          favored: true,
                        });
                        setContents([
                          ...contents.slice(0, idx),
                          {
                            ...contents[idx],
                            favored: true,
                          },
                          ...contents.slice(idx + 1),
                        ]);
                      }
                    } catch (error) {
                      toast.error(error.message);
                    }
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
                url={selectContent.link}
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
                  (((selectContent.supportReaderView || daylightContent) && (
                    <ContentShower
                      {...selectContent}
                      content={daylightContent || contentValue}
                    />
                  )) || (
                    <ExtensionSupport
                      url={selectContent.link}
                      title={selectContent.title}
                      msg="Reader view is not supported for this page! Please view it in new tab."
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
              setDaylightContent('');
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
                if (item?.supportReaderView === false) {
                  loadDaylightContent(item.link);
                }
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

const Box = styled.div`
  margin: 0 auto;
  height: calc(100vh - 72px);
  box-sizing: border-box;
  padding: 24px 40px 0 40px;
  overflow: hidden;
`;
const ContentsWrapper = styled.div<{ loading?: string }>`
  width: calc(100% - 2px);
  height: calc(100% - 94px);
  box-sizing: border-box;
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
