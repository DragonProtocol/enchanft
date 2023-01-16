import { Box } from './ItemBox';

export default function Contract({
  tokenContract,
  setTokenContract,
}: {
  tokenContract: string;
  setTokenContract: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Token Contract</h4>
      <div className="input-area">
        <input
          title="name"
          type="text"
          placeholder="Input"
          value={tokenContract}
          onChange={(e) => {
            const value = e.target.value;
            setTokenContract(value);
          }}
        />
      </div>
    </Box>
  );
}
