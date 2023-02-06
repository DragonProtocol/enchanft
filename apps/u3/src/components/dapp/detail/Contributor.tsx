/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 17:52:13
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/contributor.png';

type Props = StyledComponentPropsWithRef<'div'>;
export default function Contributor({ ...otherProps }: Props) {
  return (
    <ContributorWrapper {...otherProps}>
      <CardTitle>Contributor</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </ContributorWrapper>
  );
}

const ContributorWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
