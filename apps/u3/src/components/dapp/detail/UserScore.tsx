/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:08:41
 * @Description: file description
 */
import { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';

import { ScoreBox } from '@us3r-network/authkit';

import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/user_score.png';
import { SectionTitle } from './SectionTitle';

// type Props = StyledComponentPropsWithRef<'div'>;
export default function UserScore({
  streamId = 'kjzl6kcym7w8y7dy1njfhc8ewv822i1qw1ty0o0vy5a4w5yu5cuqwqnbfcuh0qx',
  ...otherProps
}: {
  streamId?: string;
}) {
  return (
    <UserScoreWrapper {...otherProps}>
      <CardTitle>User Score</CardTitle>
      <ScoreBox threadId={streamId} />
      {/* <ComingSoonImg src={ComingSoonImgUrl} /> */}
    </UserScoreWrapper>
  );
}

const UserScoreWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;

export function UserScoreMobile({
  streamId = 'kjzl6kcym7w8y7dy1njfhc8ewv822i1qw1ty0o0vy5a4w5yu5cuqwqnbfcuh0qx',
  ...otherProps
}: {
  streamId?: string;
}) {
  return (
    <UserScoreWrapperMobile {...otherProps}>
      <SectionTitle>User Score</SectionTitle>
      {/* <ComingSoonImg src={ComingSoonImgUrl} /> */}
      <ScoreBox threadId={streamId} />
    </UserScoreWrapperMobile>
  );
}

const UserScoreWrapperMobile = styled.div`
  width: 100%;
`;
