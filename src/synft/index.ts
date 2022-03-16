import { PublicKey } from '@solana/web3.js'
import idl from './idl.json'

export { default as Contract } from './Contract'
export type { Node, MetaInfo, BelongTo } from './v2/types'
export type { Synft } from './synft'

export const programId = new PublicKey(idl.metadata.address)
export default idl
