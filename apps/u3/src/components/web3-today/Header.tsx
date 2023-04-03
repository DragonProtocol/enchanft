import styled from 'styled-components';
import { UserAvatar, Username } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useNavigate } from 'react-router-dom';
import CardBase from '../common/card/CardBase';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import { ReactComponent as BookmarkSvg } from '../common/icons/svgs/bookmark.svg';

export default function Header() {
  const { sessId } = useUs3rProfileContext();
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Avatar did={sessId} />
      <Title>
        Welcome to Web 3 Today, <Username did={sessId} />!
      </Title>
      <RightBox>
        <BookmarkButton
          onClick={() => {
            navigate('/favorite');
          }}
        >
          <BookmarkSvg />
          <BookmarkNumber>0</BookmarkNumber>
        </BookmarkButton>
      </RightBox>
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
const RightBox = styled.div`
  margin-left: auto;
  display: flex;
  gap: 20px;
  align-items: center;
`;
const BookmarkButton = styled(ButtonPrimaryLine)`
  width: 60px;
  height: 60px;
  padding: 0px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0px;
  svg {
    path {
      stroke: #718096;
    }
  }
`;
const BookmarkNumber = styled.span`
  font-size: 14px;
`;
