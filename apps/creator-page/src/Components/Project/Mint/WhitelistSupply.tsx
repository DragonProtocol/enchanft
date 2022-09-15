import { numberInput } from '../../../utils';
import { Box } from './Box';
export default function WhitelistSupply() {
  return (
    <Box>
      <h4>Supply</h4>
      <div className="input-area">
        <input title="mint-price" type="text" onKeyPress={numberInput} />
      </div>
    </Box>
  );
}
