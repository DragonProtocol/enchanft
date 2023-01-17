import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Share } from '../icons/share';
import { EyeClose } from '../icons/eyeClose';
import { Heart } from '../icons/heart';
import Badge from './Badge';
import { defaultFormatDate } from '../../utils/time';
import LinkBox from './LinkBox';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';

export default function ListItem({
  isActive,
  clickAction,
  type,
  id,
  link,
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
  editorScore,
  favorPendingIds,
}: {
  upVoteNum: number;
  id: number;
  title: string;
  type: string;
  link: string;
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
  editorScore?: number;
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
        <ContentItemLeftVoteButton
          disabled={upVoted}
          onClick={(e) => {
            e.stopPropagation();
            if (voteAction) voteAction();
          }}
        >
          👏
          <span>{upVoteNum + (editorScore || 0)}</span>
        </ContentItemLeftVoteButton>
        <div className={isActive ? 'right active' : 'right'}>
          <p>{title}</p>
          <ContentItemTitle>
            <div>
              <Badge text={type} />
              <LinkBox text={link} />
            </div>
            <span>{defaultFormatDate(createdAt)}</span>
          </ContentItemTitle>

          {isActive && (
            <ContentItemActions
              id={id}
              isActive={isActive}
              upVoted={upVoted}
              favored={favored}
              upVoteNum={upVoteNum}
              editorScore={editorScore}
              favorPendingIds={favorPendingIds}
              voteAction={voteAction}
              favorsAction={favorsAction}
              hiddenAction={hiddenAction}
              shareAction={shareAction}
            />
          )}
        </div>
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
  editorScore,
  voteAction,
  favorsAction,
  hiddenAction,
  shareAction,
  favorPendingIds,
  withVote,
}: {
  id: number;
  isActive: boolean;
  editorScore: number;
  upVoteNum: number;
  favored: boolean;
  upVoted: boolean;
  shareAction?: () => void;
  hiddenAction?: () => void;
  voteAction?: () => void;
  favorsAction?: () => void;
  favorPendingIds: (string | number)[];
  withVote?: boolean;
}) {
  const loadingFavor = useMemo(
    () => favorPendingIds.includes(id),
    [favorPendingIds, id]
  );

  return (
    <ContentItemFooter withVote={withVote}>
      {withVote && (
        <ContentHandleButtonVote
          disabled={upVoted}
          onClick={(e) => {
            e.stopPropagation();
            if (voteAction) {
              voteAction();
            }
          }}
        >
          👏 &nbsp;{upVoteNum + (editorScore || 0)}
        </ContentHandleButtonVote>
      )}

      <ContentHandleButton
        disabled={loadingFavor}
        onClick={(e) => {
          e.stopPropagation();
          if (favorsAction) favorsAction();
        }}
      >
        {favored ? <Heart fill="#718096" /> : <Heart />}
      </ContentHandleButton>

      <ContentHandleButton
        onClick={(e) => {
          e.stopPropagation();
          if (hiddenAction) {
            hiddenAction();
          }
        }}
      >
        <EyeClose />
      </ContentHandleButton>

      <ContentHandleButton
        onClick={(e) => {
          e.stopPropagation();
          if (shareAction) shareAction();
        }}
      >
        <Share />
      </ContentHandleButton>
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
      transform: scale(1.05);
    }
  }
`;
const ItemInner = styled.div<{ isActive: boolean; height: string }>`
  line-height: 27px;
  gap: 10px;
  position: relative;
  display: flex;
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

  & div.right {
    width: calc(100% - 62px);
    overflow: hidden;
    > p {
      margin: 0%;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
      opacity: 0.8;

      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    &.active {
      > p {
        display: block;
      }
    }
  }
`;
const ContentItemLeftVoteButton = styled(ButtonPrimaryLine)`
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  > span {
    color: #ffffff;
    font-size: 12px;
    line-height: 14px;
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
    max-width: 160px;
  }

  > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #39424c; */
    border-radius: 12px;
    /* padding: 0 18px; */
    /* height: 32px; */
    /* box-sizing: border-box; */
  }

  & .author {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ContentItemFooter = styled.div<{ withVote: boolean }>`
  display: flex;
  margin-top: 10px;
  gap: 10px;
  justify-content: ${(props) => (props.withVote ? 'start' : 'end')};
`;

const ContentHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;

const ContentHandleButtonVote = styled(ContentHandleButton)`
  width: 190px;
`;
