/*
 * @Author: shixuewen
 * @Date: 2022-03-31 18:38:56
 * @LastEditTime: 2022-04-01 18:59:23
 * @LastEditors: Please set LastEditors
 * @Description: NFT 列表选择模态框
 * @FilePath: \synft-app\src\components\nft_handlers\ModalNftSelector.tsx
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { NftDataItem, NFTListWrapper } from '../NFTList'
import NFTCard from '../NFTCard'
import DialogCloseIcon from '../icons/dialogClose.svg'
import { ButtonPrimary, ButtonWarning } from '../common/ButtonBase'
import { FontFamilyCss } from '../../GlobalStyle'
interface Props {
  /** 列表可选项 */
  options: NftDataItem[]
  /** 选中的列表 */
  selectedList?: NftDataItem[]
  /** 模态框是否打开 */
  open: boolean
  /** 最多可选择的数量 */
  maxSelectNum?: number
  /** 关闭事件 */
  onClose?: () => void
  /** 取消事件 */
  onCancel?: () => void
  /** 提交事件 */
  onSubmit?: (data: NftDataItem[]) => void
}
const ModalNftSelector: React.FC<Props> = ({
  options,
  selectedList = [],
  maxSelectNum,
  onClose,
  onCancel,
  onSubmit,
  open,
}: Props) => {
  const [selectedListCache, setSelectedListCache] = useState<NftDataItem[]>(selectedList)
  const handleSelect = (data: NftDataItem) => {
    const findIndex = selectedListCache.findIndex((item) => item.mint === data.mint)
    if (findIndex === -1) {
      if (maxSelectNum === undefined || selectedListCache.length < maxSelectNum) {
        setSelectedListCache([...selectedListCache, data])
      } else {
        alert('最多只能选择' + maxSelectNum + '个')
      }
    } else {
      setSelectedListCache(selectedListCache.filter((item) => item.mint !== data.mint))
    }
  }
  const handleCancel = () => {
    setSelectedListCache(selectedList)
    onCancel && onCancel()
  }
  useEffect(() => {
    if (open) {
      setSelectedListCache(selectedList)
    }
  }, [open])
  return (
    <ModalNftSelectorWrapper fullWidth={true} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle className="nft-list-title">
        <div>Select NFT</div>
        <img className="close-btn" src={DialogCloseIcon} onClick={onClose} />
      </DialogTitle>
      <DialogContent className="nft-list-content" dividers>
        {options.length > 0 ? (
          options.map((item, idx) => {
            const checked = selectedListCache.findIndex((v) => v.mint === item.mint) !== -1
            const disabled = !checked && maxSelectNum !== undefined && selectedListCache.length >= maxSelectNum
            return (
              <div
                className={`list-item ${disabled ? 'item-disabled' : ''}`}
                key={item.mint}
                onClick={() => handleSelect(item)}
              >
                <Checkbox className="item-checkbox" disabled={disabled} checked={checked} />
                <NFTCard data={item as NftDataItem}></NFTCard>
              </div>
            )
          })
        ) : (
          <div style={{ textAlign: 'center', height: '50px', lineHeight: '50px' }}>You have no NFT!</div>
        )}
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <ButtonWarning autoFocus onClick={handleCancel}>
            Cancel
          </ButtonWarning>
        )}
        {onSubmit && <ButtonPrimary onClick={() => onSubmit(selectedListCache)}>Submit</ButtonPrimary>}
      </DialogActions>
    </ModalNftSelectorWrapper>
  )
}
export default ModalNftSelector
const ModalNftSelectorWrapper = styled(Dialog)`
  .nft-list-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${FontFamilyCss}
  }
  .nft-list-content {
    padding-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 16px;
    .list-item {
      width: 250px;
      position: relative;
      .item-checkbox {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
      }
      .item-disabled {
        pointer-events: none;
        ::before {
          content: '';
          width: 100%;
          height: 100%;
          opacity: 0.5;
          background: #ccc;
        }
      }
    }
  }
`
