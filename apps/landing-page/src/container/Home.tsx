import React, { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { useSynftContract } from '@enchanft/js-sdk-react'

import { useInView } from 'react-intersection-observer'
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
import SplitTextOpacity, { SplitTextOpacityFuns } from '../components/common/animate/SplitTextOpacity'
import LoadingIcon from '../components/imgs/Loading.gif'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { backToTop, getLayoutMainScrollBox } from '../utils/tools'
import RemindConnectWallet from '../components/RemindConnectWallet'


function Home() {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()
  const { synftContract } = useSynftContract()
  const [tab, setTab] = useState(localStorage.getItem('tab') || 'explore') // explore | my
  const titleRefExplore = useRef<SplitTextOpacityFuns>(null)
  const titleRefMy = useRef<SplitTextOpacityFuns>(null)
  const titleRefMy2 = useRef<SplitTextOpacityFuns>(null)
  const switchList = (name: string) => {
    if (name === tab) {
      // 在同一个tab上重复点击是强制执行一次标题动画
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
    dispatch(getMyNFTokens({ owner, connection, synftContract }))
  }, [wallet, connection, synftContract])

  useEffect(() => {
    // 滚动条滚动到顶部(为了移动端更友好些)
    backToTop()
  }, [tab])

  // 列表滚动加载
  const [showExploreData, setShowExploreData] = useState<NftDataItem[]>([])
  const exploreDataCache = useRef<{ initRequsetAfter: boolean; pageIndex: number; data: NftDataItem[] }>({
    initRequsetAfter: false,
    pageIndex: 0,
    data: [],
  })
  const [showExplorePageIndex, setShowExplorePageIndex] = useState(0)
  const { ref: nftListScrollRef, inView } = useInView({ root: getLayoutMainScrollBox(), threshold: 0 })
  // 监听列表数据的请求状态
  useEffect(() => {
    // 如果还没请求过数据, 并且有可用的数据
    if (exploreNFTStatus === 'init' && collections.length > 0) {
      // 发出初始化缓存请求：去请求第一页数据
      dispatch(getExploreDataWithCollectionId({ collectionId: collections[0], connection }))
    } else if (exploreNFTStatus === 'done') {
      // 刚结束了一次请求
      // 每次结束请求后，都设定当前显示的数据为上次一缓存的数据
      setShowExploreData(exploreDataCache.current.data)
      setShowExplorePageIndex(exploreDataCache.current.pageIndex)
      // 将刚请求的数据再次存储到缓存中
      exploreDataCache.current.data = exploreNFTData
      // 如果当前请求的结果是在所有初始化缓存请求发出之后返回的
      if (exploreDataCache.current.initRequsetAfter) {
        // 设置当前缓存数据对应的的页码
        exploreDataCache.current.pageIndex += 1
      } else {
        // 如果当前请求的结果是用来初始化缓存的
        // 如果还有下一页
        if (exploreDataCache.current.pageIndex < collections.length - 1) {
          // 再次发出初始化缓存请求：去请求第二页数据
          dispatch(
            getExploreDataWithCollectionId({ collectionId: collections[exploreDataCache.current.pageIndex + 1], connection }),
          )
        }
        // 同时设置说明下一次请求的结果是在所有初始话缓存请求发出之后
        exploreDataCache.current.initRequsetAfter = true
      }
    }
  }, [exploreNFTStatus, connection])

  // 监听视口位置阀值，滚动到指定位置显示下一页数据，请求下下页数据
  useEffect(() => {
    if (showExploreData.length === 0) return
    if (tab === 'explore' && showExplorePageIndex < exploreDataCache.current.pageIndex && inView) {
      // 如果还有下一页，通知去请求下下一页的内容
      if (exploreDataCache.current.pageIndex < collections.length - 1) {
        dispatch(getExploreDataWithCollectionId({ collectionId: collections[exploreDataCache.current.pageIndex + 1], connection }))
      } else {
        setShowExploreData(exploreDataCache.current.data)
        setShowExplorePageIndex(exploreDataCache.current.pageIndex)
      }
    }
  }, [inView, connection])
  const nftList: NftDataItem[] = tab === 'my' ? myNFTData : showExploreData
  let nftListLoading = false
  switch (tab) {
    case 'explore':
      nftListLoading = exploreNFTStatus === 'loading' || !exploreDataCache.current.initRequsetAfter
      break
    case 'my':
      nftListLoading = myNFTDataStatus === 'loading'
      break
    default:
      break
  }
  const nftListNotMore = showExplorePageIndex === collections.length - 1
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
          </>
        ) : (
          <div className="list-title">
            <SplitTextOpacity ref={titleRefExplore}>Choose and Create Synthetic NFTs</SplitTextOpacity>
          </div>
        )}
        <div className="list">
          <NFTList data={nftList} />
          <div ref={nftListScrollRef} />
          {nftListLoading && (
            <div className="loading">
              <img src={LoadingIcon} alt="" />
            </div>
          )}
          {nftListNotMore && <div className="not-more">no more ! ^_^</div>}
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
  .loading,
  .not-more {
    text-align: center;
    margin-top: 100px;
  }
  .mobile-tab {
    position: sticky;
    top: -12px;
    z-index: 1;
    display: flex;
    & > * {
      flex: 1;
    }
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
