import { BlockchainType } from '../Components/Project/types';

export function numberInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.charCode !== 46 && (e.charCode < 48 || e.charCode > 57)) {
    e.preventDefault();
  }
}

export function sortPubKey(key: string, len = 4) {
  return key.slice(0, len) + '..'.repeat(len / 4) + key.slice(-len);
}

export function chainIdToChain(
  chainId: number | undefined | null
): BlockchainType {
  if (chainId === -1) return BlockchainType.Solana;
  if (chainId === 1) return BlockchainType.Ethereum;
  return BlockchainType.Aptos;
}

export function chainToChainId(blockchain: BlockchainType): number {
  let chainId = -1;
  if (blockchain === BlockchainType.Solana) {
    chainId = -1;
  }
  if (blockchain === BlockchainType.Ethereum) {
    chainId = 1;
  }
  if (blockchain === BlockchainType.Aptos) {
    chainId = 2;
  }

  return chainId;
}
