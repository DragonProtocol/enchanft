import { Connection, PublicKey } from '@solana/web3.js'
import { Metadata, PROGRAM_ID as MetadataProgramId } from '@metaplex-foundation/mpl-token-metadata'
import axios from 'axios'

import type { MetaInfo } from '../synft/v2/types'

export async function getMetadataFromMint(mintKey: PublicKey, connection: Connection) {
  const [pubkey] = await getMetadataPDA(mintKey)
  const info = await connection.getAccountInfo(pubkey)
  if (!info) return null
  const data = Metadata.fromAccountInfo(info)
  return data[0]
}

export async function getMetadataPDA(mint: PublicKey) {
  const key = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), MetadataProgramId.toBuffer(), mint.toBuffer()],
    MetadataProgramId,
  )
  return key
}


export async function getMetadataInfoWithMint(mintKey: PublicKey, connection: Connection): Promise<MetaInfo | null> {
  try {
    const metadata = await getMetadataFromMint(mintKey, connection)
    if (!metadata) return null
    const externalMetadata = (await axios.get(metadata.data.uri)).data
    const result = {
      mint: mintKey,
      metadata,
      externalMetadata,
    }
    return result
  } catch (error) {
    return null
  }
}