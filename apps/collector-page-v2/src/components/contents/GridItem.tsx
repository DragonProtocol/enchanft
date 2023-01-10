import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../constants';
import { defaultFormatDate } from '../../utils/time';
import LinkBox from './LinkBox';
import Badge from './Badge';

export function GridItemHidden({
  undoAction,
  isActive,
  hidden,
}: {
  undoAction: () => void;
  isActive: boolean;
  hidden?: boolean;
}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [width, setWidth] = useState('fit-content');
  const itemRef = useRef<HTMLDivElement>();

  const [classNames, setClassNames] = useState('');
  useEffect(() => {
    if (hidden) {
      const { clientWidth } = itemRef.current;
      setWidth(`${clientWidth}px`);

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
    <Box ref={itemRef} isActive width={width} className={classNames}>
      <div className="tint">
        <div> 😊 Thanks, We will use this to make your list better. </div>
        <br />
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
    </Box>
  );
}

export default function GridItem({
  type,
  link,
  createdAt,
  title,
  upVoteNum,
  isActive,
  clickAction,
}: {
  upVoteNum: number;
  title: string;
  type: string;
  link: string;
  createdAt: number;
  isActive: boolean;
  clickAction?: () => void;
}) {
  return (
    <Box
      onClick={() => {
        if (clickAction) clickAction();
      }}
    >
      <div className="content">
        <h2>{title}</h2>
        <div className="tags">
          <Badge text={type} />
          <LinkBox text={link} />
        </div>
        <div className="date">{defaultFormatDate(createdAt)}</div>
        <div className="footer">👏 &nbsp;{upVoteNum}</div>
      </div>
    </Box>
  );
}

const Box = styled.div<{ isActive?: boolean; width?: string }>`
  width: calc((100% - 23px * 5) / 6);
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 23px * 5) / 6);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 23px * 4) / 5);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: calc((100% - 23px * 3) / 4);
  }

  .tint {
    padding: 20px;
  }

  .content {
    padding: 20px;
    min-height: 176px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s;
  }

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  color: #ffffff;

  &.active {
    background: #14171a;
    transition: all 0.8s ease-out;
    width: ${(props) => props.width};
    > p {
      opacity: 1;
    }
    &.hidden {
      font-size: 0;
      margin-left: 0;
      margin-right: 0;
      opacity: 0;
      padding-left: 0;
      padding-right: 0;
      width: 0;
    }
  }

  & h2 {
    margin: 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    transition: all 0.3s;
  }

  &:hover {
    & > .content {
      transform: scale(1.1);
    }
  }

  & div.tags {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  & div.date {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #718096;
  }

  & div.footer {
    position: absolute;
    bottom: 20px;
    height: 20px;
  }
`;
