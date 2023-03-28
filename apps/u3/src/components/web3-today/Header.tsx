import styled from 'styled-components';
import { UserAvatar, Username } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import CardBase from '../common/card/CardBase';

export default function Header() {
  const { sessId } = useUs3rProfileContext();

  return (
    <Wrapper>
      <Avatar did={sessId} />
      <Title>
        Welcome to Web 3 Today, <Username did={sessId} />!
      </Title>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  height: 100px;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Avatar = styled(UserAvatar)`
  width: 60px;
  height: 60px;
`;

const Title = styled.span`
  &,
  & > * {
    display: inline-block;
    font-size: 28px;
    color: #fff;
  }
`;
