import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BN, Program, Provider, web3, Idl, Address } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, getAccount } from '@solana/spl-token'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { Signer, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js'

import { checkValidNFT } from '../features/info/infoOps'
import NFTHandler from '../components/NFTHandler'

import { getMetadataFromMint } from '../features/my/myData'
import NFTShower from '../components/NFTShower'

export default function Info() {
  const params = useParams()
  const { connection } = useConnection()
  const wallet: WalletContextState = useWallet()

  const [loading, setLoading] = useState(true)
  const [validNFT, setValidNFT] = useState(false)
  const [metadata, setMetadata] = useState<any>({})

  useEffect(() => {
    getMetadata()
  }, [connection, wallet])

  async function getMetadata() {
    if (!params.mint || !wallet.publicKey) {
      return
    }
    log.info('getMetadata')
    try {
      const mintKey = new PublicKey(params.mint)
      const valid = await checkValidNFT(mintKey, wallet, connection)
      setValidNFT(valid)

      if (!valid) {
        setLoading(false)
        return
      }

      // TODO: could filter from redux store first
      const data = await getMetadataFromMint(connection, mintKey)
      setMetadata(data.toJSON().data)
      setLoading(false)
    } catch (error) {
      log.warn('getMetadata', error)
      setLoading(false)
    }
  }

  const showerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }
  const handlerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }

  return (
    (loading && <div>loading</div>) ||
    (validNFT && (
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
    )) || <div>invalid NFT</div>
  )
}

const InfoWrapper = styled.div`
  display: flex;
  .left,
  .right {
    width: 50%;
  }
`
