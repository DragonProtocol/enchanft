import React, { useEffect, useState, useCallback, useRef, createRef, Children, ReactChildren, useMemo } from 'react'
import styled from 'styled-components'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { Dialog } from '@mui/material'

import { MOBILE_BREAK_POINT, VIEW_LAMPORTS_DECIMAL } from '../../../constants'
import { lamportsToSol } from '../../../utils/solana'
import { NFTDataItem, Node } from '../../../types/synft'
import RemindConnectWallet from './RemindConnectWallet'
import { ButtonDanger, ButtonInfo, ButtonPrimary } from '../../common/button/ButtonBase'
import ModalNftSelector from './nft_handlers/ModalNftSelector'
import TooltipWrapper from '../../common/TooltipWrapper'
import { FontFamilyCss } from '../../../GlobalStyle'
import { NFTNodeDataItem, ExternalMetadata } from '../../../types/synft'
import LoadingIcon from './imgs/Loading.gif'
import SolanaIcon from './icons/solana.png'

export type NFTHandlerDataType = {
  solAmount: number
  metadata: Metadata
  externalMetadata: ExternalMetadata
  nftChildOptions: NFTNodeDataItem[]
}
export type NFTHandlerViewConfigType = {
  displayConnectWalletTip?: boolean
  displayOnlyView?: boolean
  displayBelongToMe?: boolean
  displayBurn?: boolean
  disabledBurn?: boolean
  loadingBelong?: boolean
  loadingBelongToMe?: boolean
}

export type NFTHandlerDataViewType = {
  data: NFTHandlerDataType
  viewConfig?: NFTHandlerViewConfigType
}

export type NFTHandlerHandlesType = {
  onBurn?: () => void
  onSubmitExtractNFT?: (nftNodeData: NFTDataItem[]) => void
}

export type NFTHandlerProps = NFTHandlerDataViewType & NFTHandlerHandlesType

const defaultViewConfig: NFTHandlerViewConfigType = {
  displayConnectWalletTip: false,
  displayOnlyView: false,
  displayBelongToMe: false,
  displayBurn: false,
  disabledBurn: false,
  loadingBelong: false,
  loadingBelongToMe: false,
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
const NFTHandler: React.FC<NFTHandlerProps> = ({ data, viewConfig, onBurn, onSubmitExtractNFT }: NFTHandlerProps) => {
  const { solAmount, metadata, externalMetadata, nftChildOptions } = data
  const {
    displayConnectWalletTip,
    displayOnlyView,
    displayBelongToMe,
    displayBurn,
    disabledBurn,
    loadingBelong,
    loadingBelongToMe,
  } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const [openBurnConfirm, setOpenBurnConfirm] = useState(false)
  // 是否打开模态框选择要提取的NFT
  const [openExtractNftModal, setOpenExtractNftModal] = useState(false)
  return (
    <NFTHandlerWrapper>
      <div className="top">
        <div className="nft-title">
          {metadata.data.name}
          {/* TODO 项目编号 */}
          {/* #5553 */}
        </div>

        <div className="nft-project">
          {externalMetadata?.collection?.name || externalMetadata?.collection?.family || 'unknown collection'}
        </div>
      </div>
      <div className="handler-form">
        {(displayConnectWalletTip && (
          <RemindConnectWalletBox>
            <RemindConnectWallet />
          </RemindConnectWalletBox>
        )) || (
          <>
            {loadingBelong ? (
              <p>
                <img src={LoadingIcon} alt="" />
              </p>
            ) : (
              <>
                {displayOnlyView && (
                  <div className="only-view">
                    <span className="expression">😯</span>{' '}
                    <span className="description">This NFT has been synthesized</span>
                  </div>
                )}
                {displayBelongToMe && (
                  <>
                    {(loadingBelongToMe && (
                      <p>
                        <img src={LoadingIcon} alt="" />
                      </p>
                    )) || (
                      <>
                        {displayBurn && (
                          <BurnEnchanftedWrapper>
                            <BurnEnchanftedTitle>Enchanfted</BurnEnchanftedTitle>
                            <BurnEnchanftedAmountBox>
                              <img src={SolanaIcon} alt="" />
                              <span>{lamportsToSol(solAmount).toFixed(VIEW_LAMPORTS_DECIMAL)}</span>
                              <span>SOL</span>
                            </BurnEnchanftedAmountBox>
                            <FormCouldOpsTooltipWrapper enable={!!disabledBurn}>
                              <ButtonDanger
                                style={{
                                  pointerEvents: disabledBurn ? 'none' : 'auto',
                                  marginTop: '32px',
                                  marginBottom: '0px',
                                }}
                                className={`handle-btn`}
                                disabled={disabledBurn}
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
                                    onClick={() => {
                                      setOpenBurnConfirm(false)
                                      onBurn && onBurn()
                                    }}
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
              onSubmit={(nfts) => {
                setOpenExtractNftModal(false)
                onSubmitExtractNFT && onSubmitExtractNFT(nfts)
              }}
            ></ModalNftSelector>
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
