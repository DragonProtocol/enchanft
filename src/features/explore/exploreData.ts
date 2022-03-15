import { request, gql } from 'graphql-request'
import { PublicKey } from '@solana/web3.js'
import log from 'loglevel'

import { isProd } from '../../utils'

const endpoint = isProd
  ? 'https://api.wonkalabs.xyz/v0.1/solana/mainnet/graphql?src=wonka-js'
  : 'https://api.wonkalabs.xyz/v0.1/solana/devnet/graphql?src=wonka-js'

log.log('WONKALABS_ENDPORINT', endpoint)

export type NFT = {
  image: string
  mint: string
  name: string
  hasCopied?: boolean
  hasInjected?: boolean
}

export async function loadExploreNFT(collectionId: String, first: number = 10): Promise<NFT[]> {
  log.info(`Fetching NFTs by collectionID: ${collectionId}`)
  const collectionID = new PublicKey(collectionId)
  const fetchNFTsByCandyMachineQuery = gql`
    {
      nftsByCollection(collectionId:"${collectionID.toString()}", first:${first}) {
        edges {
          node {
            id
            name
            symbol
            image {
              orig
            }
            metaplex_metadata {
              mint
            }
          }
        }
      }
    }`
  const results = await request(endpoint, fetchNFTsByCandyMachineQuery)
  const nfts = results.nftsByCollection.edges
    .map((edge: any) => ({
      name: edge.node.name,
      mint: edge.node.metaplex_metadata.mint,
      image: edge.node.image?.orig,
    }))
    .filter((item: any) => !!item.image)
  return nfts
}

export default {}
