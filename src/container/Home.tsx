import React, { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import log from 'loglevel'

import NFTList, { NftDataItem } from '../components/NFTList'
import {
  getMyNFTData,
  getMyNFTMetadata,
  selectMyNFTMetadataArr,
  selectMyNFTMetadataStatus,
  selectMyNFTs,
  setWalletAddr,
  clearMyNFT,
} from '../features/my/mySlice'
import { getExploreData, selectExploreData, selectExploreStatus } from '../features/explore/exploreSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

import { collections } from '../utils'
import { ButtonPrimary, ButtonWarning } from '../components/common/ButtonBase'
import ButtonConnectWallect from '../components/common/ButtonConnectWallet'
import SplitTextOpacity, { SplitTextOpacityFuns } from '../components/common/animate/SplitTextOpacity'

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

  const myNFTData = useAppSelector(selectMyNFTMetadataArr)
  const myNFTDataStatus = useAppSelector(selectMyNFTMetadataStatus)

  useEffect(() => {
    if (!wallet.publicKey) {
      walletRef.current = ''
      dispatch(clearMyNFT())
      return
    }
    if (walletRef.current === wallet.publicKey.toString()) return

    walletRef.current = wallet.publicKey.toString()
    const owner = wallet.publicKey
    // const owner = new PublicKey('AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK')
    dispatch(setWalletAddr(walletRef.current))
    dispatch(getMyNFTData({ connection, owner }))
  }, [wallet])

  useEffect(() => {
    dispatch(getExploreData({ collectionIds: collections, connection }))
  }, [])

  let nftList: NftDataItem[] = []
  if (tab === 'my') {
    nftList = myNFTData.map(({ metadata, hasInjected }) => {
      const jsonData = metadata.toJSON()
      return {
        hasInjected,
        mint: jsonData.data.mint,
        uri: jsonData.data.data.uri,
      }
    })
  } else {
    nftList = exploreNFTData
  }
  return (
    <HomeWrapper>
      <div className="top">
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
          <>
            <div className="list-title">
              <SplitTextOpacity ref={titleRefExplore}>Choose and Create Synthetic NFTs</SplitTextOpacity>
            </div>
            {exploreNFTStatus === 'loading' && <div className="loading">Loading...</div>}
          </>
        )}
        <div className="list">
          <NFTList data={nftList} />
        </div>
      </div>
      {!wallet.publicKey && (
        <div className="bottom">
          <span className="connect-desc">connect your NFT</span>
          <ButtonConnectWallect />
        </div>
      )}
    </HomeWrapper>
  )
}

export default Home

const HomeWrapper = styled.div`
  padding: 24px 0;
  .loading {
    text-align: center;
    margin-top: 100px;
  }
  .top {
    width: 100%;
    height: 280px;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
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

    .list-title {
      font-size: 24px;
      color: #333333;
      text-align: center;
      margin: 0 auto;
      text-transform: uppercase;
      line-height: 40px;
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
  .bottom {
    display: flex;
    background: #fffbdb;
    border: 4px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    padding: 26px 24px;
    margin: 35px 0;
    justify-content: space-between;
    align-items: center;
    .connect-desc {
      font-size: 18px;
      line-height: 40px;
      color: #222222;
      text-transform: uppercase;
    }
  }
`
