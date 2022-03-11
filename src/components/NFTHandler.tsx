import React, { useEffect, useRef, useState } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'

import { getMyNFTData, selectMyNFTMetadataArr, selectMyNFTMetadataStatus, setWalletAddr } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

import {
  checkBelongToMe,
  getInject,
  injectSol,
  extractSol,
  injectNFT,
  extractNFT,
  nftCopy,
  loadChildrenInject,
  burnWithdrawSOL,
  burnWithdrawSPL,
} from '../features/info/infoOps'
import idl, { Synft } from '../synft'

const programId = new PublicKey(idl.metadata.address)

import { NftDataItem } from './NFTList'

interface Props {
  data: NftDataItem
  metadata: any
}
type InjectType = 'sol' | 'nft' | ''

const NFTHandler: React.FC<Props> = (props: Props) => {
  const metadata = props.metadata
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const { connection } = useConnection()

  const programRef = useRef<Program<Synft> | null>(null)
  const [belongLoading, setBelongLoading] = useState(true)
  const [belongTo, setBelongTo] = useState({
    me: false,
    program: false,
  })
  const [hasInject, setHasInject] = useState(false)
  const [injectType, setInjectType] = useState<InjectType>('')
  const [childMint, setChildMint] = useState('')

  // TODO: any
  const [mintMetadataArr, setMintMetadataArr] = useState<any[]>([])

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
  }, [belongTo])

  async function viewOrOps() {
    if (!params.mint) return
    try {
      const mintKey = new PublicKey(params.mint)
      const belong = await checkBelongToMe(mintKey, wallet, connection)
      setBelongTo(belong)
    } catch (error) {
      log.warn('viewOrOps', error)
    }
  }

  async function checkHasInject() {
    const program = programRef.current
    if (!program) return
    const inject = await getInject(params.mint, wallet.publicKey, connection, program)
    log.info('inject', inject)

    if (!inject || !inject.childrenMetadata) {
      setHasInject(false)
      return
    }
    const { childrenMetadata, childrenMeta } = inject
    setHasInject(true)
    log.info(`${params.mint} hasInject`, inject)

    if (childrenMeta?.childType.nft || childrenMeta?.childType.sol) {
      const injectType = childrenMeta?.childType.nft ? 'nft' : 'sol'
      setInjectType(injectType)
      if (injectType === 'nft') {
        const metadataArr = await loadChildrenInject(childrenMeta.child, { connection, wallet, program })
        log.info('metadataArr', { metadataArr })
        setMintMetadataArr(metadataArr)
      } else {
        setMintMetadataArr([
          {
            injectType,
            lamports: childrenMetadata.lamports,
          },
        ])
      }
    }
  }

  function initProgram() {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, programId, provider) as Program<Synft>
    programRef.current = program
  }

  function reloadWindow() {
    window.location.reload()
  }

  // TODO loading
  return (
    <NFTHandlerWrapper>
      {(!belongTo.me && (
        <div>
          {(belongTo.program && <p>OnlyView </p>) || (
            <button
              onClick={async () => {
                const { name, symbol, uri } = metadata.data
                const program = programRef.current
                if (!program) return
                const newMint = await nftCopy(params.mint, { name, uri, symbol }, { connection, wallet, program })
                window.location.href = `/info/${newMint}`
              }}
            >
              copyTheNFT
            </button>
          )}
        </div>
      )) || (
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
                  |
                  <button
                    onClick={async () => {
                      const program = programRef.current
                      if (!program) return
                      await burnWithdrawSOL(params.mint, { wallet, program, connection })
                      reloadWindow()
                    }}
                  >
                    burnWithdrawSOL
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
                  |
                  <button
                    onClick={async () => {
                      const program = programRef.current
                      if (!program) return
                      await burnWithdrawSPL(params.mint, { wallet, program, connection })
                      reloadWindow()
                    }}
                  >
                    burnWithdrawSPL
                  </button>
                </div>
              )}
              {mintMetadataArr.map((item) => {
                return <p key={item.data?.mint || 'sol'}>{item.data?.mint || item.lamports}</p>
              })}
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
