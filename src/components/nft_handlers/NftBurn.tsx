import { useConnection } from '@solana/wallet-adapter-react'
import log from 'loglevel'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
import useInfoFromMint from '../../hooks/useInfoFromMint'
import { NftDataItem } from '../NFTList'
import { InjectMode, InjectType, Token } from './NftInject'
interface Props {
  injectType: InjectType
  injectMode: InjectMode
  data: any[]
  onExtract?: () => void
  onWithdraw?: () => void
}
const NftBurn: React.FC<Props> = ({ injectMode, data, onExtract, onWithdraw }: Props) => {
  const dataLen = data.length
  const existsSOL = data[dataLen - 1]?.injectType == 'sol'

  const [nftJsonData, setNFTJsonData] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const promises = data
        .filter((item) => item.injectType !== 'sol')
        .map(async (item) => {
          const response = await fetch(item.data.data.uri)
          const jsonData = await response.json()
          return jsonData
        })
      const res = await Promise.allSettled(promises)
      const jsonData = res
        .filter((item) => item.status === 'fulfilled')
        .map((item: any) => {
          return item.value
        })
      setNFTJsonData(jsonData)
    })()
  }, [data])

  return (
    <NftBurnWrapper>
      {nftJsonData.map((item) => (
        <div key={item.name} className="nft-list">
          <img className="nft-item" src={item.image} />
        </div>
      ))}
      {existsSOL && (
        <div className="token-list">
          <div className="token-item">
            {/* <img className="token-img" src={item.image} alt="" /> */}
            {/* <span className="token-symbol">{item.symbol}</span> */}
            <span className="token-address">{data[dataLen - 1].lamports}</span>
          </div>
        </div>
      )}
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
