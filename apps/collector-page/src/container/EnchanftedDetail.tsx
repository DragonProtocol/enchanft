import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import NFTHandler from '../components/business/nft/NFTHandler'

import NFTShower from '../components/business/nft/NFTShower'
import useInjectTree from '../hooks/useInjectTree'
import LoadingIcon from '../components/business/nft/imgs/Loading.gif'
import { useInfoFromMint, useValidNFT } from '../hooks'
import { MAX_CHILDREN_PER_LEVEL, MOBILE_BREAK_POINT } from '../constants'
import { NFTDataItem, Node } from '../types/synft'
import { useBelongTo, useGAEvent } from '../hooks'
import { useSynftContract } from '@ecnft/js-sdk-react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getMetadataInfoWithMint } from '../utils/metadata'
import { sendWalletTrans } from '../utils/solana'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'

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
type NftNodeDataItem = NFTDataItem & { rootPDA: string }
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
const EnchanftedDetail: React.FC = () => {
  const params = useParams()

  const { info, loading: infoLoading } = useInfoFromMint(params.mint)
  const { valid: validNFT, checking: validChecking } = useValidNFT(params.mint)
  const { injectTree, loading: injectTreeLoading, refresh: reloadInjectTree } = useInjectTree(params.mint)

  const metadata = info?.metadata
  const loading = validChecking || infoLoading

  const wallet: WalletContextState = useWallet()
  const { publicKey } = wallet
  const { connection } = useConnection()
  const mintKey = metadata ? new PublicKey(metadata.mint) : ''
  const navigate = useNavigate()
  const { synftContract } = useSynftContract()
  const { belong, loading: belongLoading } = useBelongTo(metadata?.mint.toString(), injectTree)
  const gaEvent = useGAEvent()

  // 获取子NFT详细信息
  useEffect(() => {
    ;(async () => {
      const promises = injectTree.curr.children.map(async (item: Node) => {
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

  // NFT子集可选项
  const [nftChildOptions, setNftChildOptions] = useState<NftNodeDataItem[]>([])

  const showBelongToMe = belong.me
  const showViewOnly = !belong.me && belong.program
  const showCopy = !belong.me && !belong.program

  // 当前 NFT solAmount，
  const solAmount = injectTree.curr.sol?.lamports || 0

  /**
   * 注意：
   * sol 注入没有限制，但只能在第一层提取
   * nft 提取没有限制，但注入有层级限制
   */

  // 是否被注入过
  const hasInjected = solAmount > 0 || injectTree.curr.children.length > 0

  // 是否可以注入SOL
  const couldInjectSOL = !injectTree.parent

  // 是否可以注入NFT
  // TODO 是否超出高度限制条件待调整
  const couldInjectNFT =
    injectTree.curr.children.length < MAX_CHILDREN_PER_LEVEL &&
    (!belong.parent || belong.parent.mint === belong.parent.rootMint)

  // 还可以注入几个NFT
  const couldInjectNFTNum = couldInjectNFT ? MAX_CHILDREN_PER_LEVEL - injectTree.curr.children.length : 0

  // 是否可以提取NFT
  const couldExtractNFT = injectTree.curr.children.length > 0

  // 是否可以提取sol
  const couldExtractSOL = !injectTree.parent && solAmount > 0

  // 是否可销毁
  const couldBurn = !injectTree.parent && hasInjected

  // 可不可以被操作
  const couldOps = !injectTree.parent?.isMutated

  // 执行提取nft
  const onSubmitExtractNFT = useCallback(
    async (nfts) => {
      console.log('onSubmitExtractNFT')
      if (!publicKey || !metadata) return
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
          parentMintKey: new PublicKey(metadata.mint),
        })
        tx.add(instruction)
        await sendWalletTrans(tx, connection, wallet)
        reloadWindow()
      }, TransctionType.EXTRACT)
    },
    [publicKey, metadata],
  )

  // 执行燃烧销毁
  const onBurn = useCallback(async () => {
    transactionPublic(async () => {
      gaEvent(ContractActionGA.BURN)
      if (!publicKey || !mintKey) return
      const tx = new Transaction()
      const instruction = await synftContract.burn(publicKey, mintKey)
      tx.add(instruction)
      await sendWalletTrans(tx, connection, wallet)
      navigate(`/`)
    }, TransctionType.BURN)
  }, [publicKey, mintKey])

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
        reloadInjectTree()
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
    <EnchanftedDetailWrapper>
      <ScrollBox>
        <MainContentBox>
          <EnchanftedDetailBox>
            {(loading && (
              <div className="tip">
                <img src={LoadingIcon} alt="" />
              </div>
            )) ||
              (validNFT && (
                <>
                  <div className="left">
                    <div className="img-box">
                      <img src={info?.externalMetadata?.image} alt={info?.externalMetadata?.image || ''} />
                    </div>
                    {/* <NFTShower
                data={{
                  jsonData: info?.externalMetadata,
                  injectTree: {
                    data: injectTree,
                    loading: injectTreeLoading,
                  },
                }}
              /> */}
                  </div>
                  <div className="right">
                    {metadata && (
                      <NFTHandler
                        data={{
                          metadata,
                          externalMetadata: info?.externalMetadata,
                          nftChildOptions: nftChildOptions,
                          solAmount: solAmount,
                        }}
                        viewConfig={{
                          displayConnectWalletTip: !publicKey ? true : false,
                          displayOnlyView: showViewOnly,
                          displayBelongToMe: showBelongToMe,
                          displayBurn: couldBurn,
                          disabledBurn: couldOps,
                          loadingBelong: belongLoading,
                          loadingBelongToMe: injectTreeLoading,
                        }}
                        onBurn={onBurn}
                        onSubmitExtractNFT={onSubmitExtractNFT}
                      />
                    )}
                    <NFTShower
                      data={{
                        externalMetadata: info?.externalMetadata,
                        injectTree: {
                          data: injectTree,
                          loading: injectTreeLoading,
                        },
                      }}
                    />
                  </div>
                </>
              )) || <div className="tip">invalid NFT</div>}
          </EnchanftedDetailBox>
        </MainContentBox>
      </ScrollBox>

      {/* 交易触发时页面进入的loading状态 */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={transactionState.inProgress}>
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
    </EnchanftedDetailWrapper>
  )
}
export default EnchanftedDetail
const EnchanftedDetailWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const EnchanftedDetailBox = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column-reverse;
  }
  .left,
  .right {
    width: 50%;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      width: 100%;
    }
  }
  .left {
    .img-box {
      box-sizing: border-box;
      border: 4px solid #222222;
      img {
        width: 100%;
      }
    }
  }
  .right {
    padding-left: 24px;
    box-sizing: border-box;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      padding: 12px;
      background: #fff;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
  }

  .tip {
    margin: 0 auto;
  }
`
