import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import NFTHandler from '../components/NFTHandler'
// import { utils } from '@project-serum/anchor'

import NFTShower from '../components/NFTShower'

export default function Info() {
  const params = useParams()
  const wallet = useWallet()
  const { connection } = useConnection()

  const [metadata, setMetadata] = useState<any>({})

  const getMetadata = async () => {
    if (!params.mint) return
    try {
      //- TODO: could filter from redux store first
      const mintKey = new PublicKey(params.mint)
      const metadataPubkey = await Metadata.getPDA(mintKey)
      const metadata = await Metadata.load(connection, metadataPubkey)
      // console.log(metadata.toJSON())
      setMetadata(metadata.toJSON().data)
    } catch (error) {
      console.error(error)
    }
  }

  const checkOps = async () => {
    if (!wallet.publicKey) return
    const encoder = new TextEncoder()
    const data = encoder.encode('children-of')
    console.log('checkOps', data)
    const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
      [data, wallet.publicKey.toBuffer()],
      TOKEN_PROGRAM_ID,
    )
    console.log({ metadataPDA }, metadataPDA.toString())
    // await PublicKey.findProgramAddress(
    //   [
    //     tokenAccount2.address.toBuffer(),
    //   ],
    //   program.programId
    // );
  }

  const getOwner = async () => {
    if (!params.mint || !params.address) return
    const [key, number] = await MetadataProgram.findMetadataAccount(new PublicKey(params.mint))
    console.log('-=-=', key.toString())

    // console.log('getOwner', params.mint, params.address)
    // const data = await connection.getAccountInfo(new PublicKey(params.address))
    // console.log('getOwner', { data }, data?.owner.toString())
  }

  useEffect(() => {
    getMetadata()
    getOwner()
  }, [])

  useEffect(() => {
    if (!wallet.publicKey) return
    checkOps()
  }, [wallet])

  //- TODO:
  /** check which action (create | view | burn | enchant) can be ops */

  const showerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  const handlerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  return (
    <InfoWrapper>
      <div className="left">
        <NFTShower data={showerData}></NFTShower>
      </div>
      <div className="right">
        <NFTHandler data={handlerData}></NFTHandler>
      </div>
    </InfoWrapper>
  )
}

const InfoWrapper = styled.div`
  display: flex;
  .left,
  .right {
    width: 50%;
  }
`
