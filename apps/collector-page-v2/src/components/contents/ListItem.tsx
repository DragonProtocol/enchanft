import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Share } from '../icons/share';
import { EyeClose } from '../icons/eyeClose';
import { Heart } from '../icons/heart';
import Badge from './Badge';
import { defaultFormatDate } from '../../utils/time';

export default function ListItem({
  isActive,
  clickAction,
  type,
  id,
  author,
  createdAt,
  title,
  upVoteNum,
  voteAction,
  favorsAction,
  favored,
  upVoted,
  hidden,
  hiddenAction,
  shareAction,
  adminScore,
  favorPendingIds,
}: {
  upVoteNum: number;
  id: number;
  title: string;
  type: string;
  author: string;
  createdAt: number;
  isActive: boolean;
  hidden?: boolean;
  clickAction: () => void;
  voteAction?: () => void;
  upVoted?: boolean;
  favorsAction?: () => void;
  favored?: boolean;
  hiddenAction?: () => void;
  shareAction?: () => void;
  adminScore?: number;
  favorPendingIds?: (string | number)[];
}) {
  const itemRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState('fit-content');
  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientHeight } = itemRef.current;
      setHeight(`${clientHeight}px`);
      setTimeout(() => {
        setClassNames('active hidden');
      }, 50);
    }
    if (isActive) {
      setClassNames('active');
    } else {
      setClassNames('');
    }
  }, [hidden, isActive]);

  return (
    <ContentItem ref={itemRef} className={classNames} onClick={clickAction}>
      <ItemInner isActive={isActive} height={height}>
        <p>{title}</p>
        <ContentItemTitle>
          <div>
            <Badge text={type} />
            <span>{defaultFormatDate(createdAt)}</span>
          </div>
          {!isActive && <span>👏 &nbsp;{upVoteNum + (adminScore || 0)}</span>}
        </ContentItemTitle>

        {isActive && (
          <ContentItemActions
            id={id}
            isActive={isActive}
            upVoted={upVoted}
            favored={favored}
            upVoteNum={upVoteNum}
            adminScore={adminScore}
            favorPendingIds={favorPendingIds}
            voteAction={voteAction}
            favorsAction={favorsAction}
            hiddenAction={hiddenAction}
            shareAction={shareAction}
          />
        )}
      </ItemInner>
    </ContentItem>
  );
}

export function ContentItemActions({
  id,
  isActive,
  upVoted,
  favored,
  upVoteNum,
  adminScore,
  voteAction,
  favorsAction,
  hiddenAction,
  shareAction,
  favorPendingIds,
}: {
  id: number;
  isActive: boolean;
  adminScore: number;
  upVoteNum: number;
  favored: boolean;
  upVoted: boolean;
  shareAction?: () => void;
  hiddenAction?: () => void;
  voteAction?: () => void;
  favorsAction?: () => void;
  favorPendingIds: (string | number)[];
}) {
  const loadingFavor = useMemo(
    () => favorPendingIds.includes(id),
    [favorPendingIds, id]
  );

  return (
    <ContentItemFooter>
      <span
        className={
          isActive ? (upVoted ? 'vote disable' : 'vote') : 'vote active'
        }
        onClick={(e) => {
          e.stopPropagation();
          if (voteAction) {
            voteAction();
          }
        }}
      >
        👏 &nbsp;{upVoteNum + (adminScore || 0)}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          if (favorsAction) favorsAction();
        }}
        className={loadingFavor ? 'disable' : ''}
      >
        {favored ? <Heart fill="#718096" /> : <Heart />}
      </span>

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

      <span
        onClick={(e) => {
          e.stopPropagation();
          if (shareAction) shareAction();
        }}
      >
        <Share />
      </span>
    </ContentItemFooter>
  );
}

export function ListItemHidden({
  undoAction,
  isActive,
  hidden,
}: {
  undoAction: () => void;
  isActive: boolean;
  hidden?: boolean;
}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [height, setHeight] = useState('fit-content');
  const itemRef = useRef<HTMLDivElement>();

  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientHeight } = itemRef.current;
      setHeight(`${clientHeight}px`);

      timerRef.current = setTimeout(() => {
        setClassNames('active hidden');
      }, 3050);
    }
    if (isActive) {
      setClassNames('active');
    } else {
      setClassNames('');
    }
  }, [hidden, isActive]);

  return (
    <ContentItem className={classNames} ref={itemRef}>
      <ItemInner isActive height={height}>
        <div className="tint">
          😊 Thanks, We will use this to make your list better.{' '}
          <span
            onClick={() => {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              undoAction();
            }}
          >
            Undo
          </span>
        </div>
      </ItemInner>
    </ContentItem>
  );
}

const ContentItem = styled.div`
  box-sizing: border-box;
  padding: 20px;
  gap: 10px;
  border-bottom: 1px solid #39424c;
  cursor: pointer;
  border-bottom: 1px do lightgray;
  background: inherit;
  &:hover {
    & > * {
      transform: scale(1.1);
    }
  }
`;
const ItemInner = styled.div<{ isActive: boolean; height: string }>`
  line-height: 27px;
  gap: 10px;
  position: relative;
  flex-direction: column;
  transition: all 0.3s;
  color: '#fff';
  &:hover {
    /* background: #999; */
  }
  &.active {
    background: #14171a;
    transition: all 0.5s ease-out;
    height: ${(props) => props.height};
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
    &.hidden {
      font-size: 0;
      margin-top: 0;
      margin-bottom: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
      height: 0;
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
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;

  > div {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #39424c;
    border-radius: 12px;
    padding: 0 18px;
    height: 32px;
    box-sizing: border-box;
  }

  & .author {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ContentItemFooter = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  margin-top: 10px;
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
    cursor: pointer;

    &.disable {
      cursor: not-allowed;
    }
  }

  & span.vote {
    width: 190px;
    &.active {
      width: 100px;
    }
  }
`;
