import React, { useEffect, useState, useCallback, useRef, createRef } from 'react'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useNavigate } from 'react-router-dom'

import { getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'

import NftInject, { InjectMode, OnInjectProps } from './nft_handlers/NftInject'
import { useBelongTo, useHasInjectV1 } from '../hooks'
import { useContract } from '../provider/ContractProvider'
import { MAX_CHILDREN_PER_LEVEL, MOBILE_BREAK_POINT } from '../utils/constants'
import { lamportsToSol, solToLamports } from '../utils'
import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import log from 'loglevel'
import { BelongTo, InjectType, Node } from '../synft'
// import ReactJson from 'react-json-view'
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material'
import RemindConnectWallet from './RemindConnectWallet'
import { ButtonDanger, ButtonPrimary } from './common/ButtonBase'
import { NftDataItem } from './NFTList'
import { DisabledMaskCss } from '../GlobalStyle'
import ModalNftSelector from './nft_handlers/ModalNftSelector'

interface Props {
  metadata: MetadataData
  injectTree: {
    data: Node
    loading: boolean
  }
  refreshInject: () => void
}
const transactionMsg = {
  enchanft: {
    inProgress: 'enchanft transaction in progress ......',
    successful: 'enchanft successful!',
    failed: 'enchanft failed!',
    cancel: 'enchanft transaction was canceled by user',
  },
  extract: {
    inProgress: 'extract transaction in progress ......',
    successful: 'extract successful!',
    failed: 'extract failed!',
    cancel: 'extract transaction was canceled by user',
  },
  burn: {
    inProgress: 'burn transaction in progress ......',
    successful: 'burn successful!',
    failed: 'burn failed!',
    cancel: 'burn transaction was canceled by user',
  },
}
const NFTHandler: React.FC<Props> = (props: Props) => {
  const { metadata, refreshInject, injectTree } = props

  const injectRef = useRef<{ resetForm: Function }>()
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
  // 交易状态
  const [transactionState, setTransactionState] = useState({
    inProgress: false,
    msg: '',
  })
  // 提示状态
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; alertColor: AlertColor; alertMsg: string }>({
    open: false,
    alertColor: 'info',
    alertMsg: '',
  })
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

  const showBelongToMe = belong.me
  const showViewOnly = !belong.me && belong.program
  const showCopy = !belong.me && !belong.program

  // 当前 NFT solAmount，
  const solAmount = injectTree.data.curr.sol?.lamports || 0

  /**
   * 注意：
   * sol 注入没有限制，但只能在第一层提取
   * nft 提取没有限制，但注入有层级限制
   */

  // 是否被注入过
  const hasInjected = solAmount > 0 || injectTree.data.curr.children.length > 0

  // 是否可以注入NFT
  // TODO 是否超出宽度限制条件待调整
  const couldInjectNFT = !belong.parent
    ? true
    : belong.parent.mint === belong.parent.rootMint && injectTree.data.curr.children.length < MAX_CHILDREN_PER_LEVEL

  // 还可以注入几个NFT
  const couldInjectNFTNum = couldInjectNFT ? MAX_CHILDREN_PER_LEVEL - injectTree.data.curr.children.length : 0

  // 是否可以提取NFT
  const couldExtractNFT = injectTree.data.curr.children.length > 0

  // 是否可以提取sol
  const couldExtractSOL = !injectTree.data.parent && solAmount > 0

  // 是否可销毁
  const couldBurn = !injectTree.data.parent && hasInjected

  // 可不可以被操作
  const couldOps = !belong.parent?.isMutated

  // 执行注入
  const onInject = useCallback(
    ({ injectMode, token, nfts }: OnInjectProps) => {
      ;(async () => {
        if (!couldOps) return
        const mint = params.mint
        if (!mint) return
        try {
          setTransactionState({ inProgress: true, msg: transactionMsg.enchanft.inProgress })
          const formatVolume = solToLamports(Number(token.volume))
          const mintKey = new PublicKey(mint)
          const childMintKeys = nfts.map((nft) => new PublicKey(nft.mint))
          const reversible = injectMode === InjectMode.Reversible
          if (formatVolume && childMintKeys.length > 0) {
            // 如果注入了SOL，又注入了nft
            // 如果有父级
            if (belong.parent) {
              await contract.injectNFTToNonRootWithSOL(
                mintKey,
                childMintKeys,
                formatVolume,
                { rootPDA: new PublicKey(belong.parent.rootPDA), parentMintKey: new PublicKey(belong.parent.mint) },
                reversible,
              )
            } else {
              await contract.injectNFTToRootWithSOL(mintKey, childMintKeys, formatVolume, reversible)
            }
          } else if (formatVolume) {
            // 如果只注入SOL
            await contract.injectSOL(mintKey, formatVolume)
          } else if (childMintKeys.length > 0) {
            // 如果只注入nft
            // 如果有父级
            if (belong.parent) {
              await contract.injectNFTToNonRoot(
                mintKey,
                childMintKeys,
                { rootPDA: new PublicKey(belong.parent.rootPDA), parentMintKey: new PublicKey(belong.parent.mint) },
                reversible,
              )
            } else {
              await contract.injectNFTToRoot(mintKey, childMintKeys, reversible)
            }
          }
          setSnackbarState({ open: true, alertColor: 'success', alertMsg: transactionMsg.enchanft.successful })
          wallet.publicKey && dispatch(getMyNFTokens({ owner: wallet.publicKey }))
          injectRef.current && injectRef.current.resetForm()
          refreshInject()
        } catch (error) {
          // 可以用来提示异常
          if ((error as any).code === 4001) {
            // 用户取消交易
            setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg.enchanft.cancel })
          } else {
            setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg.enchanft.failed })
          }
        } finally {
          setTransactionState({ ...transactionState, inProgress: false })
        }
      })()
    },
    [belong, injectTree.data],
  )
  // 执行提取sol
  const onExtractSol = async () => {
    if (!couldOps) return
    if (!params.mint) return
    try {
      setTransactionState({ inProgress: true, msg: transactionMsg.extract.inProgress })
      const mintKey = new PublicKey(params.mint)
      await contract.extractSOL(mintKey)
      refreshInject()
    } catch (error) {
      // 可以用来显示错误
      if ((error as any).code === 4001) {
        // 用户取消交易
        setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg.extract.cancel })
      } else {
        setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg.extract.failed })
      }
    } finally {
      setTransactionState({ ...transactionState, inProgress: false })
    }
  }
  // NFT子集可选项
  const [nftChildOptions, setNftChildOptions] = useState<NftDataItem[]>([])
  // 执行提取nft源数据
  useEffect(() => {
    ;(async () => {
      const promises = injectTree.data.curr.children.map(async (item: Node) => {
        const { mint } = item.curr
        const mintKey = new PublicKey(mint as string)
        const data = await contract.getMetadataInfoWithMint(mintKey)
        // 将元信息添加到节点的自定义数据中
        return { ...item.curr, ...data?.externalMetadata }
      })
      const newNftData = await Promise.allSettled(promises)
      setNftChildOptions(
        newNftData.map((v: any) => ({
          ...v.value,
        })),
      )
    })()
  }, [injectTree])
  // 提取时打开模态框选择要提取的NFT
  const [openExtractNftModal, setOpenExtractNftModal] = useState(false)
  // 执行提取nft
  const onExtractNFT = async () => {
    if (!couldOps) return
    if (!params.mint) return
    // 如果有两个及以上节点，应该弹选择框
    if (injectTree.data.curr.children.length > 1) {
      setOpenExtractNftModal(true)
    } else {
      // 一个默认提取出那一个
      const nft = injectTree.data.curr.children[0].curr
      // TODO 注意这里的类型要统一
      onSubmitExtractNFT([nft as unknown as NftDataItem & { rootPDA: string }])
    }
  }
  const onSubmitExtractNFT = useCallback(
    // TODO 注意这里的类型要统一
    async (nfts: (NftDataItem & { rootPDA: string })[]) => {
      extractTransactionPublic(async () => {
        // 先关闭模态框
        setOpenExtractNftModal(false)
        const self = wallet.publicKey
        if (!params.mint || !self) return
        // TODO 目前接口只能提取一个nft, 要更换为提取多个nft的接口
        const mintKey = nfts[0]?.mint
        const rootPDA = nfts[0]?.rootPDA
        if (!mintKey || !rootPDA) return
        const rootMint = await contract.getRootMintFromRootPDA(rootPDA)
        if (!rootMint) return
        await contract.transferChildNFTToUser(self, new PublicKey(mintKey), {
          rootMintKey: rootMint,
          rootPDA: new PublicKey(rootPDA),
          parentMintKey: new PublicKey(params.mint),
        })
      })
    },
    [wallet],
  )

  // 执行复制
  const onCopyWithInject = async ({ injectMode, token }: OnInjectProps) => {
    if (!couldOps) return
    const { name, symbol, uri } = metadata.data
    if (!params.mint) return
    let newMint = ''
    const mintKey = new PublicKey(params.mint)
    const reversible = injectMode === InjectMode.Reversible
    setTransactionState({ inProgress: true, msg: transactionMsg.enchanft.inProgress })
    try {
      const { volume } = token
      const lamportsVolume = solToLamports(Number(volume))
      newMint = await contract.copyWithInjectSOL(mintKey, lamportsVolume, { name, uri, symbol })
    } catch (error) {
      // 可以用来显示错误
      if ((error as any).code === 4001) {
        // 用户取消交易
        setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg.extract.cancel })
      } else {
        // -32003 "Transaction creation failed."
        // setWriting(false)
        setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg.enchanft.failed })
      }
    } finally {
      setTransactionState({ ...transactionState, inProgress: false })
    }

    if (!newMint) {
      // TODO: alert something wrong
      return
    }
    navigate(`/info/${newMint}`)
    reloadWindow()
  }

  // 执行燃烧销毁
  const onBurn = async () => {
    if (!couldOps) return
    if (!params.mint) return
    try {
      setTransactionState({ inProgress: true, msg: transactionMsg.burn.inProgress })
      const mintKey = new PublicKey(params.mint)
      await contract.startBurn(mintKey)
      navigate(`/`)
    } catch (error) {
      // 可以用来显示错误
      if ((error as any).code === 4001) {
        // 用户取消交易
        setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg.burn.cancel })
      } else {
        setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg.burn.failed })
      }
    } finally {
      setTransactionState({ ...transactionState, inProgress: false })
    }
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
    extractTransactionPublic(async () => {
      const self = wallet.publicKey
      if (!params.mint || !self) return
      const mintKey = new PublicKey(params.mint)
      if (!belong.parent) return
      await contract.transferChildNFTToUser(self, mintKey, {
        rootMintKey: new PublicKey(belong.parent.rootMint),
        rootPDA: new PublicKey(belong.parent.rootPDA),
        parentMintKey: new PublicKey(belong.parent.mint),
      })
    })
  }, [wallet, belong])

  // 提取交易的通用逻辑
  const extractTransactionPublic = useCallback(async (fn) => {
    try {
      setTransactionState({ inProgress: true, msg: transactionMsg.extract.inProgress })
      await fn()
      refreshInject()
    } catch (error) {
      // 可以用来显示错误
      if ((error as any).code === 4001) {
        // 用户取消交易
        setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg.extract.cancel })
      } else {
        setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg.extract.failed })
      }
    } finally {
      setTransactionState({ ...transactionState, inProgress: false })
    }
  }, [])
  return (
    <NFTHandlerWrapper>
      <div className="top">
        <div className="nft-title">{metadata.data.name}</div>
        <div className="nft-creator">
          <span className="creator-label">creator</span>
          <span className="creator-value">{metadata.data.creators && metadata.data.creators[0]?.address}</span>
        </div>
        <div className="dividing-line"></div>
      </div>
      <div className="container">
        {(!wallet.publicKey && <RemindConnectWallet />) || (
          <>
            {belongLoading || hasInjectLoading ? (
              <p>
                <img src={LoadingIcon} alt="" />
              </p>
            ) : (
              <>
                {/* {!couldOps && (
                  <div className="no-could-ops-mask">
                    no ops allowed
                    <br />
                    because the NFT is in the cooling off period
                  </div>
                )} */}
                {showViewOnly && (
                  <div className="only-view">
                    <span className="expression">😯</span>{' '}
                    <span className="description">This NFT has been synthesized</span>
                  </div>
                )}
                {showBelongToMe && (
                  <>
                    <NftInject
                      ref={injectRef}
                      formOption={{
                        disabled: !couldOps,
                        displayNftForm: couldInjectNFT,
                      }}
                      nftOptions={
                        couldInjectNFT
                          ? myNFTData.filter((item) => item.mint != params.mint && item.mint != belong.parent?.rootMint)
                          : []
                      }
                      nftInjectMaxNum={couldInjectNFTNum}
                      onInject={onInject}
                    ></NftInject>
                    {(injectTree.loading && <div>checking</div>) || (
                      <>
                        {couldExtractSOL && (
                          <ButtonDanger
                            className={`handle-btn ${!couldOps ? 'btn-disabled-mask' : ''}`}
                            onClick={onExtractSol}
                          >
                            {`> extract (${lamportsToSol(solAmount)} SOL) <`}
                          </ButtonDanger>
                        )}
                        {couldExtractNFT && (
                          <ButtonDanger
                            className={`handle-btn ${!couldOps ? 'btn-disabled-mask' : ''}`}
                            onClick={onExtractNFT}
                          >
                            {`> Extract Child NFT <`}
                          </ButtonDanger>
                        )}
                        {belong.parent && (
                          <ButtonDanger
                            className={`handle-btn ${!couldOps ? 'btn-disabled-mask' : ''}`}
                            onClick={transferToOther}
                          >
                            {`> Transfer To Other <`}
                          </ButtonDanger>
                        )}
                        {belong.parent && (
                          <ButtonDanger
                            className={`handle-btn ${!couldOps ? 'btn-disabled-mask' : ''}`}
                            onClick={transferToSelf}
                          >
                            {`> Extract NFT From Parent <`}
                          </ButtonDanger>
                        )}
                        {couldBurn && (
                          <ButtonDanger
                            className={`handle-btn ${!couldOps ? 'btn-disabled-mask' : ''}`}
                            onClick={onBurn}
                          >
                            {`> Burn <`}
                          </ButtonDanger>
                        )}
                      </>
                    )}
                  </>
                )}
                {showCopy && (
                  <NftInject
                    formOption={{
                      disabled: !couldOps,
                      displayNftForm: false,
                      submitBtnType: 'warning',
                      submitBtnLabel: '> Encha NFT! <',
                    }}
                    nftOptions={myNFTData.filter((item) => item?.mint != params.mint)}
                    onInject={onCopyWithInject}
                  ></NftInject>
                )}
              </>
            )}
            {/* NFT 列表选择模态框 */}
            <ModalNftSelector
              options={nftChildOptions}
              open={openExtractNftModal}
              maxSelectNum={1}
              onCancel={() => setOpenExtractNftModal(false)}
              onClose={() => setOpenExtractNftModal(false)}
              onSubmit={(nfts) => onSubmitExtractNFT(nfts as (NftDataItem & { rootPDA: string })[])}
            ></ModalNftSelector>
            {/* 交易触发时页面进入的loading状态 */}
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={transactionState.inProgress}
            >
              <div style={{ textAlign: 'center' }}>
                <CircularProgress color="inherit" />
                <div style={{ marginTop: '20px' }}>{transactionState.msg}</div>
              </div>
            </Backdrop>
            {/* 交易结束后提示交易结果 */}
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={snackbarState.open}
              autoHideDuration={6000}
              onClose={() => setSnackbarState((v) => ({ ...v, open: false }))}
            >
              <Alert severity={snackbarState.alertColor}>{snackbarState.alertMsg}</Alert>
            </Snackbar>
          </>
        )}
      </div>
    </NFTHandlerWrapper>
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
  .container {
    position: relative;
    .no-could-ops-mask {
      ${DisabledMaskCss}
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      text-align: center;
      line-height: 1.5;
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
  .handle-btn {
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
  }
  .btn-disabled-mask {
    position: relative;
    &::before {
      content: '';
      ${DisabledMaskCss}/* background: none; */
    }
  }
`
