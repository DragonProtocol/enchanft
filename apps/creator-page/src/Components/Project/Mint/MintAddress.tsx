import { Box } from './Box';
export default function MintAddress({
  addr,
  updateAddr,
}: {
  addr: string;
  updateAddr: (arg0: string) => void;
}) {
  return (
    <Box>
      <h4>Mint Address</h4>
      <div className="input-area">
        <input
          title="mint-addr"
          type="text"
          value={addr}
          onChange={(e) => {
            const value = e.target.value;
            updateAddr(value);
          }}
        />
      </div>
    </Box>
  );
}
