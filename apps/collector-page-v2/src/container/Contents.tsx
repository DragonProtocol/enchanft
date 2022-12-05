/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 14:57:46
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import ContentsHeader from '../components/contents/Header';
import { RouteKey } from '../route/routes';
import useRoute from '../route/useRoute';

import { fetchContents } from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';

function Contents() {
  const navigate = useNavigate();
  const { user } = useWlUserReact();
  const { lastRouteMeta } = useRoute();
  const params = useParams();
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [selectContent, setSelectContent] = useState<ContentListItem>();
  const [loading, setLoading] = useState(true);
  const [currPageSize, setCurrPageSize] = useState(0);

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

  const contentValue = useMemo(() => {
    if (!selectContent?.value) return '';
    try {
      const content = JSON.parse(selectContent?.value);
      return content.content;
    } catch (error) {
      return selectContent?.value;
    }
  }, [selectContent]);

  return (
    <Box id="box">
      <ContentsHeader
        filterAction={(keywords: string, type: string, orderBy: string) => {
          fetchData(keywords, type, orderBy);
        }}
      />
      {(loading && <div>loading</div>) || (
        <ContentsWrapper>
          <ListBox>
            {contents.map((item) => (
              <ContentItem
                key={item.id}
                isActive={item.id === selectContent?.id}
                onClick={() => {
                  setSelectContent(item);
                }}
              >
                <ContentItemTitle>
                  <span>{item.type}</span>
                  <span>{item.author}</span>
                  <span>Date</span>
                </ContentItemTitle>
                <p>{item.title}</p>
                <ContentItemFooter>up:{item.upVoteNum}</ContentItemFooter>
              </ContentItem>
            ))}
          </ListBox>

          <ContentBox>
            {selectContent && (
              <>
                <ContentTitle>
                  <div>{selectContent?.title}</div>
                  <div>{selectContent?.author}</div>
                </ContentTitle>
                <ContentBody
                  dangerouslySetInnerHTML={{ __html: contentValue }}
                />
              </>
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
  height: calc(100vh - 92px);
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
const ContentTitle = styled.div`
  border-bottom: 1px dotted gray;
  > div {
    &:first-child {
      font-size: 25px;
    }
  }
`;
const ContentBody = styled.div``;

const ContentItem = styled.div<{ isActive: boolean }>`
  line-height: 27px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-bottom: 1px do lightgray;
  background: ${(props) => (props.isActive ? '#000' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  &:hover {
    background: #999;
  }
`;

const ContentItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  & span {
    &:first-child {
      border: 1px solid gray;
    }
    &:last-child {
      flex-grow: 1;
      text-align: end;
    }
  }
`;

const ContentItemFooter = styled.div`
  display: flex;
`;
