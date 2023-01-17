import styled from 'styled-components';
import BackPng from './imgs/back.png';

export default function BackBtn({ clickAction }: { clickAction: () => void }) {
  return (
    <Button onClick={clickAction}>
      <img src={BackPng} alt="" />
    </Button>
  );
}

const Button = styled.button`
  width: 48px;
  height: 48px;

  background: #e4ffdb;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  & img {
    vertical-align: middle;
    transform: translate(-10%);
  }
`;
