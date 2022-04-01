/*
 * @Author: your name
 * @Date: 2022-04-01 12:29:48
 * @LastEditTime: 2022-04-01 16:38:50
 * @LastEditors: Please set LastEditors
 * @Description: NFT 选择添加器
 * @FilePath: \synft-app\src\components\nft_handlers\NftAdder.tsx
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { NftDataItem, NFTListWrapper } from '../NFTList'
import ModalNftSelector from './ModalNftSelector'
import AddIcon from '../icons/add.svg'
import { CursorPointerUpCss } from '../../GlobalStyle'
interface Props {
  /** 列表可选项 */
  options: NftDataItem[]
  /** 选中的列表 */
  selectedList?: NftDataItem[]
  /** 最多可选择的数量 */
  maxSelectNum?: number
  /** 选中的列表发生改变 */
  onChange: (data: NftDataItem[]) => void
  /**禁用 */
  disabled?: boolean
}
const NftAdder: React.FC<Props> = ({ options, selectedList = [], maxSelectNum, onChange, disabled }: Props) => {
  const [open, setOpen] = useState(false)
  const handleAdd = () => {
    if (maxSelectNum === undefined || selectedList.length < maxSelectNum) {
      setOpen(true)
    } else {
      alert('最多只能选择' + maxSelectNum + '个')
    }
  }
  const handleDel = (data: NftDataItem) => {
    onChange(selectedList.filter((item) => item.mint !== data.mint))
  }
  const handleSubmit = (data: NftDataItem[]) => {
    onChange(data)
    handleClose()
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <NftAdderWrapper>
      <div className={`nft-list ${disabled ? 'disabled' : ''}`}>
        {selectedList.map((nft) => (
          <div className="nft-box nft-item" key={nft.mint}>
            <div className="nft-del" onClickCapture={() => handleDel(nft)}>
              x
            </div>
            <img src={nft.image} alt="" className="nft-img" />
          </div>
        ))}
        <div className={`nft-box nft-add`} onClick={handleAdd}>
          <img src={AddIcon} alt="" />
        </div>
      </div>

      {/* NFT 列表选择模态框 */}
      <ModalNftSelector
        options={options}
        selectedList={selectedList}
        maxSelectNum={maxSelectNum}
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        onSubmit={handleSubmit}
      ></ModalNftSelector>
    </NftAdderWrapper>
  )
}
export default NftAdder
const NftAdderWrapper = styled.div`
  .disabled {
    pointer-events: none;
    ::before {
      content: '';
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background: #ccc;
    }
  }
  .nft-box {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .nft-add {
    ${CursorPointerUpCss}
  }
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 18px;
    .nft-item {
      .nft-img {
        width: 100%;
        height: 100%;
      }
      .nft-del {
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
  }
`
