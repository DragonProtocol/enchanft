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
import { Contract } from '../synft'
import useInjectTree from '../hooks/useInjectTree'
import LoadingIcon from '../components/imgs/Loading.gif'

const Info: React.FC = (props) => {
  const params = useParams()
  const { connection } = useConnection()
  const wallet: WalletContextState = useWallet()

  const [loading, setLoading] = useState(true)
  const [validNFT, setValidNFT] = useState(false)
  const [metadata, setMetadata] = useState<any>({})
  useEffect(() => {
    getMetadata()
  }, [connection, params.mint])

  async function getMetadata() {
    setLoading(true)
    if (!params.mint) {
      return
    }
    log.info('getMetadata')
    try {
      const mintKey = new PublicKey(params.mint)
      const valid = await checkValidNFT(mintKey, connection)
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

  const { injectTree, loading: injectTreeLoading } = useInjectTree(params.mint)
  const showerData = {
    addr: '',
    mint: params.mint || '',
    uri: metadata.data?.uri || '',
    injectTree: {
      data: injectTree,
      loading: injectTreeLoading,
    },
  }
  const handlerData = { addr: '', mint: params.mint || '', uri: metadata.data?.uri || '' }

  return (
    <InfoWrapper>
      {(loading && (
        <div className="tip">
          <img src={LoadingIcon} alt="" />
        </div>
      )) ||
        (validNFT && (
          <>
            <div className="left">
              <NFTShower data={showerData} />
            </div>
            <div className="right">
              <NFTHandler data={handlerData} metadata={metadata} />
            </div>
          </>
        )) || <div className="tip">invalid NFT</div>}
    </InfoWrapper>
  )
}
export default Info
const InfoWrapper = styled.div`
  display: flex;
  .left,
  .right {
    width: 50%;
  }
  .tip {
    margin: 0 auto;
    margin-top: 40%;
  }
`
