import styled from 'styled-components';
import { numberInput } from '../../../utils';
import { Box } from './Box';
export default function MintLimit({
  mintMaxNum,
  updateMintMaxNum,
}: {
  mintMaxNum?: number;
  updateMintMaxNum?: (arg0: number) => void;
}) {
  return (
    <ContentBox>
      <h4>Mint Limited</h4>
      <div className="area">
        <span>Max</span>{' '}
        <input
          title="limited"
          type="text"
          value={mintMaxNum}
          onKeyPress={numberInput}
          onChange={(e) => {
            const value = Number(e.target.value);
            updateMintMaxNum && updateMintMaxNum(value);
          }}
        />
        <span>mints per wallet</span>
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(Box)`
  & .area {
    display: flex;
    align-items: center;
    height: 50px;
    gap: 10px;

    & input {
      border: none;
      outline: none;
      background: none;
      font-family: inherit;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      background: #ebeee4;
      height: 100%;
      border-radius: 10px;
      padding: 0 10px;
    }

    & span {
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }
  }
`;
