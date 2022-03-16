import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey } from '@solana/web3.js'

export type ChildMeta = {
  reversible: boolean
  bump: number
  child: PublicKey
  childType: {
    sol?: {}
    nft?: {}
  }
}

export type Node = {
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

export type MetaInfo = { mint: PublicKey; metadata: MetadataData; externalMetadata: any }

export type BelongTo = { me: boolean; program: boolean }
