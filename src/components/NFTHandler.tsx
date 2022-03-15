import React, { useEffect, useRef, useState } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'
import { useNavigate } from 'react-router-dom'

import { getMyNFTData, selectMyNFTMetadataArr, selectMyNFTMetadataStatus, setWalletAddr } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'

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
import ButtonBase from './common/ButtonBase'
import { CursorPointerUpCss, FontFamilyCss } from '../GlobalStyle'
import NftInject, { InjectMode, InjectType, OnInjectProps } from './nft_handlers/NftInject'
import NftBurn from './nft_handlers/NftBurn'

interface Props {
  data: NftDataItem
  metadata: any
}

const NFTHandler: React.FC<Props> = (props: Props) => {
  const metadata = props.metadata

  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const { connection } = useConnection()
  const navigate = useNavigate()

  const programRef = useRef<Program<Synft> | null>(null)
  const [belongLoading, setBelongLoading] = useState(true)
  const [belongTo, setBelongTo] = useState({
    me: false,
    program: false,
  })
  const [hasInject, setHasInject] = useState(false)
  const [injectType, setInjectType] = useState<InjectType>(InjectType.Token)
  const [childMint, setChildMint] = useState('')
  const injectMode = InjectMode.Reversible
  // TODO @ttang 确定拿到 reversible 后开启下面一行，删除上面一行
  // const injectMode = reversible ? InjectMode.Reversible: InjectMode.Irreversible

  // TODO: any
  const [mintMetadataArr, setMintMetadataArr] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTMetadataArr)
  const myNFTDataStatus = useAppSelector(selectMyNFTMetadataStatus)
  useEffect(() => {
    if (!wallet.publicKey) {
      dispatch(clearMyNFT())
      return
    }
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
      const injectType = childrenMeta?.childType.nft ? InjectType.Nft : InjectType.Token
      setInjectType(injectType)

      if (injectType === InjectType.Nft) {
        const metadataArr = await loadChildrenInject(childrenMeta.child, { connection, wallet, program })
        log.info('metadataArr', { metadataArr })
        setMintMetadataArr(metadataArr)
      } else {
        setMintMetadataArr([
          {
            injectType: 'sol',
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
  // 执行注入
  const onInject = async ({ injectType, injectMode, token, nft }: OnInjectProps) => {
    const program = programRef.current
    if (!program) return
    const reversible = injectMode === InjectMode.Reversible
    switch (injectType) {
      case InjectType.Token:
        // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
        const { volume } = token
        const formatVolume = Number(volume) * 1000000000
        await injectSol(params.mint, formatVolume, reversible, { wallet, program, connection })
        break
      case InjectType.Nft:
        const childMint = nft.mint || ''
        await injectNFT(params.mint, childMint, reversible, { wallet, program, connection })
        break
    }
    reloadWindow()
  }
  // 执行提取
  const onExtract = async () => {
    const program = programRef.current
    if (!program) return
    switch (injectType) {
      case InjectType.Token:
        await extractSol(params.mint, { wallet, program, connection })
        break
      case InjectType.Nft:
        await extractNFT(params.mint, { wallet, program, connection })
        break
    }
    reloadWindow()
  }
  // 执行提取并销毁
  const onWithdraw = async () => {
    const program = programRef.current
    if (!program) return
    switch (injectType) {
      case InjectType.Token:
        await burnWithdrawSOL(params.mint, { wallet, program, connection })
        break
      case InjectType.Nft:
        await burnWithdrawSPL(params.mint, { wallet, program, connection })
        break
    }
    reloadWindow()
  }
  // TODO loading
  return (
    (!wallet.publicKey && <div>Connect wallet first</div>) || (
      <NFTHandlerWrapper>
        <div className="top">
          <div className="nft-title">{metadata.data.name}</div>
          <div className="nft-creator">
            <span className="creator-label">creator</span>
            <span className="creator-value">{metadata.data.creators && metadata.data.creators[0]?.address}</span>
          </div>
          <div className="dividing-line"></div>
        </div>
        {(!belongTo.me && (
          <div className="not-belongto-me">
            {(belongTo.program && (
              <div className="only-view">
                <span className="expression">😯</span>{' '}
                <span className="description">This NFT has been synthesized</span>
              </div>
            )) || (
              <button
                className="nft-copy-btn"
                onClick={async () => {
                  const { name, symbol, uri } = metadata.data
                  const program = programRef.current
                  if (!program) return
                  const newMint = await nftCopy(params.mint, { name, uri, symbol }, { connection, wallet, program })
                  window.location.href = `/info/${newMint}`
                }}
              >
                Copy The Nft
              </button>
            )}
          </div>
        )) || (
          <div className="belongto-me">
            {hasInject ? (
              <NftBurn
                data={mintMetadataArr}
                injectType={injectType}
                injectMode={injectMode}
                onExtract={onExtract}
                onWithdraw={onWithdraw}
              ></NftBurn>
            ) : (
              //   {mintMetadataArr.map((item) => {
              //     return <p key={item.data?.mint || InjectType.Token}>{item.data?.mint || item.lamports}</p>
              //   })}
              // </div>
              <NftInject
                nftOptions={myNFTData
                  .filter((item) => item?.data?.mint != params.mint)
                  .map((item) => ({ ...item?.data, ...item?.data?.data }))}
                onInject={onInject}
              ></NftInject>
            )}
          </div>
        )}
      </NFTHandlerWrapper>
    )
  )
}
export default NFTHandler

const ButtonBaseCss = css`
  width: 100%;
  height: 48px;
  text-align: center;
  line-height: 48px;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  color: #ffffff;
  ${FontFamilyCss}
  ${CursorPointerUpCss}
`
const NFTHandlerWrapper = styled.div`
  .top {
    text-transform: uppercase;
    .nft-title {
      font-size: 30px;
      color: #222222;
    }
    .nft-creator {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 16px;
      .creator-label {
        color: rgba(34, 34, 34, 0.5);
      }
      .creator-value {
        color: #222222;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .dividing-line {
      width: 40px;
      height: 4px;
      background: #222222;
      margin: 40px 0;
    }
  }
  .only-view {
    width: 100%;
    height: 308px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    text-transform: uppercase;
    color: rgba(34, 34, 34, 0.5);
    .expression {
      font-size: 40px;
    }
    .description {
      font-size: 18px;
      text-align: center;
      line-height: 24px;
    }
  }
  .nft-copy-btn {
    ${ButtonBaseCss}
    background: #3DD606;
  }
`
