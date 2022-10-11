import { numberInput } from '../../../utils';
import { Box } from './Box';
export default function WhitelistSupply({
  totalNum,
  updateTotalNum,
}: {
  totalNum: number;
  updateTotalNum: (arg0: number) => void;
}) {
  return (
    <Box>
      <h4>Supply</h4>
      <div className="input-area">
        <input
          title="mint-price"
          type="text"
          onKeyPress={numberInput}
          value={totalNum || 0}
          onChange={(e) => {
            const value = Number(e.target.value);
            updateTotalNum(value);
          }}
        />
      </div>
    </Box>
  );
}
