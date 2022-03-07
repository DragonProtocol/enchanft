import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'

export async function getMySPLToken(connection: Connection, owner: PublicKey) {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  const filteredToken = tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount
      return amount.decimals === 0 && amount.uiAmount === 1
    })
    .map((t) => ({
      owner,
      address: new PublicKey(t.pubkey),
      mint: new PublicKey(t.account.data.parsed.info.mint),
    }))

  return filteredToken
}

export async function getSPLTokenMetadata(connection: Connection, mintKey: PublicKey) {
  const pubkey = await Metadata.getPDA(mintKey)
  const metadata = await Metadata.load(connection, pubkey)
  return metadata
}
