/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:08:41
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/user_score.png';
import { SectionTitle } from './SectionTitle';

type Props = StyledComponentPropsWithRef<'div'>;
export default function UserScore({ ...otherProps }: Props) {
  return (
    <UserScoreWrapper {...otherProps}>
      <CardTitle>User Score</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
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

export function UserScoreMobile({ ...otherProps }: Props) {
  return (
    <UserScoreWrapperMobile {...otherProps}>
      <SectionTitle>User Score</SectionTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </UserScoreWrapperMobile>
  );
}

const UserScoreWrapperMobile = styled.div`
  width: 100%;
`;
