import dayjs from 'dayjs';
import styled from 'styled-components';
import { Share } from '../icons/share';
import { EyeClose } from '../icons/eyeClose';
import { Heart } from '../icons/heart';
import Badge from './Badge';

export default function ListItem({
  isActive,
  clickAction,
  type,
  author,
  createdAt,
  title,
  upVoteNum,
  voteAction,
  favorsAction,
  favored,
  hiddenAction,
  shareAction,
}: {
  upVoteNum: number;
  title: string;
  type: string;
  author: string;
  createdAt: number;
  isActive: boolean;
  clickAction: () => void;
  voteAction?: () => void;
  favorsAction?: () => void;
  favored?: boolean;
  hiddenAction?: () => void;
  shareAction?: () => void;
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

      <ContentItemFooter>
        {isActive && (
          <span
            className={isActive ? 'vote' : 'vote active'}
            onClick={(e) => {
              e.stopPropagation();
              if (voteAction) {
                voteAction();
              }
            }}
          >
            👏 &nbsp;{upVoteNum}
          </span>
        )}
        {isActive && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (favorsAction) favorsAction();
            }}
          >
            {favored ? <Heart fill="#718096" /> : <Heart />}
          </span>
        )}
        {isActive && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (hiddenAction) {
                hiddenAction();
              }
            }}
          >
            <EyeClose />
          </span>
        )}
        {isActive && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (shareAction) shareAction();
            }}
          >
            <Share />
          </span>
        )}
      </ContentItemFooter>
    </ContentItem>
  );
}

export function ListItemHidden({ undoAction }: { undoAction: () => void }) {
  return (
    <ContentItem isActive={false}>
      <div className="tint">
        😊 Thanks, We will use this to make your list better.{' '}
        <span onClick={undoAction}>Undo</span>
      </div>
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

  & .tint {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #718096;
    & span {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;

      color: #ffffff;
    }
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
  gap: 10px;

  & span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #39424c;
    border-radius: 12px;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
  }

  & span.vote {
    width: 190px;
    &.active {
      width: 100px;
    }
  }
`;
