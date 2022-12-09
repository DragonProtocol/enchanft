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

function Contents() {
  const { user, getBindAccount } = useWlUserReact();
  const evmAccount = getBindAccount(AccountType.EVM);

  const queryRef = useRef<{
    keywords: string;
    type: string;
    orderBy: string;
  }>();
  const [currDaylightCursor, setCurrDaylightCursor] = useState('');
  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [daylightContent, setDaylightContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [daylightContentLoading, setDaylightContentLoading] = useState(false);
  const { keysFilter, contentHiddenOrNot } = useContentHidden();
  const [tab, setTab] = useState<'original' | 'readerView'>('readerView');

  const vote = useVoteUp(selectContent?.id, selectContent?.upVoted);

  const favors = userFavored(selectContent?.id, selectContent?.favored);

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
        if (orderBy === OrderBy.FORU) {
          const [dayLightData, { data }] = await Promise.all([
            fetchDaylightData(''),
            fetchContents(
              { keywords, type, orderBy: OrderBy.TRENDING },
              user.token
            ),
          ]);
          setContents([...dayLightData, ...data.data]);
        } else {
          const { data } = await fetchContents(
            { keywords, type, orderBy },
            user.token
          );
          setContents(data.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [currPageNumber, user.token]
  );

  const loadMore = useCallback(
    async (pageNumber: number) => {
      const { keywords, type, orderBy } = queryRef.current;
      try {
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
          setContents([...contents, ...dayLightData, ...data.data]);
        } else {
          const { data } = await fetchContents(
            { keywords, type, orderBy, pageNumber },
            user.token
          );
          setContents([...contents, ...data.data]);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        // TODO
        console.log('load more done');
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

  useEffect(() => {
    if (selectContent?.uid) {
      loadDaylightContent(selectContent.action.linkUrl);
    } else {
      setDaylightContent('');
    }
  }, [selectContent]);

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
        }}
        changeOriginalAction={() => {
          setTab('original');
        }}
        changeReaderViewAction={() => {
          setTab('readerView');
        }}
      />
      {(loading && <div>loading</div>) || (
        <ContentsWrapper>
          <ListBox>
            {contents
              .filter((item) => {
                return !keysFilter.includes(item.uid || item.id);
              })
              .map((item) => {
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
                    }}
                    {...item}
                  />
                );
              })}
            <button
              type="button"
              onClick={() => {
                loadMore(currPageNumber + 1);
                setCurrPageNumber(currPageNumber + 1);
              }}
            >
              More
            </button>
          </ListBox>

          <ContentBox>
            {tab === 'original' && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    alert('TODO');
                  }}
                >
                  install extension
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      selectContent.action?.linkUrl || selectContent.link,
                      '_blank'
                    );
                  }}
                >
                  open in new tab
                </button>
              </div>
            )}
            {tab === 'readerView' &&
              ((daylightContentLoading && <div>loading</div>) ||
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
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(
                            selectContent.action?.linkUrl || selectContent.link,
                            '_blank'
                          );
                        }}
                      >
                        open in new tab
                      </button>
                    </div>
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
  height: 100%;
  box-sizing: border-box;
  padding-top: 24px;
  /* background: #1b1e23; */
  /* color: #ffffff; */
  width: 1160px;
  overflow: hidden;
`;
const ContentsWrapper = styled.div`
  width: 100%;
  height: calc(100% - 74px);
  display: flex;
  margin-top: 24px;
`;
const ListBox = styled.div`
  min-width: 360px;
  width: 360px;
  height: 100%;
  overflow: scroll;
`;
const ContentBox = styled.div`
  height: calc(100% - 40px);
  width: calc(100% - 360px);
  padding: 20px;
  overflow-x: hidden;
  overflow: scroll;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }
`;
