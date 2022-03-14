import React, { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
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
import { CursorPointerUpCss, FontFamilyCss } from '../GlobalStyle'

function Home() {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()
  const [tab, setTab] = useState(localStorage.getItem('tab') || 'explore') // explore | my
  const switchList = (name: string) => {
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
          <span className="guide-desc">🔥 View Popular NFTs and create synthetic NFTs</span>
          <button className="guide-btn" onClick={() => switchList('explore')}>
            {'> Explore NFT <'}
          </button>
        </div>
        <div className="guide-item guide-view-my">
          <span className="guide-desc">🔗 Connect your NFTs and Enchant it value</span>
          <button className="guide-btn" onClick={() => switchList('my')}>
            {'> View My NFT <'}
          </button>
        </div>
      </div>
      <div className="center">
        {tab === 'my' ? (
          <>
            <div className="list-title">My collection</div>
            <div className="list-desc">What does this tell the user to do</div>
          </>
        ) : (
          <div className="list-title">Popular NFTs</div>
        )}
        <div className="list">
          <NFTList data={nftList} />
        </div>
      </div>
      {!wallet.publicKey && (
        <div className="bottom">
          <span className="connect-desc">connect your NFT</span>
          {/* TODO  这个链接钱包按钮提取为公共组件 */}
          <WalletMultiButton className="connect-wallet">Connect Wallet</WalletMultiButton>
        </div>
      )}
    </HomeWrapper>
  )
}

export default Home

const HomeWrapper = styled.div`
  padding: 24px 0;
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
        // 重置Link默认样式 - start
        text-decoration: none;
        // 重置Link默认样式 - end

        width: 216px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        background: #ebb700;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
        font-size: 12px;
        color: #ffffff;
        ${FontFamilyCss}
        ${CursorPointerUpCss}
      }
    }
    .guide-explore {
      background-color: #fffbdb;
    }
    .guide-view-my {
      background-color: #e4ffdb;
      .guide-btn {
        background: #3dd606;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }
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
    .connect-wallet {
      // 重置按钮默认样式 - start
      margin: 0;
      padding: 0;
      border: none;
      outline: none;
      // 重置按钮默认样式 - end

      width: 204px;
      height: 48px;
      background: #3dd606;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      margin-left: 20px;
      font-size: 12px;
      color: #ffffff;
      border-radius: 0px;
      justify-content: center;
      ${FontFamilyCss}
      ${CursorPointerUpCss}
    }
  }
`
