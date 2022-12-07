import dayjs from 'dayjs';
import styled from 'styled-components';

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
    <ContentItem isActive={isActive} onClick={clickAction}>
      <ContentItemTitle>
        <span>{type}</span>
        <span>{author}</span>
        <span>{dayjs(createdAt).format('DD/MM/YYYY')}</span>
      </ContentItemTitle>
      <p>{title}</p>
      <ContentItemFooter>up:{upVoteNum}</ContentItemFooter>
    </ContentItem>
  );
}

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
