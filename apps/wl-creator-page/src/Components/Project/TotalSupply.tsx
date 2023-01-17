import { numberInput } from '../../utils';
import { Box } from './ItemBox';

export default function TotalSupply({
  supply,
  setSupply,
}: {
  supply: string;
  setSupply: (arg0: number) => void;
}) {
  return (
    <Box>
      <h4>Total Supply</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="Input"
          value={supply}
          onKeyPress={numberInput}
          onChange={(e) => {
            const value = Number(e.target.value);
            setSupply(value);
          }}
        />
      </div>
    </Box>
  );
}
