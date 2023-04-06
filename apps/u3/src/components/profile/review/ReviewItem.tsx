import { Score } from '@us3r-network/thread';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { UserAvatar, Username } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import CardBase from '../../common/card/CardBase';
import { ReactComponent as CheckVerifiedSvg } from '../../common/icons/svgs/check-verified.svg';
import EllipsisText from '../../common/text/EllipsisText';
import ScoreRateValue from '../../common/score/ScoreRateValue';
import ImgDefault from '../../common/ImgDefault';

export type ReviewItemData = Score & {
  threadLogo?: string;
  threadTitle?: string;
  isVerified?: boolean;
};

type ReviewItemProps = StyledComponentPropsWithRef<'div'> & {
  data: ReviewItemData;
};
export default function ReviewItem({ data }: ReviewItemProps) {
  const { sessId } = useUs3rProfileContext();
  return (
    <Wrapper>
      <Header>
        <Logo src={data.threadLogo} />
        <Title>{data.threadTitle}</Title>
        {data.isVerified && <CheckVerifiedSvg />}
      </Header>
      <Divider />
      <ScoreRow>
        <Avatar did={sessId} />
        <Name did={sessId} />
        <ScoreValue value={data.value} />
      </ScoreRow>
      <Text>{data.text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  border: none;
  background: #14171a;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    margin-right: auto;
  }
`;

const Logo = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;
const Title = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #39424c;
  opacity: 0.5;
  margin: 20px 0px;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled(UserAvatar)`
  width: 48px;
  height: 48px;
`;
const Name = styled(Username)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const ScoreValue = styled(ScoreRateValue)`
  margin-left: auto;
`;
const Text = styled.span`
  display: inline-block;
  margin-top: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
`;