/*
 * @Author: shixuewen
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-03-24 15:47:16
 * @LastEditors: Please set LastEditors
 * @Description: nft卡片视图组件
 * @FilePath: \synft-app\src\components\NFTCard.tsx
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../utils/constants'
import { NftDataItem } from './NFTList'
interface Props {
  data: NftDataItem
}
const NFTCard: React.FC<Props> = ({ data }: Props) => {
  return (
    <NFTCardWrapper>
      <div className="img-box">
        {data.hasCopied && <span className="tag tag-synthesized">Synthesized</span>}
        {/* {data.hasInjected && <span className="tag tag-enchanted">Enchanted</span>} */}
        <img src={data.image} className="img" />
      </div>
      <div className="name">{data.name}</div>
    </NFTCardWrapper>
  )
}
export default NFTCard
const NFTCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  .img-box {
    width: 100%;
    height: 250px;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    margin-bottom: 15px;
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
