import { Dialog, DialogContent, DialogTitle} from '@mui/material'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { NftDataItem } from '../NFTList'
import DialogCloseIcon from '../icons/dialogClose.svg'
import CheckedIcon from '../icons/checked.svg'
import NFTCard from '../NFTCard'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
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
export enum InjectType {
  Token = 'Token',
  Nft = 'Nft',
}
export interface OnInjectProps {
  injectMode: InjectMode
  injectType: InjectType
  token: Token
  nft: NftDataItem
}
interface Props {
  nftOptions: NftDataItem[]
  onInject?: (props: OnInjectProps) => void
}
const INJECT_MODES = [InjectMode.Reversible, InjectMode.Irreversible]
const NftInject: React.FC<Props> = ({ nftOptions, onInject }: Props) => {
  const [injectMode, setInjectMode] = useState<InjectMode>(InjectMode.Reversible)
  const [token, setToken] = useState<Token>(TOKEN_DEFAULT)
  const [nft, setNft] = useState<NftDataItem>({ mint: '', image: '', name: '' })
  const [visibleNftList, setVisibleNftList] = useState(false)
  const disabledToken = nft?.name ? true : false
  const disabledNft = token?.volume ? true : false
  const injectType = disabledToken ? InjectType.Nft : InjectType.Token
  const handleOpenNftList = () => {
    setVisibleNftList(true)
  }
  const handleCloseNftList = () => {
    setVisibleNftList(false)
  }
  const handleCheckedNft = (nft: NftDataItem) => {
    setNft(nft)
    setVisibleNftList(false)
  }
  const handleDeleteNft = () => setNft({ mint: '', image: '', name: '' })
  console.log('nft', nft)

  return (
    <NftInjectWrapper>

      <div className="form-item">
        <div className="form-label">Create synthetic NFTs</div>
        <div className="form-value">
          <input
            type="number"
            className={`token-value ${disabledToken ? 'disabled' : ''}`}
            placeholder="0.00"
            value={token.volume}
            onChange={(e) => setToken({ ...token, volume: e.target.value })}
          />
        </div>
      </div>
      <div className="form-item">
        <div className="form-label">Injection of NFT</div>
        <div className={`form-value select-nft-btn ${disabledNft ? 'disabled' : ''}`} onClick={handleOpenNftList}>
          {nft?.name && (
            <div className="delete-btn" onClickCapture={handleDeleteNft}>
              x
            </div>
          )}
          <img src={nft.image} alt="" />
          {nft.name}
        </div>
      </div>
      <div className="form-item">
        <div className="form-label">Select Mode</div>
        <div className="form-value mode-selector">
          {INJECT_MODES.map((item) => (
            <div key={item} className={`mode-item ${injectMode === item ? 'mode-checked' : ''}`} onClick={() => setInjectMode(item)}>
              {injectMode === item && <img className="mode-checked-icon" src={CheckedIcon} alt="" />}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="form-submit" onClick={() => onInject && onInject({ injectMode, injectType, token, nft })}>
        {'> Create synthetic NFTs <'}
      </button>

      <Dialog fullWidth={true} maxWidth="sm" onClose={handleCloseNftList} open={visibleNftList}>
        <DialogTitle>
          <div className="nft-list-title">
            <span>Select NFT</span>
            <img className="close-btn" src={DialogCloseIcon} alt="" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="nft-list-content">
            {nftOptions.map((item,idx) => {
              return (
                <div className="nft-item" key={idx} onClick={() => handleCheckedNft(item)}>
                  <NFTCard data={item}></NFTCard>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

    </NftInjectWrapper>
  )
}
export default NftInject
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
const NftInjectWrapper = styled.div`
  .disabled {
    pointer-events: none;
  }
  .form-item {
    margin-bottom: 24px;
    .form-label {
      font-size: 16px;
      text-transform: uppercase;
      color: rgba(34, 34, 34, 0.5);
      margin-bottom: 12px;
    }
  }
  .token-value {
    width: 100%;
    height: 60px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    padding: 12px 16px;
  }
  .select-nft-btn {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    position: relative;
    .delete-btn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      background: red;
      text-align: center;
      color: #ffffff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      ${CursorPointerUpCss}
    }
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
      padding: 18px 0;
      ${CursorPointerUpCss}
    }
    .mode-checked {
      color: #222222;
    }
    .mode-checked-icon {
      margin-right: 16px;
    }
  }
  .nft-list-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .nft-list-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .nft-item {
      flex: 1;
      margin: 0 8px 8px 0; // 间隙为8px
      width: calc((100% - 32px) / 4); // 这里的32px = (分布个数3-1)*间隙4px, 可以根据实际的分布个数和间隙区调整
      min-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
      max-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
      ${CursorPointerUpCss}
    }
  }
  .form-submit {
      ${ButtonBaseCss}
      height: 60px;
      background: #EBB700;
  }
`
