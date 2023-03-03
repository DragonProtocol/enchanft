/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 17:24:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-03 17:11:31
 * @Description: file description
 */
import styled from 'styled-components';
import type { ContentPageProps } from '../../container/Content';
import Loading from '../common/loading/Loading';
import { MainWrapper } from '../layout/Index';
import ContentActionFavor from './ContentActionFavor';
import ContentActionUpVote from './ContentActionUpVote';
import ContentShowerBox from './ContentShowerBox';

export default function ContentPageMobile({
  // Queries
  id,
  loading,
  data,
  // Mutations
  onVote,
  onFavor,
}: ContentPageProps) {
  return loading ? (
    <StatusWrapper>
      <Loading />
    </StatusWrapper>
  ) : data ? (
    <MainBody>
      <ContentShowerBox selectContent={data} tab="readerView" />
      <Actions>
        <ContentActionUpVote
          number={data.upVoteNum + data.editorScore}
          onClick={() => {
            if (onVote) onVote();
          }}
        />
        <ActionItemLine />
        <ContentActionFavor
          number={data.favorNum ?? 0}
          isFavored={data?.favored}
          onClick={() => {
            if (onFavor) onFavor();
          }}
        />
      </Actions>
    </MainBody>
  ) : (
    <StatusWrapper>The content query with id {id} failed</StatusWrapper>
  );
}

const StatusWrapper = styled(MainWrapper)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
const MainBody = styled.div`
  & > div > div {
    padding: 10px;
    padding-top: 20px;
  }
`;
const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px 0px;
  background: #1b1e23;
`;
const ActionItemLine = styled.span`
  width: 1px;
  height: 10px;
  background: #718096;
`;
