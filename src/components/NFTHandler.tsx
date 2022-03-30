import React, { useEffect, useState, useCallback, useRef, createRef } from 'react'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useNavigate } from 'react-router-dom'

import { getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'

import NftInject, { InjectMode, OnInjectProps } from './nft_handlers/NftInject'
import { useBelongTo, useHasInjectV1 } from '../hooks'
import { useContract } from '../provider/ContractProvider'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { solToLamports } from '../utils'
import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import log from 'loglevel'
import { InjectType, Node } from '../synft'
// import ReactJson from 'react-json-view'

interface Props {
  metadata: MetadataData
  injectTree: {
    data: Node
    loading: boolean
  }
  refreshInject: () => void
}

const NFTHandler: React.FC<Props> = (props: Props) => {
  const { metadata, refreshInject, injectTree } = props

  const injectRef = useRef<{ resetSelect: Function }>()
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const navigate = useNavigate()

  const { contract } = useContract()
  const { belong, loading: belongLoading } = useBelongTo(params.mint)
  const {
    checkLoading: hasInjectLoading,
    hasInject,
    injectData: mintMetadata,
    refresh: refreshInjectV1,
  } = useHasInjectV1(params.mint)

  const [injectType] = useState<InjectType>(InjectType.SOL)
  // 写合约交互状态。modal or toast
  const [writing, setWriting] = useState(false)

  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)

  useEffect(() => {
    if (!wallet.publicKey) {
      dispatch(clearMyNFT())
      return
    }
    const owner = wallet.publicKey
    if (belong.me) dispatch(getMyNFTokens({ owner }))
  }, [wallet, belong])

  function reloadWindow() {
    window.location.reload()
  }
  // 执行注入
  const onInject = useCallback(
    ({ injectType, injectMode, token, nft }: OnInjectProps) => {
      if (belong.parent && belong.parent.mint !== belong.parent.rootMint) {
        alert('cannot inject NFT for this nft, because third deep not allowed')
        return
      }
      if (injectTree.data.curr.children.length > 2) {
        alert('cannot inject NFT for this nft, because children len has eq 3')
        return
      }
      ;(async () => {
        const mint = params.mint
        if (!mint) return

        try {
          setWriting(true)
          const reversible = injectMode === InjectMode.Reversible
          switch (injectType) {
            case InjectType.SOL:
              // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
              // const { volume } = token
              // const formatVolume = Number(volume) * 1000000000
              // await injectSol(params.mint, formatVolume, reversible, { wallet, program, connection })
              break
            case InjectType.NFT:
              const childMint = nft.mint || ''
              if (!childMint) return
              const mintKey = new PublicKey(mint)
              const childMintKey = new PublicKey(childMint)
              if (belong.parent) {
                await contract.injectNFTToNonRoot(mintKey, [childMintKey], {
                  rootPDA: new PublicKey(belong.parent.rootPDA),
                  parentMintKey: new PublicKey(belong.parent.mint),
                })
              } else {
                await contract.injectNFTToRoot(mintKey, [childMintKey])
              }
              break
          }
          setWriting(false)
          wallet.publicKey && dispatch(getMyNFTokens({ owner: wallet.publicKey }))
          injectRef.current && injectRef.current.resetSelect({ mint: '', image: '', name: '' })
          refreshInject()
        } catch (error) {
          log.error(error)
          // 可以用来显示错误
          if ((error as any).code === 4001) {
            // 用户取消交易
          } else {
            // -32003 "Transaction creation failed."
          }
          setWriting(false)
        }
      })()
    },
    [belong, injectTree.data],
  )
  // 执行提取
  const onExtract = async () => {
    if (!params.mint) return
    try {
      setWriting(true)
      const mintKey = new PublicKey(params.mint)
      switch (injectType) {
        case InjectType.SOL:
          // await contract.extractSOL(mintKey)
          break
        // case InjectType.NFT:
        //   await extractNFT(params.mint, { wallet, program, connection })
        //   break
      }
      refreshInject()
    } catch (error) {
      log.error(error)
      setWriting(false)
    }
  }

  const onCopyWithInject = async ({ injectType, injectMode, token, nft }: OnInjectProps) => {
    const { name, symbol, uri } = metadata.data
    if (!params.mint) return

    const mintKey = new PublicKey(params.mint)
    // const reversible = injectMode === InjectMode.Reversible
    const { volume } = token
    const lamportsVolume = solToLamports(Number(volume))
    const newMint = await contract.copyWithInjectSOL(mintKey, lamportsVolume, { name, uri, symbol })
    if (!newMint) {
      // TODO: alert something wrong
      return
    }
    navigate(`/info/${newMint}`)
    reloadWindow()
  }

  const burnNFT = async () => {
    if (props.injectTree.data.parent) {
      // TODO
      alert('support rootNFT burn only')
      return
    }
    if (!params.mint) return
    const mintKey = new PublicKey(params.mint)
    await contract.startBurn(mintKey)
    // TODO
    alert('burned')
    navigate(`/`)
  }

  const extractSOL = async () => {
    if (!params.mint) return
    if (props.injectTree.data.parent) {
      // TODO
      alert('support rootNFT extract only')
      return
    }
    const mintKey = new PublicKey(params.mint)
    await contract.extractSOL(mintKey)
    refreshInject()
  }

  const injectSOL = async () => {
    if (!params.mint) return
    if (props.injectTree.data.parent) {
      // TODO
      alert('support rootNFT extract only')
      return
    }
    const mintKey = new PublicKey(params.mint)
    // TODO
    await contract.injectSOL(mintKey, 0.1 * LAMPORTS_PER_SOL)
    refreshInject()
  }

  const transferToOther = useCallback(async () => {
    // TODO other
    const otherKeyStr = window.prompt('Other wallet:')
    if (!otherKeyStr) return
    const other = new PublicKey(otherKeyStr)
    if (!params.mint) return

    const mintKey = new PublicKey(params.mint)
    if (!belong.parent) return

    await contract.transferChildNFTToUser(other, mintKey, {
      rootMintKey: new PublicKey(belong.parent.rootMint),
      rootPDA: new PublicKey(belong.parent.rootPDA),
      parentMintKey: new PublicKey(belong.parent.mint),
    })
  }, [belong])

  const transferToSelf = useCallback(async () => {
    const self = wallet.publicKey
    if (!params.mint || !self) return

    const mintKey = new PublicKey(params.mint)
    if (!belong.parent) return

    await contract.transferChildNFTToUser(self, mintKey, {
      rootMintKey: new PublicKey(belong.parent.rootMint),
      rootPDA: new PublicKey(belong.parent.rootPDA),
      parentMintKey: new PublicKey(belong.parent.mint),
    })
  }, [wallet, belong])

  const extractNFT = useCallback(async () => {
    const self = wallet.publicKey
    if (!params.mint || !self) return
    // TODO 如果有两个及以上节点，应该弹选择框
    const mintKey = injectTree.data.curr.children[0]?.curr.mint
    const rootPDA = injectTree.data.curr.children[0]?.curr.rootPDA
    if (!mintKey || !rootPDA) return

    const rootMint = await contract.getRootMintFromRootPDA(rootPDA)
    if (!rootMint) return

    await contract.transferChildNFTToUser(self, new PublicKey(mintKey), {
      rootMintKey: rootMint,
      rootPDA: new PublicKey(rootPDA),
      parentMintKey: new PublicKey(params.mint),
    })
    refreshInject()
  }, [wallet, injectTree.data])

  const showBelongToMe = belong.me
  const showViewOnly = !belong.me && belong.program
  const showCopy = !belong.me && !belong.program

  // 当前 NFT solAmount，
  const solAmount = injectTree.data.curr.sol?.lamports
  const couldExtractSOL = solAmount === 0

  // 可不可以被操作
  const couldOps = !belong.parent?.isMutated
  // 可不可以执行注入
  const couldInject = !belong.parent
    ? true
    : belong.parent.mint === belong.parent.rootMint && injectTree.data.curr.children.length < 2

  return (
    (!wallet.publicKey && <div>Connect wallet first</div>) || (
      <NFTHandlerWrapper>
        <div className="top">
          <div className="nft-title">{metadata.data.name}</div>
          <div className="nft-creator">
            <span className="creator-label">creator</span>
            <span className="creator-value">{metadata.data.creators && metadata.data.creators[0]?.address}</span>
            {solAmount && <span>{`${solAmount / LAMPORTS_PER_SOL} SOL`}</span>}
          </div>
          <div className="dividing-line"></div>
        </div>
        {belongLoading || hasInjectLoading ? (
          <p>
            <img src={LoadingIcon} alt="" />
          </p>
        ) : (
          <>
            {showViewOnly && (
              <div className="only-view">
                <span className="expression">😯</span>{' '}
                <span className="description">This NFT has been synthesized</span>
              </div>
            )}
            {showBelongToMe && (
              <>
                <NftInject
                  withCopyInit={false}
                  nftOptions={myNFTData.filter(
                    (item) => item.mint != params.mint && item.mint != belong.parent?.rootMint,
                  )}
                  onInject={onInject}
                  mintMetadata={mintMetadata}
                  onExtract={onExtract}
                  ref={injectRef}
                ></NftInject>
                {belong.parent?.isMutated && <p>no ops allowed，because the NFT is in the cooling off period</p>}
                {(props.injectTree.loading && <div>checking</div>) || (
                  <>
                    <button onClick={burnNFT}>Burn</button>
                    {couldExtractSOL && <button onClick={extractSOL}>ExtractSOL</button>}
                    <button onClick={injectSOL}>InjectSOL</button>
                    {belong.parent && <button onClick={transferToOther}>transferToOther</button>}
                    {belong.parent && <button onClick={transferToSelf}>ExtractNFTFromParent</button>}
                    <button onClick={extractNFT}>ExtractChildNFT</button>
                  </>
                )}
              </>
            )}
            {showCopy && (
              <NftInject
                withCopyInit={true}
                nftOptions={myNFTData.filter((item) => item?.mint != params.mint)}
                onCopyWithInject={onCopyWithInject}
              ></NftInject>
            )}
          </>
        )}

        {/* {belong && <ReactJson src={belong} />} */}
      </NFTHandlerWrapper>
    )
  )
}
export default NFTHandler

const NFTHandlerWrapper = styled.div`
  width: 100%;
  .top {
    text-transform: uppercase;
    .nft-title {
      font-size: 30px;
      color: #222222;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 20px;
      }
    }
    .nft-creator {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 16px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 14px;
      }
      .creator-label {
        color: rgba(34, 34, 34, 0.5);
      }
      .creator-value {
        color: #222222;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        @media (max-width: ${MOBILE_BREAK_POINT}px) {
          font-size: 12px;
        }
      }
    }
    .dividing-line {
      width: 40px;
      height: 4px;
      background: #222222;
      margin: 40px 0;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        margin: 20px 0;
      }
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
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      height: auto;
      padding: 20px 8px;
    }
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
