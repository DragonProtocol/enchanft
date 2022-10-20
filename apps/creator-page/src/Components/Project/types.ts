export enum State {
  FUTURE = 'Future',
  ACTIVE = 'Active',
}

export enum MintStage {
  FUTURE = 'FUTURE',
  LIVE = 'LIVE',
  SOLDOUT = 'SOLDOUT',
  // LAUNCHED = 'LAUNCHED',
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
