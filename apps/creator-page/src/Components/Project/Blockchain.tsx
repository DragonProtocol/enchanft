import { Box } from './ItemBox';

import { BlockchainType } from './types';

export default function Blockchain({
  blockchain,
  setBlockchain,
}: {
  blockchain: BlockchainType;
  setBlockchain?: (type: BlockchainType) => void;
}) {
  return (
    <Box>
      <h4>Blockchain</h4>
      <select
        title="blockchain"
        value={blockchain}
        onChange={(e) => {
          setBlockchain && setBlockchain(e.target.value as BlockchainType);
        }}
      >
        <option
          value={BlockchainType.Ethereum}
          disabled={
            setBlockchain ? false : blockchain !== BlockchainType.Ethereum
          }
        >
          {BlockchainType.Ethereum}
        </option>
        <option
          value={BlockchainType.Solana}
          disabled={
            setBlockchain ? false : blockchain !== BlockchainType.Solana
          }
        >
          {BlockchainType.Solana}
        </option>
        <option
          value={BlockchainType.Aptos}
          disabled={setBlockchain ? false : blockchain !== BlockchainType.Aptos}
        >
          {BlockchainType.Aptos}
        </option>
      </select>
    </Box>
  );
}
