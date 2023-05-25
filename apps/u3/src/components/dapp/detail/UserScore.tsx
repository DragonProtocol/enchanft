/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:08:41
 * @Description: file description
 */
import styled from 'styled-components';

import { ScoreReviews } from '@us3r-network/link';

import Card, { CardTitle } from './Card';
import { SectionTitle } from './SectionTitle';

export default function UserScore({
  streamId,
  ...otherProps
}: {
  streamId?: string;
}) {
  return (
    <UserScoreWrapper {...otherProps}>
      <CardTitle>User Score</CardTitle>
      <ScoreReviews linkId={streamId} className="score-reviews" />
    </UserScoreWrapper>
  );
}

const UserScoreWrapper = styled(Card)`
  width: 100%;
  .score-reviews {
    margin-top: 20px;
  }
`;

export function UserScoreMobile({
  streamId,
  ...otherProps
}: {
  streamId?: string;
}) {
  return (
    <UserScoreWrapperMobile {...otherProps}>
      <SectionTitle>Review</SectionTitle>
      <ReviewScoreCardListMobile linkId={streamId} />
    </UserScoreWrapperMobile>
  );
}

const UserScoreWrapperMobile = styled.div`
  width: 100%;
`;
const ReviewScoreCardListMobile = styled(ScoreReviews)`
  margin-top: 10px;
  & > div {
    padding: 10px;
    background: #1b1e23;
    border: 1px solid #39424c;
    border-radius: 10px;
    & > div:last-of-type {
      padding-top: 10px;
      border-top: 1px solid #39424c;
      & > div {
        & > img {
          width: 24px;
          height: 24px;
        }
        & > div {
          justify-content: center;
        }
      }
    }
  }
  & > div:last-of-type {
    padding: 0;
    border: none;
    background: none;
  }
`;
