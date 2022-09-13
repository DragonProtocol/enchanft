export enum BlockchainType {
  Solana = 'Solana',
  Ethereum = 'Ethereum',
}
export type Project = {
  name: string;
  desc: string;
  img: string;
  blockchain: BlockchainType;
  minted: boolean;
};
