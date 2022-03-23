import React, { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'

import NFTList, { NftDataItem } from '../components/NFTList'
import { getMyNFTokens, clearMyNFT, selectMyNFTData, selectMyNFTDataStatus } from '../features/my/mySlice'
import {
  getExploreData,
  getExploreDataWithCollectionId,
  selectExploreData,
  selectExploreStatus,
  selectExploreDataHasGetCollectionIds,
} from '../features/explore/exploreSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

import { collections } from '../utils'
import { ButtonPrimary, ButtonWarning } from '../components/common/ButtonBase'
import ButtonConnectWallect from '../components/common/ButtonConnectWallet'
import SplitTextOpacity, { SplitTextOpacityFuns } from '../components/common/animate/SplitTextOpacity'
import LoadingIcon from '../components/imgs/Loading.gif'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { backToTop, getLayoutMainScrollBox } from '../utils/tools'
import RemindConnectWallet from '../components/RemindConnectWallet'

function Home() {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()
  const [tab, setTab] = useState(localStorage.getItem('tab') || 'explore') // explore | my
  const titleRefExplore = useRef<SplitTextOpacityFuns>(null)
  const titleRefMy = useRef<SplitTextOpacityFuns>(null)
  const titleRefMy2 = useRef<SplitTextOpacityFuns>(null)
  const switchList = (name: string) => {
    if (name === tab) {
      switch (name) {
        case 'explore':
          if (titleRefExplore?.current) {
            titleRefExplore.current.restart()
          }
          break
        case 'my':
          if (titleRefMy?.current) {
            titleRefMy.current.restart()
          }
          if (titleRefMy2?.current) {
            titleRefMy2.current.restart()
          }
          break
        default:
          break
      }
    }
    setTab(name)

    localStorage.setItem('tab', name)
  }
  const dispatch = useAppDispatch()

  const exploreNFTStatus = useAppSelector(selectExploreStatus)
  const exploreNFTData = useAppSelector(selectExploreData)

  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)

  useEffect(() => {
    if (!wallet.publicKey) {
      walletRef.current = ''
      dispatch(clearMyNFT())
      return
    }
    if (walletRef.current === wallet.publicKey.toString()) return

    walletRef.current = wallet.publicKey.toString()
    const owner = wallet.publicKey
    dispatch(getMyNFTokens({ owner }))
  }, [wallet])

  useEffect(() => {
    if (exploreNFTStatus === 'init') {
      dispatch(getExploreDataWithCollectionId({ collectionId: collections[0] }))
      // 分步取数据的 DEMO，collections 可与 selectExploreDataHasGetCollectionIds 做 diff
      setTimeout(() => {
        dispatch(getExploreDataWithCollectionId({ collectionId: collections[1] }))
      }, 15000)
    }
  }, [])

  useEffect(() => {
    // 滚动条滚动到顶部(为了移动端更友好些)
    backToTop()
  }, [tab])
  const nftList: NftDataItem[] = tab === 'my' ? myNFTData : exploreNFTData
  // TODO 列表滚动加载实现

  return (
    <HomeWrapper>
      <div className="tab">
        <div className="guide-item guide-explore">
          <div className="guide-desc">🔥 View Popular NFTs and create synthetic NFTs</div>
          <ButtonWarning className="guide-btn" onClick={() => switchList('explore')}>
            {'> Explore NFT <'}
          </ButtonWarning>
        </div>
        <div className="guide-item guide-view-my">
          <div className="guide-desc">🔗 EMBED NFTs AND SOL INTO YOUR OWN NFTs</div>
          <ButtonPrimary className="guide-btn" onClick={() => switchList('my')}>
            {'> View My NFT <'}
          </ButtonPrimary>
        </div>
      </div>
      <div className="mobile-tab">
        <ButtonWarning className="guide-btn" onClick={() => switchList('explore')}>
          {'> Explore <'}
        </ButtonWarning>
        <ButtonPrimary className="guide-btn" onClick={() => switchList('my')}>
          {'> View My <'}
        </ButtonPrimary>
      </div>
      <div className="center">
        {tab === 'my' ? (
          <>
            <div className="list-title">
              <SplitTextOpacity ref={titleRefMy}>My collection</SplitTextOpacity>
            </div>
            <div className="list-desc">
              <SplitTextOpacity ref={titleRefMy2}>EnchaNFT your own NFTs</SplitTextOpacity>
            </div>
            {myNFTDataStatus === 'loading' && (
              <div className="loading">
                <img src={LoadingIcon} alt="" />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="list-title">
              <SplitTextOpacity ref={titleRefExplore}>Choose and Create Synthetic NFTs</SplitTextOpacity>
            </div>
            {exploreNFTStatus === 'loading' && (
              <div className="loading">
                <img src={LoadingIcon} alt="" />
              </div>
            )}
          </>
        )}
        <div className="list">
          <NFTList data={nftList} />
        </div>
      </div>
      {!wallet.publicKey && (
        <div className="bottom">
          <RemindConnectWallet />
        </div>
      )}
    </HomeWrapper>
  )
}

export default Home

const HomeWrapper = styled.div`
  .loading {
    text-align: center;
    margin-top: 100px;
  }
  .mobile-tab {
    position: sticky;
    top: -12px;
    z-index: 1;
    display: flex;
    @media (min-width: ${MOBILE_BREAK_POINT}px) {
      display: none;
    }
  }
  .tab {
    width: 100%;
    height: 280px;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      display: none;
    }
    .guide-item {
      width: 50%;
      height: 100%;
      padding: 24px;
      border: 4px solid #222222;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &:first-child {
        border-right: none;
      }
      .guide-desc {
        font-size: 24px;
        line-height: 40px;
        text-transform: uppercase;
      }
      .guide-btn {
        width: 216px;
      }
    }
    .guide-explore {
      background-color: #fffbdb;
    }
    .guide-view-my {
      background-color: #e4ffdb;
    }
  }
  .center {
    margin-top: 36px;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      margin-top: 12px;
    }
    .list-title {
      font-size: 24px;
      color: #333333;
      text-align: center;
      margin: 0 auto;
      text-transform: uppercase;
      line-height: 40px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 16px;
      }
    }
    .list-desc {
      font-size: 12px;
      color: #333333;
      text-align: center;
      margin-top: 4px;
    }
    .list {
      margin-top: 24px;
    }
  }
`
