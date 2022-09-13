import { Box } from './ItemBox';

import { BlockchainType } from './types';

export default function Blockchain({
  status,
  setStatus,
}: {
  status: BlockchainType;
  setStatus: (type: BlockchainType) => void;
}) {
  return (
    <Box>
      <h4>Project Status</h4>
      <select
        title="status"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as BlockchainType);
        }}
      >
        <option value={BlockchainType.Solana}>{BlockchainType.Solana}</option>
        <option value={BlockchainType.Ethereum}>
          {BlockchainType.Ethereum}
        </option>
      </select>
    </Box>
  );
}
