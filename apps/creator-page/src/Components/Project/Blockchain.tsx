import { Box } from './ItemBox';

import { BlockchainType } from './types';

export default function Blockchain({
  blockchain,
  setBlockchain,
}: {
  blockchain: BlockchainType;
  setBlockchain: (type: BlockchainType) => void;
}) {
  return (
    <Box>
      <h4>Blockchain</h4>
      <select
        title="blockchain"
        value={blockchain}
        onChange={(e) => {
          setBlockchain(e.target.value as BlockchainType);
        }}
      >
        <option value={BlockchainType.Ethereum}>
          {BlockchainType.Ethereum}
        </option>
        <option value={BlockchainType.Solana}>{BlockchainType.Solana}</option>
        <option value={BlockchainType.Aptos}>{BlockchainType.Aptos}</option>
      </select>
    </Box>
  );
}