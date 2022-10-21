import { useMemo } from 'react';
import { Box } from './ItemBox';

import { BlockchainType } from './types';

export default function Blockchain({
  blockchain,
  setBlockchain,
}: {
  blockchain: BlockchainType;
  setBlockchain?: (type: BlockchainType) => void;
}) {
  const showEVM = useMemo(() => {
    if (setBlockchain) return true;
    if (blockchain === BlockchainType.Ethereum) return true;
    return false;
  }, [setBlockchain, blockchain]);
  const showSOL = useMemo(() => {
    if (setBlockchain) return true;
    if (blockchain === BlockchainType.Solana) return true;
    return false;
  }, [setBlockchain, blockchain]);
  const showAPTOS = useMemo(() => {
    if (setBlockchain) return true;
    if (blockchain === BlockchainType.Aptos) return true;
    return false;
  }, [setBlockchain, blockchain]);
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
        {showEVM && (
          <option value={BlockchainType.Ethereum}>
            {BlockchainType.Ethereum}
          </option>
        )}
        {showSOL && (
          <option value={BlockchainType.Solana}>{BlockchainType.Solana}</option>
        )}
        {showAPTOS && (
          <option value={BlockchainType.Aptos}>{BlockchainType.Aptos}</option>
        )}
      </select>
    </Box>
  );
}
