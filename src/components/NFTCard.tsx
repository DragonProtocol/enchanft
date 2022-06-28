/*
 * @Author: shixuewen
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-06-24 18:46:58
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: nft卡片视图组件
 * @FilePath: \synft-app\src\components\NFTCard.tsx
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../utils/constants'
import { NftDataItem } from './NFTList'
import SolanaIcon from './icons/solana.png'
interface Props {
  data: NftDataItem
}
const NFTCard: React.FC<Props> = ({ data }: Props) => {
  return (
    <NFTCardWrapper>
      <div className="img-box">
        {/* {data.hasCopied && <span className="tag tag-synthesized">Synthesized</span>}
        {data.hasInjected && <span className="tag tag-enchanted">Enchanted</span>} */}
        <img src={data.image} className="img" />
      </div>
      <EnchaNFTedNameBox>
        <EnchaNFTedName>{data.name}</EnchaNFTedName>
        {/* <EnchaNFTedProjectName>TODO: project name</EnchaNFTedProjectName> */}
      </EnchaNFTedNameBox>
      {/* <EnchaNFTedAmountBox>
        <EnchaNFTedAmountTitle>EnchaNFTed</EnchaNFTedAmountTitle>
        <EnchaNFTedAmount>
          <img src={SolanaIcon} alt="" />
          <span>TODOSOL</span>
        </EnchaNFTedAmount>
      </EnchaNFTedAmountBox> */}
    </NFTCardWrapper>
  )
}
export default NFTCard
const NFTCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #222222;
  box-sizing: border-box;
  .img-box {
    width: 100%;
    height: 250px;
    box-sizing: border-box;
    position: relative;
    @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
      height: auto;
    }
    .tag {
      position: absolute;
      top: 0;
      left: 0;
      padding: 8px;
      background: #e4ffdb;
      border: 2px solid #222222;
      border-top: none;
      border-left: none;
      box-sizing: border-box;
      font-size: 12px;
    }
    .tag-synthesized {
      background: #fffbdb;
    }
    .tag-enchanted {
      background: #e4ffdb;
    }
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    font-size: 14px;
    line-height: 14px;
    color: #222222;
  }
`
const EnchaNFTedNameBox = styled.div`
  padding: 16px;
`
const EnchaNFTedName = styled.div`
  font-size: 16px;
  line-height: 16px;
`

const EnchaNFTedProjectName = styled.div`
  font-size: 12px;
  line-height: 12px;
  color: #3dd606;
  margin-top: 12px;
`

const EnchaNFTedAmountBox = styled.div`
  padding: 28px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(34, 34, 34, 0.05);
`

const EnchaNFTedAmountTitle = styled.div`
  font-size: 12px;
  line-height: 12px;
`
const EnchaNFTedAmount = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  line-height: 14px;
  img {
    width: 24px;
    height: 24px;
  }
`
