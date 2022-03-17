import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import log from 'loglevel'
import { PublicKey } from '@solana/web3.js'
import { useNavigate } from 'react-router-dom'
import ReactJson from 'react-json-view'

import { getMyNFTData, selectMyNFTMetadataArr, selectMyNFTMetadataStatus, setWalletAddr } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'
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
  nftCopyWithInjectSOL,
  nftCopyWithInjectNFT,
} from '../features/info/infoOps'

import idl, { Contract, Synft } from '../synft'
import type { Node as TreeNode } from '../synft'

const programId = new PublicKey(idl.metadata.address)

import { NftDataItem } from './NFTList'
import NftInject, { InjectMode, InjectType, OnInjectProps } from './nft_handlers/NftInject'
import NftBurn from './nft_handlers/NftBurn'
import { useInjectTree, useBelongTo } from '../hooks'
import { useContract } from '../provider/ContractProvider'

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
  const { contract } = useContract()

  const programRef = useRef<Program<Synft> | null>(null)
  // const [belongLoading, setBelongLoading] = useState(true)
  // const [belongTo, setBelongTo] = useState({
  //   me: false,
  //   program: false,
  // })
  const [hasInject, setHasInject] = useState(false)
  const [hasInjectLoading, setHasInjectLoading] = useState(true)
  const [injectType, setInjectType] = useState<InjectType>(InjectType.Token)
  const [childMint, setChildMint] = useState('')
  const [injectMode, setInjectMode] = useState<InjectMode>(InjectMode.Reversible)

  // TODO: any
  const [mintMetadata, setMintMetadata] = useState<any>(null)
  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTMetadataArr)
  const myNFTDataStatus = useAppSelector(selectMyNFTMetadataStatus)
  // console.log('myNFTData', myNFTData)

  const { injectTree, loading: injectTreeLoading } = useInjectTree(params.mint)
  const { belong, loading: belongLoading } = useBelongTo(params.mint, injectTree)

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
    checkHasInject()
  }, [connection])

  // TODO v2 后 Program 不再暴露
  function initProgram() {
    const provider = new Provider(connection, (window as any).solana, Provider.defaultOptions())
    const program = new Program(idl as any, programId, provider) as Program<Synft>
    programRef.current = program
  }

  async function checkHasInject() {
    setHasInjectLoading(true)
    const program = programRef.current
    if (!program) return
    const inject = await getInject(params.mint, wallet.publicKey, connection, program)
    log.info('checkHasInject', inject)

    if (!inject || !inject.childrenMetadata) {
      setHasInject(false)
      setHasInjectLoading(false)
      return
    }
    const { childrenMetadata, childrenMeta } = inject
    setHasInject(true)
    setInjectMode(childrenMeta.reversible === true ? InjectMode.Reversible : InjectMode.Irreversible)
    log.info(`${params.mint} hasInject`, inject)
    // 只可能注入 sol
    if (childrenMeta?.childType.sol) {
      setMintMetadata({
        injectType: 'sol',
        lamports: childrenMetadata.lamports,
      })
    }
    setHasInjectLoading(false)
  }

  function reloadWindow() {
    window.location.reload()
  }
  // 执行注入
  const onInject = useCallback(
    ({ injectType, injectMode, token, nft }: OnInjectProps) => {
      ;(async () => {
        const mint = params.mint
        log.info({ injectType, injectMode, token, nft }, injectTree)
        // async ({ injectType, injectMode, token, nft }: OnInjectProps) => {
        const program = programRef.current
        if (!program || !mint) return
        const reversible = injectMode === InjectMode.Reversible
        switch (injectType) {
          //   case InjectType.Token:
          //     // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
          //     const { volume } = token
          //     const formatVolume = Number(volume) * 1000000000
          //     await injectSol(params.mint, formatVolume, reversible, { wallet, program, connection })
          //     break
          case InjectType.Nft:
            const childMint = nft.mint || ''
            if (!childMint) return
            const mintKey = new PublicKey(mint)
            const childMintKey = new PublicKey(childMint)
            log.info({ childMint })
            if (injectTree.parent) {
              await contract.injectNFTToNonRoot(mintKey, [childMintKey], {
                rootPDA: new PublicKey(injectTree.parent.rootPDA),
                parentMintKey: new PublicKey(injectTree.parent.mint),
              })
            } else {
              await contract.injectNFTToRoot(mintKey, [childMintKey])
            }
            break
        }
        reloadWindow()
      })()
    },
    [injectTree],
  )
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
    navigate('/')
    reloadWindow()
  }

  const onCopyWithInject = async ({ injectType, injectMode, token, nft }: OnInjectProps) => {
    const { name, symbol, uri } = metadata.data
    const program = programRef.current
    if (!program || !params.mint) return

    let newMint = ''
    const mintKey = new PublicKey(params.mint)
    const reversible = injectMode === InjectMode.Reversible
    switch (injectType) {
      case InjectType.Token:
        // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
        const { volume } = token
        const formatVolume = Number(volume) * 1000000000
        // newMint = await contract.copyWithInjectSOL(mintKey, formatVolume, { name, uri, symbol })
        newMint = await nftCopyWithInjectSOL(
          params.mint,
          formatVolume,
          reversible,
          { name, uri, symbol },
          { connection, wallet, program },
        )
        break
      // case InjectType.Nft:
      //   const childMint = nft.mint || ''
      //   newMint = await nftCopyWithInjectNFT(
      //     params.mint,
      //     childMint,
      //     reversible,
      //     { name, uri, symbol },
      //     { connection, wallet, program },
      //   )
      //   break
    }
    if (!newMint) {
      // TODO: alert something wrong
      return
    }
    navigate(`/info/${newMint}`)
    reloadWindow()
  }
  // TODO loading
  const showBelongToMe = belong.me
  const showViewOnly = !belong.me && belong.program
  const showCopy = !belong.me && !belong.program

  const canExtract = injectTree?.curr.children.length === 0 && injectTree.parent === null

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
        {belongLoading || injectTreeLoading || hasInjectLoading ? (
          <p><img src={LoadingIcon} alt="" /></p>
        ) : (
          <>
            {showViewOnly && (
              <div className="only-view">
                <span className="expression">😯</span>{' '}
                <span className="description">This NFT has been synthesized</span>
              </div>
            )}
            {showBelongToMe && (
              <NftInject
                withCopyInit={false}
                nftOptions={myNFTData
                  .filter((item) => item?.metadata?.data.mint != params.mint)
                  .map((item) => ({ ...item?.metadata?.data, ...item?.metadata?.data.data }))}
                onInject={onInject}
                // canExtract={canExtract}
                mintMetadata={mintMetadata}
                onExtract={onExtract}
              ></NftInject>
            )}
            {showCopy && (
              <NftInject
                withCopyInit={true}
                nftOptions={myNFTData
                  .filter((item) => item?.metadata?.data.mint != params.mint)
                  .map((item) => ({ ...item?.metadata?.data, ...item?.metadata?.data.data }))}
                onCopyWithInject={onCopyWithInject}
              ></NftInject>
            )}
          </>
        )}
        {/* {!injectTreeLoading && <ReactJson src={injectTree} />} */}
      </NFTHandlerWrapper>
    )
  )
}
export default NFTHandler

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
`
