import { Box } from './ItemBox';

export default function TotalSupply({
  supply,
  setSupply,
}: {
  supply: string;
  setSupply: (arg0: string) => void;
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
          onChange={(e) => {
            setSupply(e.target.value);
          }}
        />
      </div>
    </Box>
  );
}
