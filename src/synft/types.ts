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
