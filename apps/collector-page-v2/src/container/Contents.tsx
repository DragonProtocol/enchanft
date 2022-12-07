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
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import ContentsHeader from '../components/contents/Header';
// import useRoute from '../route/useRoute';

import {
  fetchContents,
  voteContent,
  favorsContent,
} from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';
import { addOrRemoveFromLocal, getLocalData } from '../utils/contentStore';
import ListItem from '../components/contents/ListItem';
import ContentShower from '../components/contents/ContentShower';

function Contents() {
  // const navigate = useNavigate();
  const { user } = useWlUserReact();
  // const { lastRouteMeta } = useRoute();
  // const params = useParams();
  const queryRef = useRef<{
    keywords: string;
    type: string;
    orderBy: string;
  }>();
  const currPageSize = useRef(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [localData, setLocalData] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  const seeOrHidden = useCallback((id: number) => {
    const data = addOrRemoveFromLocal(id);
    setLocalData(data);
    setSelectContent(undefined);
  }, []);

  const vote = useCallback(async () => {
    if (!selectContent) return;
    if (selectContent.upVoted) return;
    await voteContent(selectContent.id, user.token);
  }, [user.token, selectContent?.id]);

  const favors = useCallback(async () => {
    if (!selectContent) return;
    if (selectContent.favored) return;
    await favorsContent(selectContent.id, user.token);
  }, [user.token, selectContent?.id]);

  const fetchData = useCallback(
    async (keywords: string, type: string, orderBy: string) => {
      setLoading(true);
      setContents([]);
      setSelectContent(undefined);
      if (type.toLowerCase() === 'all') {
        type = '';
      }
      try {
        const { data } = await fetchContents(
          { keywords, type, orderBy },
          user.token
        );
        setContents(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [currPageSize, user.token]
  );

  const loadMore = useCallback(
    async (pageSize: number) => {
      const { keywords, type, orderBy } = queryRef.current;
      try {
        const { data } = await fetchContents(
          { keywords, type, orderBy, pageSize },
          user.token
        );
        setContents([...contents, ...data.data]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        // TODO
        console.log('load more done');
      }
    },
    [queryRef.current, contents]
  );

  const contentValue = useMemo(() => {
    if (!selectContent?.value) return '';
    try {
      const content = JSON.parse(selectContent?.value);
      return content.content;
    } catch (error) {
      return selectContent?.value;
    }
  }, [selectContent]);

  const keysFilter = useMemo(() => {
    return Object.values(localData);
  }, [localData]);

  useEffect(() => {
    const data = getLocalData();
    setLocalData(data);
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
        }}
      />
      {(loading && <div>loading</div>) || (
        <ContentsWrapper>
          <ListBox>
            {contents
              .filter((item) => {
                return !keysFilter.includes(item.id);
              })
              .map((item) => (
                <ListItem
                  key={item.id}
                  isActive={item.id === selectContent?.id}
                  clickAction={() => {
                    setSelectContent(item);
                  }}
                  {...item}
                />
              ))}
            <button
              type="button"
              onClick={() => {
                currPageSize.current += 1;
                loadMore(currPageSize.current);
              }}
            >
              More
            </button>
          </ListBox>

          <ContentBox>
            {selectContent && (
              <ContentShower
                {...selectContent}
                content={contentValue}
                voteAction={vote}
                favorsActions={favors}
                hiddenAction={() => {
                  seeOrHidden(selectContent.id);
                }}
              />
            )}
          </ContentBox>
        </ContentsWrapper>
      )}
    </Box>
  );
}
export default Contents;

const Box = styled.div`
  height: 100%;
  width: calc(100vw - 240px);
  overflow: hidden;
`;
const ContentsWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;
const ListBox = styled.div`
  flex: 1;
  min-width: 500px;
  height: calc(100vh - 162px);
  overflow: scroll;
`;
const ContentBox = styled.div`
  flex: 2;
  height: calc(100vh - 180px);
  padding: 10px;
  overflow-x: hidden;
  overflow: scroll;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }
`;
