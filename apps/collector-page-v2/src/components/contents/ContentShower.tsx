import dayjs from 'dayjs';
import styled from 'styled-components';
import { Eye } from '../icons/eye';
import { Heart } from '../icons/heart';
import Badge from './Brage';

export default function ContentShower({
  uid,
  title,
  type,
  createdAt,
  author,
  upVoteNum,
  favored,
  content,
  voteAction,
  favorsActions,
  hiddenAction,
}: {
  uid?: string;
  title: string;
  type: string;
  author: string;
  createdAt: number;
  upVoteNum: number;
  favored: boolean;
  content: string;
  voteAction: () => void;
  favorsActions: () => void;
  hiddenAction: () => void;
}) {
  return (
    <Shower>
      <ContentTitle>
        <div>{title}</div>
        <div>
          <div>
            <Badge text={type} />
            <span>{author}</span>
            <span>|</span>
            <span>{dayjs(createdAt).format('MMM DD YYYY')}</span>
          </div>
          <div>
            {!uid && <span onClick={voteAction}>👏 Applause</span>}
            {!uid && (
              <span onClick={favorsActions}>
                {favored ? <Heart fill="#718096" /> : <Heart />}
              </span>
            )}
            <span onClick={hiddenAction}>
              <Eye />
            </span>
          </div>
        </div>
      </ContentTitle>
      <ContentBody dangerouslySetInnerHTML={{ __html: content }} />
    </Shower>
  );
}

const Shower = styled.div``;

const ContentTitle = styled.div`
  border-bottom: 1px dotted #39424c;
  > div {
    display: flex;
    justify-content: space-between;
    &:first-child {
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      color: #ffffff;
    }
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 20px 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #718096;

      &:last-child {
        color: #fff;
        > span {
          cursor: pointer;
          display: flex;
          box-sizing: border-box;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 6px 12px;
          height: 32px;
          background: #1a1e23;
          border: 1px solid #39424c;
          border-radius: 12px;
          /* color: #fff; */
        }

        /* display: ; */
      }
    }
  }
`;
const ContentBody = styled.div`
  color: white;
  padding-top: 20px;
`;
