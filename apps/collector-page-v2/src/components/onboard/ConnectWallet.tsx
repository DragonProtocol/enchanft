import styled from 'styled-components';
import { ButtonPrimary } from '../common/button/ButtonBase';
import { Wallet2 } from '../icons/wallet';

export default function ConnectWallet() {
  return (
    <Box>
      <div>
        <Wallet2 />
        <h2>No Wallet Connected</h2>
        <p>Get Started by connecting your wallet</p>
        <ConnectBtn>Connect Wallet</ConnectBtn>
      </div>
    </Box>
  );
}

const Box = styled.div`
  height: 100vh;
  overflow: scroll;
  > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;

    background: #1b1e23;
    border-radius: 20px;
    margin: 40px;
    height: calc(100vh - 80px);
    position: relative;
    padding: 40px;
    box-sizing: border-box;

    > h2 {
      font-weight: 700;
      font-size: 36px;
      line-height: 40px;
      text-align: center;
      margin: 0;
      color: #ffffff;
    }

    > p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      margin: 0;
      text-align: center;
      color: #718096;
    }
  }
`;

const ConnectBtn = styled(ButtonPrimary)`
  width: 228px;
  height: 48px;
`;
