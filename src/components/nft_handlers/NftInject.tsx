/*
 * @Author: shixuewen
 * @Date: 2022-03-15 11:15:41
 * @LastEditTime: 2022-04-02 15:39:10
 * @LastEditors: Please set LastEditors
 * @Description: NFT 注入资产的表单组件，只收集注入时的相关数据和提交此次注入事件，跟注入无关的操作请在其它组件中执行
 * @FilePath: \synft-app\src\components\nft_handlers\NftInject.tsx
 */

import { Alert, AlertTitle } from '@mui/material'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import styled from 'styled-components'
import { NftDataItem } from '../NFTList'
import CheckedIcon from '../icons/checked.svg'
import { CursorPointerUpCss, DisabledMaskCss, FontFamilyCss } from '../../GlobalStyle'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ButtonDanger, ButtonPrimary, ButtonWarning } from '../common/ButtonBase'
import { MOBILE_BREAK_POINT } from '../../utils/constants'
import NftAdder from './NftAdder'
import { setuid } from 'process'
import { FormCouldOpsTooltipWrapper } from '../NFTHandler'

export type Token = {
  name: string
  address: string
  symbol: string
  image: string
  volume?: string
}
const TOKEN_DEFAULT = {
  name: '',
  address: '',
  symbol: '',
  image: '',
  volume: '',
}
export enum InjectMode {
  Reversible = 'Reversible',
  Irreversible = 'Irreversible',
}

// 可选的提交按钮类型
type SubmitBtnType = 'primary' | 'warning' | 'danger'

// 表单视图显示可选配置
interface FormOption {
  // 显示nft表单项
  displayNftForm?: boolean
  // 显示sol表单项
  displaySolForm?: boolean
  // 显示mode表单项
  displayModeForm?: boolean
  // 显示nft表单项的标题
  displayNftLabel?: boolean
  // 显示sol表单项的标题
  displaySolLabel?: boolean
  // 显示mode表单项的标题
  displayModeLabel?: boolean
  // nft表单项的标题
  nftLabel?: string
  // sol表单项的标题
  solLabel?: string
  // mode表单项的标题
  modeLabel?: string
  // 提交按钮的标题
  submitBtnLabel?: string
  // 提交按钮的类型
  submitBtnType?: SubmitBtnType
  // 是否允许操作
  couldOps?: boolean
}
// 表单默认配置
const FormOptionDefault: FormOption = {
  displayNftForm: true,
  displaySolForm: true,
  displayModeForm: true,
  displayNftLabel: true,
  displaySolLabel: true,
  displayModeLabel: true,
  nftLabel: 'Embed other NFTs',
  solLabel: 'Create synthetic NFTs',
  modeLabel: 'Select Mode',
  submitBtnLabel: '> Embed NFT <',
  submitBtnType: 'primary',
  couldOps: false,
}
export interface OnInjectProps {
  injectMode: InjectMode
  token: Token
  nfts: NftDataItem[]
}
interface Props {
  // 显示的表单配置
  formOption?: FormOption
  // NFT 可选项
  nftOptions: NftDataItem[]
  // 最多还可注入多少个nft
  nftInjectMaxNum?: number
  // 执行注入的回调
  onInject?: (props: OnInjectProps) => void
}

const INJECT_MODES = [InjectMode.Reversible, InjectMode.Irreversible]

// 提交按钮类型对应的按钮组件
const submitBtns = {
  primary: ButtonPrimary,
  warning: ButtonWarning,
  danger: ButtonDanger,
}

