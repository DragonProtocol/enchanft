/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:14:37
 * @Description: file description
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import {
  DappExploreListItemResponse,
  DappStatus,
} from '../../services/types/dapp';
import EllipsisText from '../common/text/EllipsisText';
import ImgDefault from '../common/ImgDefault';
import CardBase from '../common/card/CardBase';
import CheckVerifiedSvg from '../common/icons/svgs/check-verified.svg';
import Tag from '../common/tag/Tag';
import { formatFilterShowName } from '../../utils/filter';

export type DappExploreListItemData = DappExploreListItemResponse;
export type DappExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemData;
};
export default function DappExploreListItem({
  data,
  ...props
}: DappExploreListItemProps) {
  return (
    <ExploreListItemWrapper {...props}>
      <ListItemInner>
        <Banner src={data.image} />
        <Icon src={data.image} />
        <InnerBody>
          <Title>
            <Name>
              {data.name} {data.name} {data.name}
            </Name>
            {data.status === DappStatus.VERIFIED && (
              <CheckVerified src={CheckVerifiedSvg} />
            )}
          </Title>

          <Desc row={4}>{data.description}</Desc>

          <BottomBox>
            <TagsRow>
              {data?.types.map((item) => (
                <Tag key={item}>{formatFilterShowName(item)}</Tag>
              ))}
            </TagsRow>
            {/* <Score>4.5</Score> */}
          </BottomBox>
        </InnerBody>
      </ListItemInner>
    </ExploreListItemWrapper>
  );
}
const ExploreListItemWrapper = styled(CardBase)`
  width: 100%;
  height: 292px;
  padding: 0;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Banner = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const Icon = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 4px solid #1b1e23;
  box-sizing: border-box;
  position: absolute;
  top: 120px;
  left: 20px;
  transform: translateY(-50%);
`;
const InnerBody = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  padding: 20px;
  padding-top: 38px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Name = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CheckVerified = styled.img`
  width: 18px;
  height: 18px;
`;
const Desc = styled(EllipsisText)`
  display: inline-block;
  width: 100%;
  height: 0px;
  flex: 1;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #718096;
`;

const BottomBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TagsRow = styled.div`
  width: 0px;
  flex: 1;
  display: flex;
  gap: 10px;
  overflow: hidden;
`;

const Score = styled.div``;

export const DappExploreListItemMobile = styled(DappExploreListItem)`
  padding: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;
  border-radius: 10px;
`;
