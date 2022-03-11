import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { Signer, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js'

import NFTHandler from '../components/NFTHandler'

import { getMetadataFromMint } from '../features/my/myData'
import NFTShower from '../components/NFTShower'

import idl from '../synftIdl.json'
import { Synft } from '../synft'

const programId = new PublicKey(idl.metadata.address)

export default function Info() {
  const params = useParams()
  const { connection } = useConnection()

  const [metadata, setMetadata] = useState<any>({})

  useEffect(() => {
    getMetadata()
  }, [connection])

  async function getMetadata() {
    if (!params.mint) return
    const mintKey = new PublicKey(params.mint)
    try {
      // TODO: could filter from redux store first
      const data = await getMetadataFromMint(connection, mintKey)
      setMetadata(data.toJSON().data)
    } catch (error) {
      log.warn('getMetadata', error)
    }
  }

  const showerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  const handlerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  return (
    <InfoWrapper>
      {/* <h2>Info: {params.mint}</h2>
      {params.mint && <NFTShower addr="" mint={params.mint} uri={metadata.data?.uri || ''} />}
      <button> create | view | burn | enchant </button> */}
      <div className="left">
        <NFTShower data={showerData} />
      </div>
      <div className="right">
        <NFTHandler data={handlerData} metadata={metadata} />
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
