import React, { useEffect, useRef, useState } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'

import {
  getMyNFTData,
  getMyNFTMetadata,
  selectMyNFTMetadataArr,
  selectMyNFTMetadataStatus,
  setWalletAddr,
} from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

import { checkBelongToMe, getInject, injectSol, extractSol, injectNFT, extractNFT } from '../features/info/infoOps'
import idl from '../synftIdl.json'
import { Synft } from '../synft'

const programId = new PublicKey(idl.metadata.address)

import { NftDataItem } from './NFTList'

interface Props {
  data: NftDataItem
  metadata: any
}
const NFTHandler: React.FC<Props> = (props: Props) => {
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const { connection } = useConnection()

  const programRef = useRef<Program<Synft> | null>(null)
  const [metadata, setMetadata] = useState<any>({})
  const [belongToMe, setBelongToMe] = useState(false)
  const [hasInject, setHasInject] = useState(false)
  const [injectType, setInjectType] = useState<'sol' | 'nft' | ''>('')
  const [childMint, setChildMint] = useState('')

  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTMetadataArr)
  const myNFTDataStatus = useAppSelector(selectMyNFTMetadataStatus)

  useEffect(() => {
    if (!wallet.publicKey) return
    const owner = wallet.publicKey
    dispatch(setWalletAddr(owner.toString()))
    dispatch(getMyNFTData({ connection, owner }))
  }, [wallet])

  useEffect(() => {
    initProgram()
  }, [connection])

  useEffect(() => {
    viewOrOps()
  }, [connection, wallet])

  useEffect(() => {
    checkHasInject()
  }, [belongToMe])

  async function viewOrOps() {
    const r = await checkBelongToMe(params.mint, wallet, connection)
    setBelongToMe(r)
  }

  async function checkHasInject() {
    const program = programRef.current
    if (!program) return
    const data = await getInject(params.mint, wallet.publicKey, connection, program)
    log.info('hasInject', data)
    if (!data || !data.childrenMetadata) {
      setHasInject(false)
      return
    }
    const { childrenMetadata, childrenMeta } = data
    setHasInject(true)
    if (childrenMeta?.childType.sol) setInjectType('sol')
    if (childrenMeta?.childType.nft) setInjectType('nft')
  }

  function initProgram() {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, programId, provider) as Program<Synft>
    programRef.current = program
  }

  function reloadWindow() {
    window.location.reload()
  }

  return (
    <NFTHandlerWrapper>
      {!belongToMe ? (
        <div>OnlyView</div>
      ) : (
        <div>
          {hasInject ? (
            <div>
              {injectType === 'sol' && (
                <div>
                  <button
                    onClick={async () => {
                      const program = programRef.current
                      if (!program) return
                      await extractSol(params.mint, { wallet, program, connection })
                      reloadWindow()
                    }}
                  >
                    extractSOL
                  </button>
                </div>
              )}
              <hr />
              {injectType === 'nft' && (
                <div>
                  <button
                    onClick={async () => {
                      const program = programRef.current
                      if (!program) return
                      await extractNFT(params.mint, { program, connection, wallet })
                      reloadWindow()
                    }}
                  >
                    extractNFT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div>
                <input type="text" placeholder="sol amount" />
                <button
                  onClick={async () => {
                    const program = programRef.current
                    if (!program) return
                    // 500000000 = 0.5 sol
                    await injectSol(params.mint, 500000000, { wallet, program, connection })
                    reloadWindow()
                  }}
                >
                  injectSOL
                </button>
              </div>{' '}
              <hr />
              <div>
                {myNFTData
                  .filter((item) => item.data.mint != params.mint)
                  .map((item) => {
                    return <p key={item.data.mint}>{item.data.mint}</p>
                  })}

                <input
                  type="text"
                  value={childMint}
                  onChange={(event) => {
                    setChildMint(event.target.value || '')
                  }}
                />
                <button
                  onClick={async () => {
                    const program = programRef.current
                    if (!program) return
                    await injectNFT(params.mint, childMint, {
                      wallet,
                      connection,
                      program,
                    })
                    reloadWindow()
                  }}
                >
                  injectNFT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </NFTHandlerWrapper>
  )
}
export default NFTHandler
const NFTHandlerWrapper = styled.div``
