export enum State {
  FUTURE = 'Future',
  ACTIVE = 'Active',
}

export enum BlockchainType {
  Solana = 'Solana',
  Ethereum = 'Ethereum',
  Aptos = 'Aptos',
}
export type Project = {
  name: string;
  desc: string;
  img: string;
  blockchain: BlockchainType;
  minted: boolean;
};
