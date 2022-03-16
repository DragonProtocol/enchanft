import { useConnection } from '@solana/wallet-adapter-react'
import log from 'loglevel'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
import useInfoFromMint from '../../hooks/useInfoFromMint'
import { NftDataItem } from '../NFTList'
import { InjectMode, InjectType, Token } from './NftInject'
import SolanaSolLogo from '../imgs/solanaSolLogo.svg'
import { useNavigate } from 'react-router-dom'
import { ButtonDanger, ButtonPrimary } from '../common/ButtonBase'
interface Props {
  injectType: InjectType
  injectMode: InjectMode
  data: any[]
  onExtract?: () => void
  onWithdraw?: () => void
}
const NftBurn: React.FC<Props> = ({ injectMode, data, onExtract, onWithdraw }: Props) => {
  const navigate = useNavigate()
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
          return { ...item.data, ...jsonData }
        })
      const res = await Promise.allSettled(promises)
      const jsonData = res
        .filter((item) => item.status === 'fulfilled')
        .map((item: any) => {
          return { ...item, ...item.value }
        })
      setNFTJsonData(jsonData)
    })()
  }, [data])
  return (
    <NftBurnWrapper>
      <div className="nft-list">
        {nftJsonData.map((item) => (
          <div key={item.name} className="nft-item" onClick={() => navigate(`/info/${item.mint}`)}>
            <img className="nft-item" src={item.image} />
          </div>
        ))}
      </div>

      {existsSOL && (
        <div className="token-list">
          <div className="token-item">
            <img className="token-img" src={SolanaSolLogo} alt="" />
            <span className="token-symbol">SOL</span>
            <span className="token-volume">{data[dataLen - 1].lamports / 1000000000}</span>
          </div>
        </div>
      )}

      {injectMode === InjectMode.Reversible && (
        <ButtonDanger className="burn-btn" onClick={onExtract}>
          {' '}
          {'> extract <'}{' '}
        </ButtonDanger>
      )}
      <ButtonDanger className="burn-btn" onClick={onWithdraw}>
        {' '}
        {'> burnWithdraw <'}{' '}
      </ButtonDanger>
    </NftBurnWrapper>
  )
}
export default NftBurn
const NftBurnWrapper = styled.div`
  .token-list {
    .token-item {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 16px;
      gap: 16px;
      font-size: 14px;
      color: #222222;
      .token-img {
        width: 36px;
        height: 36px;
      }
    }
  }
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .nft-item {
      width: 120px;
      height: 120px;
      margin-right: 8px;
    }
  }

  .burn-btn {
    margin-top: 24px;
  }
`
