import styled from 'styled-components';
import { defaultFormatDate } from '../../utils/time';
import { Eye } from '../icons/eye';
import { Heart } from '../icons/heart';
import Badge from './Badge';

export default function ContentShower({
  title,
  type,
  createdAt,
  author,
  content,
}: {
  title: string;
  type: string;
  author: string;
  createdAt: number;
  content: string;
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
            <span>{defaultFormatDate(createdAt)}</span>
          </div>
          <div />
        </div>
      </ContentTitle>
      <ContentBody dangerouslySetInnerHTML={{ __html: content }} />
      <br />
    </Shower>
  );
}

const Shower = styled.div`
  height: calc(100% - 60px);
  overflow: scroll;
  padding: 20px;
`;

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
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;

  color: #718096;
  padding-top: 20px;

  & h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    color: #ffffff;
  }

  & a {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #a57dff;
  }
`;
