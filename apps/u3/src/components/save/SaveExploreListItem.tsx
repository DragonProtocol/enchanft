import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Thread } from '@us3r-network/thread';
import { defaultFormatFromNow } from '../../utils/time';
import EllipsisText from '../common/text/EllipsisText';
import LinkBox from '../contents/LinkBox';

export type SaveExploreListItemData = Thread & {
  title?: string;
  logo?: string;
};
export type SaveExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: SaveExploreListItemData;
};

export default function SaveExploreListItem({
  data,
  ...props
}: SaveExploreListItemProps) {
  return (
    <Wrapper {...props}>
      <ListItemInner>
        <TopBox>
          <TitleText>{data.title}</TitleText>

          <TimeText>{defaultFormatFromNow(data.date)}</TimeText>
        </TopBox>
        <BottomBox>
          <IconLink text={data.url} logo={data?.logo} />
        </BottomBox>
      </ListItemInner>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 105px;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
const TopBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const TitleText = styled(EllipsisText)`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const TimeText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  color: #718096;
`;
const BottomBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const IconLink = styled(LinkBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 20px 8px 16px;
  box-sizing: border-box;
  gap: 8px;
  height: 36px;
  background: #14171a;
  border-radius: 100px;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #718096;
  }
`;