export default React.forwardRef(({ formOption, nftOptions, nftInjectMaxNum, onInject }: Props, ref: any) => {
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setNfts([])
      setToken(TOKEN_DEFAULT)
      setInjectMode(InjectMode.Reversible)
    },
  }))
  const {
    displayNftForm,
    displaySolForm,
    displayModeForm,
    displayNftLabel,
    displaySolLabel,
    displayModeLabel,
    nftLabel,
    solLabel,
    modeLabel,
    submitBtnLabel,
    submitBtnType,
    couldOps,
  } = { ...FormOptionDefault, ...(formOption || {}) }
  const { connection } = useConnection()
  const wallet = useWallet()
  const [balance, setBalance] = useState(0)
  const [injectMode, setInjectMode] = useState<InjectMode>(InjectMode.Reversible)
  const [token, setToken] = useState<Token>(TOKEN_DEFAULT)
  const [nfts, setNfts] = useState<NftDataItem[]>([])
  const [checkTip, setCheckTip] = useState({ visible: false, msg: '' })

  // 显示验证提示
  const showValidate = (msg: string) => {
    setCheckTip({ visible: true, msg })
    setTimeout(() => {
      setCheckTip({ visible: false, msg: '' })
    }, 5000)
  }
  // 验证余额是否足够
  const validateBalance = (): boolean => {
    setCheckTip({ visible: false, msg: '' })
    if (Number(token.volume) && Number(token.volume) * Math.pow(10, 9) > balance) {
      showValidate('Insufficient balance')
      return false
    } else {
      return true
    }
  }
  // 提交表单
  const handleSubmit = () => {
    if (!onInject) return
    // 如果可能需要验证填入的金额和选择的NFT
    if (displaySolForm && displayNftForm) {
      // 验证是否输入金额或选择其它nft
      if (!Number(token.volume) && nfts.length === 0) {
        showValidate('Please enter an asset or select an NFT')
        return
      }
    } else if (displaySolForm) {
      // 如果只需要验证填入的金额
      if (!Number(token.volume)) {
        showValidate('Please enter an asset')
        return
      }
      if (!validateBalance()) return
    } else if (displayNftForm) {
      // 如果只需要验证选择的NFT
      if (nfts.length === 0) {
        showValidate('Please select NFT')
        return
      }
    }
    onInject({ injectMode, token, nfts })
  }
  // 获取当前账户余额
  useEffect(() => {
    if (!wallet.publicKey) return
    ;(async (publicKey) => {
      const _balance = await connection.getBalance(publicKey)
      setBalance(_balance)
    })(wallet.publicKey)
  }, [wallet])

  // 输入金额时验证余额是否足够
  useEffect(() => {
    if (token.volume) validateBalance()
  }, [token.volume])

  // 提交按钮
  const SubmitBtn = submitBtns[submitBtnType as SubmitBtnType]

  return (
    <NftInjectWrapper>
      {displaySolForm && (
        <div className="form-item">
          {displaySolLabel && <div className="form-label">{solLabel}</div>}
          <div className={`form-value`}>
            <FormCouldOpsTooltipWrapper enable={!couldOps}>
              <input
                type="number"
                className={`token-value`}
                style={{
                  opacity: !couldOps ? 0.5 : 1,
                  pointerEvents: !couldOps ? 'none' : 'auto',
                }}
                disabled={!couldOps}
                placeholder="0.00"
                min="0"
                value={token.volume}
                onChange={(e) => setToken({ ...token, volume: e.target.value })}
              />
            </FormCouldOpsTooltipWrapper>
          </div>
        </div>
      )}

      {displayNftForm && (
        <div className="form-item">
          {displayNftLabel && <div className="form-label">{nftLabel}</div>}
          <div className={`form-value`}>
            <FormCouldOpsTooltipWrapper enable={!couldOps}>
              <NftAdder
                disabled={!couldOps}
                options={nftOptions}
                selectedList={nfts}
                onChange={(nfts) => setNfts(nfts)}
                maxSelectNum={nftInjectMaxNum}
              />
            </FormCouldOpsTooltipWrapper>
          </div>
        </div>
      )}

      {/* {displayModeForm && (
        <div className="form-item">
          {displayModeLabel && <div className="form-label">{modeLabel}</div>}
          <FormCouldOpsTooltipWrapper enable={!couldOps}>
            <div className={`form-value mode-selector ${!couldOps ? 'disabled' : ''}`}>
              {INJECT_MODES.map((item) => (
                <div
                  key={item}
                  className={`mode-item ${injectMode === item ? 'mode-checked' : ''}`}
                  onClick={() => setInjectMode(item)}
                >
                  <div className="mode-checked-icon">{injectMode === item && <img src={CheckedIcon} alt="" />}</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </FormCouldOpsTooltipWrapper>
        </div>
      )} */}

      {checkTip.visible && (
        <Alert severity="warning" className="form-check-tip form-check-tip-text">
          <AlertTitle className="form-check-tip form-check-tip-title">Warning</AlertTitle>
          {checkTip.msg}
        </Alert>
      )}
      <FormCouldOpsTooltipWrapper enable={!couldOps}>
        <SubmitBtn
          style={{ pointerEvents: !couldOps ? 'none' : 'auto' }}
          disabled={!couldOps}
          className={`form-submit`}
          onClick={handleSubmit}
        >
          {submitBtnLabel}
        </SubmitBtn>
      </FormCouldOpsTooltipWrapper>
    </NftInjectWrapper>
  )
})
const NftInjectWrapper = styled.div`
  .disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }
  .form-item {
    margin-bottom: 24px;
    .form-label {
      font-size: 16px;
      text-transform: uppercase;
      color: rgba(34, 34, 34, 0.5);
      margin-bottom: 12px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 14px;
      }
    }
  }
  .token-value {
    width: 100%;
    height: 60px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    padding: 12px 16px;
    ${CursorPointerUpCss}
  }
  .mode-selector {
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    display: flex;
    color: rgba(34, 34, 34, 0.5);
    justify-content: space-around;
    align-items: center;
    .mode-item {
      display: flex;
      padding: 18px 0;
      ${CursorPointerUpCss}
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 12px;
      }
    }
    .mode-checked {
      color: #222222;
    }
    .mode-checked-icon {
      width: 10px;
      height: 15px;
      margin-right: 16px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        margin-right: 5px;
      }
    }
  }
  .form-check-tip {
    ${FontFamilyCss}
  }
  .form-check-tip-text {
    font-size: 10px;
  }
  .form-submit {
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
  }
`
