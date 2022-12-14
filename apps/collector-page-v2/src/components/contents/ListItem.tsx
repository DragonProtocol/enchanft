import dayjs from 'dayjs';
import styled from 'styled-components';
import Badge from './Brage';

export default function ListItem({
  isActive,
  clickAction,
  type,
  author,
  createdAt,
  title,
  upVoteNum,
}: {
  upVoteNum: number;
  title: string;
  type: string;
  author: string;
  createdAt: number;
  isActive: boolean;
  clickAction: () => void;
}) {
  return (
    <ContentItem
      className={isActive ? 'active' : ''}
      isActive={isActive}
      onClick={clickAction}
    >
      <p>{title}</p>
      <ContentItemTitle>
        <Badge text={type} />
        <span>{author}</span>
        <span>|</span>
        <span>{dayjs(createdAt).format('MMM DD YYYY')}</span>
      </ContentItemTitle>

      <ContentItemFooter>👏 &nbsp;{upVoteNum}</ContentItemFooter>
    </ContentItem>
  );
}

const ContentItem = styled.div<{ isActive: boolean }>`
  line-height: 27px;
  padding: 20px;
  gap: 10px;
  position: relative;
  border-bottom: 1px solid #39424c;
  flex-direction: column;
  cursor: pointer;
  border-bottom: 1px do lightgray;
  background: inherit;
  color: '#fff';
  &:hover {
    /* background: #999; */
  }
  &.active {
    background: #14171a;
    > p {
      opacity: 1;
    }
    &::after {
      content: ' ';
      top: 0;
      right: 0;
      height: 100%;
      position: absolute;
      width: 2px;
      background-color: #ffffff;
    }
  }
  > p {
    margin: 0%;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    opacity: 0.8;
  }
`;

const ContentItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;

const ContentItemFooter = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
