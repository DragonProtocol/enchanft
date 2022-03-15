import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
import { NftDataItem } from '../NFTList'
import { InjectMode, InjectType, Token } from './NftInject'
interface Props {
  injectType: InjectType
  injectMode: InjectMode
  data: any[]
  onExtract?: () => void
  onWithdraw?: () => void
}
const NftBurn: React.FC<Props> = ({ injectType, injectMode, data, onExtract, onWithdraw }: Props) => {
  console.log('data-1', data)
  useEffect(() => {
    ;(async () => {
      // if (injectType !== InjectType.Nft || !data.length) return
      // const promises = []
      // console.log('data-2', data)
      // for (const item of data) {
      //   if(!item.injectType) continue
      //   console.log('item.data.data.uri',item.data.data.uri);
        
      //   const response = await fetch(item.data.data.uri)
      //   const jsonData = await response.json()
      //   promises.push(jsonData)
      // }
      // const res: any[] = await Promise.allSettled(promises)
    })()
  }, [data])
  // TODO 获取nft列表数据
  const nftList = data.filter(v=>v.injectType!=='sol').map(item=>({mint:item?.data?.mint,image:''}))
  console.log('nftList', nftList)
  return (
    <NftBurnWrapper>
      {injectType === InjectType.Token &&
        data?.map((item) => (
          <div className="token-list">
            <div className="token-item">
              <img className="token-img" src={item.image} alt="" />
              <span className="token-symbol">{item.symbol}</span>
              <span className="token-address">{item.lamports}</span>
            </div>
          </div>
        ))}
      {injectType === InjectType.Nft &&
        nftList?.map((item) => (
          <div className="nft-list">
            <img className="nft-item" src={item.image} alt={item.mint} />
          </div>
        ))}
      {injectMode === InjectMode.Reversible && (
        <button className="burn-btn" onClick={onExtract}>
          {'> extract <'}
        </button>
      )}
      <button className="burn-btn" onClick={onWithdraw}>
        {'> burnWithdraw <'}
      </button>
    </NftBurnWrapper>
  )
}
export default NftBurn
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
const NftBurnWrapper = styled.div`
  .token-list {
    .token-item {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 16px;
      gap: 16px;
    }
  }
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .nft-item {
      flex: 1;
      margin: 0 8px 8px 0; // 间隙为8px
      width: calc((100% - 32px) / 4); // 这里的32px = (分布个数3-1)*间隙4px, 可以根据实际的分布个数和间隙区调整
      min-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
      max-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
    }
  }

  .burn-btn {
    ${ButtonBaseCss}
    background: #D60606;
    margin-top: 24px;
  }
`
