import { PublicKey } from '@solana/web3.js'
import idl from './idl.json'

export type { Synft } from './synft'

export const programId = new PublicKey(idl.metadata.address)
export default idl
