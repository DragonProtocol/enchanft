import React, { useEffect, useState, useCallback, useRef, createRef, Children, ReactChildren, useMemo } from 'react'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useNavigate } from 'react-router-dom'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  Alert,
  AlertColor,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material'

import { getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'
import NftInject, { InjectMode, OnInjectProps } from './nft_handlers/NftInject'
import { useBelongTo, useGAEvent } from '../hooks'
import { useSynftContract } from '@jsrsc/synft-js-react'
import { MAX_CHILDREN_PER_LEVEL, MOBILE_BREAK_POINT, VIEW_LAMPORTS_DECIMAL } from '../utils/constants'
import { lamportsToSol, solToLamports, sendWalletTrans, getMetadataInfoWithMint } from '../utils'
import { Node } from '../synft'
import RemindConnectWallet from './RemindConnectWallet'
import { ButtonDanger, ButtonInfo, ButtonPrimary } from './common/ButtonBase'
import { NftDataItem } from './NFTList'
import ModalNftSelector from './nft_handlers/ModalNftSelector'
import TooltipWrapper from './common/TooltipWrapper'
import { FontFamilyCss } from '../GlobalStyle'
import SolanaIcon from './icons/solana.png'
import { ExternalMetadata } from '../synft/types'
interface Props {
  metadata: Metadata
  externalMetadata: ExternalMetadata
  injectTree: {
    data: Node
    loading: boolean
  }
  refreshInject: () => void
}
enum TransctionType {
  INJECT = 'inject',
  EXTRACT = 'extract',
  TRANSFER = 'transfer',
  BURN = 'burn',
}
const transactionMsg = {
  [TransctionType.INJECT]: {
    inProgress: 'enchanft transaction in progress ......',
    successful: 'enchanft successful!',
    failed: 'enchanft failed!',
    cancel: 'enchanft transaction was canceled by user',
  },
  [TransctionType.EXTRACT]: {
    inProgress: 'extract transaction in progress ......',
    successful: 'extract successful!',
    failed: 'extract failed!',
    cancel: 'extract transaction was canceled by user',
  },
  [TransctionType.TRANSFER]: {
    inProgress: 'transfer transaction in progress ......',
    successful: 'transfer successful!',
    failed: 'transfer failed!',
    cancel: 'transfer transaction was canceled by user',
  },
  [TransctionType.BURN]: {
    inProgress: 'burn transaction in progress ......',
    successful: 'burn successful!',
    failed: 'burn failed!',
    cancel: 'burn transaction was canceled by user',
  },
}
type NftNodeDataItem = NftDataItem & { rootPDA: string }
function reloadWindow() {
  window.location.reload()
}

enum ContractActionGA {
  COPY_WITH_INJECT_SOL = 'COPY_WITH_INJECT_SOL',
  BURN = 'BURN',
  INJECT_SOL = 'INJECT_SOL',
  EXTRACT_SOL = 'EXTRACT_SOL',
  INJECT_NFT_TO_ROOT = 'INJECT_NFT_TO_ROOT',
  INJECT_NFT_TO_NON_ROOT = 'INJECT_NFT_TO_NON_ROOT',
  INJECT_NFT_TO_ROOT_WITH_SOL = 'INJECT_NFT_TO_ROOT_WITH_SOL',
  INJECT_NFT_TO_NON_ROOT_WITH_SOL = 'INJECT_NFT_TO_NON_ROOT_WITH_SOL',
  EXTRACT_NFT = 'EXTRACT_NFT',
  EXTRACT_NFT_FROM_PARENT = 'EXTRACT_NFT_FROM_PARENT',
  TRANSFER_CHILD_NFT_TO_OTHER = 'TRANSFER_CHILD_NFT_TO_OTHER',
}

/**
 * @description: 表单是否可以操作的提示包装盒子
 */
export const FormCouldOpsTooltipWrapper = ({ children, enable }: { children: any; enable: boolean }) => {
  return (
    <TooltipWrapper title="no ops allowed，because the NFT is in the cooling off period" enable={enable}>
      {children}
    </TooltipWrapper>
  )
}
const NFTHandler: React.FC<Props> = (props: Props) => {
  const wallet: WalletContextState = useWallet()
  const { publicKey } = wallet
  const { connection } = useConnection()
  const { metadata, refreshInject, injectTree, externalMetadata } = props
  const { mint } = metadata
  const mintKey = new PublicKey(mint)
  const injectRef = useRef<{ resetForm: Function }>()
  const navigate = useNavigate()
  const { synftContract } = useSynftContract()
  const { belong, loading: belongLoading } = useBelongTo(mint.toString(), injectTree.data)
  const gaEvent = useGAEvent()

  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)
  useEffect(() => {
    if (!publicKey) {
      dispatch(clearMyNFT())
      return
    }
    const owner = publicKey
    if (belong.me) dispatch(getMyNFTokens({ owner, connection, synftContract }))
  }, [publicKey, belong, connection, synftContract])

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
  // 是否打开模态框选择要提取的NFT
  const [openExtractNftModal, setOpenExtractNftModal] = useState(false)
  // NFT子集可选项
  const [nftChildOptions, setNftChildOptions] = useState<NftNodeDataItem[]>([])

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

  // 是否可以注入SOL
  const couldInjectSOL = !injectTree.data.parent

  // 是否可以注入NFT
  // TODO 是否超出高度限制条件待调整
  const couldInjectNFT =
    injectTree.data.curr.children.length < MAX_CHILDREN_PER_LEVEL &&
    (!belong.parent || belong.parent.mint === belong.parent.rootMint)

  // 还可以注入几个NFT
  const couldInjectNFTNum = couldInjectNFT ? MAX_CHILDREN_PER_LEVEL - injectTree.data.curr.children.length : 0

  // 是否可以提取NFT
  const couldExtractNFT = injectTree.data.curr.children.length > 0

  // 是否可以提取sol
  const couldExtractSOL = !injectTree.data.parent && solAmount > 0

  // 是否可销毁
  const couldBurn = !injectTree.data.parent && hasInjected

  // 可不可以被操作
  const couldOps = !injectTree.data.parent?.isMutated
  // const couldOps = false

  // 执行注入
  const onInject = useCallback(
    ({ injectMode, token, nfts }: OnInjectProps) => {
      const formatVolume = solToLamports(Number(token.volume))
      const childMintKeys = nfts.map((nft) => new PublicKey(nft.mint))
      const reversible = injectMode === InjectMode.Reversible
      console.log('onInject')
      transactionPublic(async () => {
        if (!publicKey) return
        const tx = new Transaction()
        if (formatVolume && childMintKeys.length > 0) {
          // 如果注入了SOL，又注入了nft
          // 如果有父级
          if (belong.parent) {
            gaEvent(ContractActionGA.INJECT_NFT_TO_NON_ROOT_WITH_SOL)
            const injectTx = await synftContract.injectNFTToNonRoot(
              publicKey,
              mintKey,
              childMintKeys,
              new PublicKey(belong.parent.rootPDA),
              reversible,
            )
            tx.add(...injectTx)
            if (formatVolume) {
              const injectSolTx = await synftContract.injectSOLInstruction(publicKey, mintKey, formatVolume)
              tx.add(injectSolTx)
            }
          } else {
            gaEvent(ContractActionGA.INJECT_NFT_TO_ROOT_WITH_SOL)
            const injectInstruction = await synftContract.injectNFTToRoot(publicKey, mintKey, childMintKeys, reversible)
            const injectSolInstruction = await synftContract.injectSOLInstruction(publicKey, mintKey, formatVolume)
            tx.add(...injectInstruction, injectSolInstruction)
          }
        } else if (formatVolume) {
          // 如果只注入SOL
          gaEvent(ContractActionGA.INJECT_SOL)
          const injectSolTx = await synftContract.injectSOLInstruction(publicKey, mintKey, formatVolume)
          tx.add(injectSolTx)
        } else if (childMintKeys.length > 0) {
          // 如果只注入nft
          // 如果有父级
          if (belong.parent) {
            gaEvent(ContractActionGA.INJECT_NFT_TO_NON_ROOT)
            const injectTx = await synftContract.injectNFTToNonRoot(
              publicKey,
              mintKey,
              childMintKeys,
              new PublicKey(belong.parent.rootPDA),
              reversible,
            )
            tx.add(...injectTx)
          } else {
            gaEvent(ContractActionGA.INJECT_NFT_TO_ROOT)
            const injectTx = await synftContract.injectNFTToRoot(publicKey, mintKey, childMintKeys, reversible)
            tx.add(...injectTx)
          }
        }

        await sendWalletTrans(tx, connection, wallet)
        publicKey && dispatch(getMyNFTokens({ owner: publicKey, connection, synftContract }))
        injectRef.current && injectRef.current.resetForm()
      }, TransctionType.INJECT)
    },
    [belong, injectTree.data, publicKey, connection, synftContract],
  )
  // 执行提取sol
  const onExtractSol = useCallback(async () => {
    transactionPublic(async () => {
      if (!publicKey) return
      gaEvent(ContractActionGA.EXTRACT_SOL)
      const tx = new Transaction()
      const inst = await synftContract.extractSOL(mintKey, publicKey)
      tx.add(inst)
      await sendWalletTrans(tx, connection, wallet)
    }, TransctionType.EXTRACT)
  }, [publicKey])

  // 获取子NFT详细信息
  useEffect(() => {
    ;(async () => {
      const promises = injectTree.data.curr.children.map(async (item: Node) => {
        const { mint } = item.curr
        const mintKey = new PublicKey(mint as string)
        const data = await getMetadataInfoWithMint(mintKey, connection)
        // 组合图片信息数据
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

  // 执行提取nft
  const onExtractNFT = async () => {
    // 如果有两个及以上节点，应该弹选择框
    if (injectTree.data.curr.children.length > 1) {
      setOpenExtractNftModal(true)
    } else {
      // 只有一个默认直接提取处理，不用弹窗
      const nft = injectTree.data.curr.children[0].curr
      onSubmitExtractNFT([nft as unknown as NftNodeDataItem])
    }
  }
  const onSubmitExtractNFT = useCallback(
    async (nfts: NftNodeDataItem[]) => {
      console.log('onSubmitExtractNFT')
      if (!publicKey) return
      // 先关闭列表选择模态框
      setOpenExtractNftModal(false)
      // TODO 目前接口只能提取一个nft, 要更换为提取多个nft的接口
      const mintKey = nfts[0]?.mint
      const rootPDA = nfts[0]?.rootPDA
      if (!mintKey || !rootPDA) return
      const rootMint = await synftContract.getRootMintFromRootPDA(rootPDA)
      if (!rootMint) return
      transactionPublic(async () => {
        gaEvent(ContractActionGA.EXTRACT_NFT)
        const tx = new Transaction()
        const instruction = await synftContract.extractChildNFTToUser(publicKey, publicKey, new PublicKey(mintKey), {
          rootMintKey: rootMint,
          parentMintKey: new PublicKey(mint),
        })
        tx.add(instruction)
        await sendWalletTrans(tx, connection, wallet)
        reloadWindow()
      }, TransctionType.EXTRACT)
    },
    [publicKey],
  )

  // 执行复制
  const onCopyWithInject = useCallback(
    async ({ injectMode, token }: OnInjectProps) => {
      const { name, symbol, uri } = metadata.data
      if (!mint) return
      let newMint = ''
      const reversible = injectMode === InjectMode.Reversible
      const { volume } = token
      const lamportsVolume = solToLamports(Number(volume))
      transactionPublic(async () => {
        if (!synftContract.program || !publicKey) return
        console.log('onCopyWithInject')
        gaEvent(ContractActionGA.COPY_WITH_INJECT_SOL)

        const [nftMintPDA, nftMintBump] = await PublicKey.findProgramAddress(
          [Buffer.from('synthetic-nft-mint-seed'), mintKey.toBuffer()],
          synftContract.program.programId,
        )
        const [nftTokenAccountPDA, nftTokenAccountBump] = await PublicKey.findProgramAddress(
          [Buffer.from('synthetic-nft-account-seed'), mintKey.toBuffer()],
          synftContract.program.programId,
        )
        const tx = new Transaction()
        const copyInstruction = await synftContract.copyNFTInstruction(publicKey, mintKey, {
          name,
          metadataUri: uri,
          symbol,
        })
        const injectInstruction = await synftContract.injectSOLWithTokenAccountInstruction(
          publicKey,
          nftMintPDA,
          nftTokenAccountPDA,
          lamportsVolume,
        )
        tx.add(copyInstruction, injectInstruction)
        await sendWalletTrans(tx, connection, wallet)
        newMint = nftMintPDA.toString()

        navigate(`/info/${newMint}`)
        reloadWindow()
      }, TransctionType.INJECT)
    },
    [publicKey],
  )

  // 执行燃烧销毁
  const [openBurnConfirm, setOpenBurnConfirm] = useState(false)
  const onBurn = useCallback(async () => {
    setOpenBurnConfirm(false)
    transactionPublic(async () => {
      gaEvent(ContractActionGA.BURN)
      if (!publicKey) return
      const tx = new Transaction()
      const instruction = await synftContract.burn(publicKey, mintKey)
      tx.add(instruction)
      await sendWalletTrans(tx, connection, wallet)
      navigate(`/`)
    }, TransctionType.BURN)
  }, [publicKey])

  // 从其它钱包中转移
  const transferToOther = useCallback(async () => {
    console.log('transferToOther')
    transactionPublic(async () => {
      // TODO other
      const otherKeyStr = window.prompt('Other wallet:')
      if (!otherKeyStr) return
      const other = new PublicKey(otherKeyStr)
      if (!belong.parent) return
      if (!publicKey) return
      gaEvent(ContractActionGA.TRANSFER_CHILD_NFT_TO_OTHER)
      const tx = new Transaction()
      const instruction = await synftContract.extractChildNFTToUser(publicKey, other, new PublicKey(mintKey), {
        rootMintKey: new PublicKey(belong.parent.rootMint),
        parentMintKey: new PublicKey(belong.parent.mint),
      })
      tx.add(instruction)
      await sendWalletTrans(tx, connection, wallet)
    }, TransctionType.TRANSFER)
  }, [belong, publicKey])

  // 从父级提取nft
  const transferToSelf = useCallback(async () => {
    console.log('transferToSelf')
    transactionPublic(async () => {
      if (!publicKey) return
      if (!belong.parent) return
      gaEvent(ContractActionGA.EXTRACT_NFT_FROM_PARENT)
      const tx = new Transaction()
      const instruction = await synftContract.extractChildNFTToUser(publicKey, publicKey, mintKey, {
        rootMintKey: new PublicKey(belong.parent.rootMint),
        parentMintKey: new PublicKey(belong.parent.mint),
      })
      tx.add(instruction)
      await sendWalletTrans(tx, connection, wallet)
    }, TransctionType.EXTRACT)
  }, [publicKey, belong])

  /**
   * @description: 合约交易的通用处理逻辑, 包括交易前置条件处理, 交易结果状态提示，及交易后置操作
   * @param {*} fn 交易执行过程的异步函数
   * @param {*} type 交易的类型
   * @return {*}
   */
  const transactionPublic = useCallback(
    async (fn: Function, type: TransctionType) => {
      if (!couldOps) return
      setTransactionState({ inProgress: true, msg: transactionMsg[type].inProgress })
      try {
        await fn()
        setSnackbarState({ open: true, alertColor: 'success', alertMsg: transactionMsg[type].successful })
        refreshInject()
      } catch (error) {
        // 可以用来显示错误
        if ((error as any).code === 4001) {
          // 用户取消交易
          setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg[type].cancel })
        } else {
          setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg[type].failed })
        }
      } finally {
        setTransactionState({ ...transactionState, inProgress: false })
      }
    },
    [couldOps],
  )

  return (
    <NFTHandlerWrapper>
      <div className="top">
        <div className="nft-title">
          {metadata.data.name}
          {/* TODO 项目编号 */}
          {/* #5553 */}
        </div>
        {/* <div className="nft-creator">
          <span className="creator-label">creator</span>
          <span className="creator-value">
            {metadata.data.creators && metadata.data.creators[0]?.address?.toString()}
          </span>
        </div>
        <div className="dividing-line"></div> */}

        <div className="nft-project">
          {externalMetadata?.collection?.name || externalMetadata?.collection?.family || 'unknown collection'}
        </div>
      </div>
      <div className="handler-form">
        {(!publicKey && (
          <RemindConnectWalletBox>
            <RemindConnectWallet />
          </RemindConnectWalletBox>
        )) || (
          <>
            {belongLoading ? (
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
                    {/* {(couldInjectSOL || couldInjectNFT) && (
                      <NftInject
                        ref={injectRef}
                        formOption={{
                          couldOps: couldOps,
                          displayNftForm: couldInjectNFT,
                          displaySolForm: couldInjectSOL,
                        }}
                        nftOptions={
                          couldInjectNFT
                            ? myNFTData.filter(
                                (item) => item.mint != mint.toString() && item.mint != belong.parent?.rootMint,
                              )
                            : []
                        }
                        nftInjectMaxNum={couldInjectNFTNum}
                        onInject={onInject}
                      ></NftInject>
                    )} */}

                    {(injectTree.loading && (
                      <p>
                        <img src={LoadingIcon} alt="" />
                      </p>
                    )) || (
                      <>
                        {/* {couldExtractSOL && (
                          <FormCouldOpsTooltipWrapper enable={!couldOps}>
                            <ButtonDanger
                              style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
                              className={`handle-btn`}
                              disabled={!couldOps}
                              onClick={onExtractSol}
                            >
                              {`> Extract (${lamportsToSol(solAmount).toFixed(VIEW_LAMPORTS_DECIMAL)} SOL) <`}
                            </ButtonDanger>
                          </FormCouldOpsTooltipWrapper>
                        )}
                        {couldExtractNFT && (
                          <FormCouldOpsTooltipWrapper enable={!couldOps}>
                            <ButtonDanger
                              style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
                              className={`handle-btn`}
                              disabled={!couldOps}
                              onClick={onExtractNFT}
                            >
                              {`> Extract Child NFT <`}
                            </ButtonDanger>
                          </FormCouldOpsTooltipWrapper>
                        )}
                        {belong.parent && (
                          <FormCouldOpsTooltipWrapper enable={!couldOps}>
                            <ButtonDanger
                              style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
                              className={`handle-btn`}
                              disabled={!couldOps}
                              onClick={transferToOther}
                            >
                              {`> Transfer To Other <`}
                            </ButtonDanger>
                          </FormCouldOpsTooltipWrapper>
                        )}
                        {belong.parent && (
                          <FormCouldOpsTooltipWrapper enable={!couldOps}>
                            <ButtonDanger
                              style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
                              className={`handle-btn`}
                              disabled={!couldOps}
                              onClick={transferToSelf}
                            >
                              {`> Extract NFT From Parent <`}
                            </ButtonDanger>
                          </FormCouldOpsTooltipWrapper>
                        )}
                        {couldBurn && (
                          <FormCouldOpsTooltipWrapper enable={!couldOps}>
                            <ButtonDanger
                              style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
                              className={`handle-btn`}
                              disabled={!couldOps}
                              onClick={onBurn}
                            >
                              {`> Burn <`}
                            </ButtonDanger>
                          </FormCouldOpsTooltipWrapper>
                        )} */}
                        {couldBurn && (
                          <BurnEnchanftedWrapper>
                            <BurnEnchanftedTitle>Enchanfted</BurnEnchanftedTitle>
                            <BurnEnchanftedAmountBox>
                              <img src={SolanaIcon} alt="" />
                              <span>{lamportsToSol(solAmount).toFixed(VIEW_LAMPORTS_DECIMAL)}</span>
                              <span>SOL</span>
                            </BurnEnchanftedAmountBox>
                            <FormCouldOpsTooltipWrapper enable={!couldOps}>
                              <ButtonDanger
                                style={{
                                  pointerEvents: !couldOps ? 'none' : 'auto',
                                  marginTop: '32px',
                                  marginBottom: '0px',
                                }}
                                className={`handle-btn`}
                                disabled={!couldOps}
                                onClick={() => setOpenBurnConfirm(true)}
                              >
                                {`> Burn <`}
                              </ButtonDanger>
                            </FormCouldOpsTooltipWrapper>
                            <Dialog
                              open={openBurnConfirm}
                              onClose={() => setOpenBurnConfirm(true)}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              style={{
                                padding: '24px',
                              }}
                            >
                              <BurnConfirmContent>
                                <BurnConfirmTitle>
                                  <div style={{ fontSize: '40px' }}>⚠️</div>
                                  <span>{'Burning will destroy the NFT and remove the embedded SOL.'}</span>
                                </BurnConfirmTitle>
                                <BurnConfirmButtons>
                                  <ButtonInfo
                                    onClick={() => setOpenBurnConfirm(false)}
                                    style={{
                                      padding: '18px 40px',
                                    }}
                                  >
                                    Cancel
                                  </ButtonInfo>
                                  <ButtonDanger
                                    onClick={onBurn}
                                    style={{
                                      padding: '18px 40px',
                                    }}
                                  >{`Continue`}</ButtonDanger>
                                </BurnConfirmButtons>
                              </BurnConfirmContent>
                            </Dialog>
                          </BurnEnchanftedWrapper>
                        )}
                      </>
                    )}
                  </>
                )}
                {/* {showCopy && (
                  <NftInject
                    formOption={{
                      couldOps: couldOps,
                      displayNftForm: false,
                      submitBtnType: 'warning',
                      submitBtnLabel: '> Encha NFT! <',
                    }}
                    nftOptions={myNFTData.filter((item) => item?.mint != mint.toString())}
                    onInject={onCopyWithInject}
                  ></NftInject>
                )} */}
              </>
            )}
            {/* NFT 列表选择模态框 */}
            <ModalNftSelector
              subTitle="Select the NFT you want to extract"
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={snackbarState.open}
              autoHideDuration={6500}
              onClose={() => setSnackbarState((v) => ({ ...v, open: false }))}
            >
              <Alert severity={snackbarState.alertColor} className="alert-msg">
                {snackbarState.alertMsg}
              </Alert>
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
    text-transform: capitalize;
    margin-bottom: 48px;
    .nft-title {
      font-size: 24px;
      line-height: 40px;
      color: #222222;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 20px;
      }
    }
    .nft-project {
      font-size: 12px;
      line-height: 12px;
      color: #3dd606;
      margin-top: 8px;
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
  .handle-btn {
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
  }
  .alert-msg {
    ${FontFamilyCss}
    font-size: 12px;
  }
`
const BurnEnchanftedWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border: 2px solid #222222;
  padding: 16px;
  margin-bottom: 12px;
`
const BurnEnchanftedTitle = styled.div`
  font-size: 16px;
  line-height: 16px;
  color: #222222;
`
const BurnEnchanftedAmountBox = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 38px;
  font-size: 24px;
  line-height: 24px;
  color: #222222;
`
const BurnConfirmContent = styled.div`
  padding: 24px;
`
const BurnConfirmTitle = styled.div`
  ${FontFamilyCss}
  display: flex;
  gap: 24px;
  align-items: flex-start;
  font-size: 14px;
  line-height: 24px;
`
const BurnConfirmButtons = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  margin-top: 24px;
`

const RemindConnectWalletBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border: 2px solid #222222;
  padding: 16px;
  margin-top: 48px;
  margin-bottom: 12px;
`
