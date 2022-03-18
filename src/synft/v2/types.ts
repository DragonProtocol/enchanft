import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey, AccountInfo } from '@solana/web3.js'

export type ChildMeta = {
  reversible: boolean
  bump: number
  child: PublicKey
  childType: {
    sol?: {}
    nft?: {}
  }
}

export interface Node {
  curr: {
    mint: string | undefined
    sol: {
      lamports: number
      // owner: string
    } | null
    children: Node[]
  }
  parent: null | {
    mint: string
    rootPDA: string
  }
}

// externalMetadata 是 metadata 的 uri 指向的 json data
export type MetaInfo = { mint: PublicKey; metadata: MetadataData; externalMetadata: any }

export type BelongTo = {
  me: boolean
  program: boolean
  parent: null | {
    mint: string
    rootPDA: string
  }
}

export type InjectInfoV1 = {
  childrenMetadata: AccountInfo<Buffer>
  childrenMeta: ChildMeta | null
}

export type NFT = {
  image: string
  mint: string
  name: string
  hasCopied?: boolean
  hasInjected?: boolean
}

export type NFTDataItem = NFT & {
  uri?: string
}
