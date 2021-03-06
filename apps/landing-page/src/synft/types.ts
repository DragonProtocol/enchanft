/* eslint-disable camelcase */
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey, AccountInfo } from '@solana/web3.js';

// metaplex uri 指向的 json 数据
export type ExternalMetadata = {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
  collection: { name: string; family: string };
  properties: {
    files: Array<{ uri: string; type: string }>;
    category: string;
    creators: Array<{ address: string; share: number }>;
  };
};
// 合约持有的注入的信息
export type ChildMeta = {
  reversible: boolean;
  bump: number;
  child: PublicKey;
  childType: {
    sol?: {};
    nft?: {};
  };
};

export interface Node {
  curr: {
    mint: string | undefined;
    rootPDA: string | undefined;
    sol: {
      lamports: number;
      // owner: string
    } | null;
    children: Node[];
  };
  parent: null | {
    mint: string;
    rootPDA: string;
    rootMint: string;
    isMutated: boolean;
  };
}

// externalMetadata 是 metadata 的 uri 指向的 json data
export type MetaInfo = {
  mint: PublicKey;
  metadata: Metadata; // metaplex metadata
  externalMetadata: ExternalMetadata;
};

export type BelongTo = {
  me: boolean; // true 属于我，我可以操作
  program: boolean; // true 被 copy 过，不能再被 copy
  // 是否被作为 child 注入过
  parent: null | {
    mint: string;
    rootPDA: string;
    rootMint: string;
    isMutated: boolean;
  };
};

export type InjectInfoV1 = {
  childrenMetadata: AccountInfo<Buffer>;
  childrenMeta: ChildMeta | null;
};

export type NFT = {
  image: string;
  mint: string;
  name: string;
  hasCopied?: boolean;
  hasInjected?: boolean;
  hasInjectedNFT?: boolean;
  externalMetadata: ExternalMetadata;
};

export type NFTDataItem = NFT & {
  uri?: string;
  injectSolAmount?: number;
};

// eslint-disable-next-line no-shadow
export enum InjectType {
  SOL = 'sol',
  SPL = 'spl',
  // eslint-disable-next-line no-shadow
  NFT = 'nft',
}
