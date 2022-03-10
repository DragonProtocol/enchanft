import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import NFTList from '../components/NFTList'

import NFTShower from '../components/NFTShower'
import {
  getMyNFTData,
  getMyNFTMetadata,
  selectMyNFTMetadataArr,
  selectMyNFTMetadataStatus,
  selectMyNFTs,
  setWalletAddr,
} from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

function Home() {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()

  //- TODO: hard code
  const [tab, setTab] = useState(localStorage.getItem('tab') || 'explore') // explore | mynft
  const [exploreNFT] = useState([
    {
      uri: 'a',
    },
    {
      uri: 'b',
    },
  ])

  const dispatch = useAppDispatch()
  const nfts = useAppSelector(selectMyNFTs) // nfts count 可用于分页或作为显示
  const metadataArr = useAppSelector(selectMyNFTMetadataArr)
  const metadataStatus = useAppSelector(selectMyNFTMetadataStatus)

  useEffect(() => {
    if (tab !== 'mynft') return
    if (!wallet.publicKey) return
    if (walletRef.current !== wallet.publicKey.toString()) {
      walletRef.current = wallet.publicKey.toString()
      dispatch(setWalletAddr(walletRef.current))
      // const owner = wallet.publicKey
      const owner = new PublicKey('AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK')
      dispatch(getMyNFTData({ connection, owner }))
    }
  }, [wallet, tab])

  useEffect(() => {
    if (nfts.length < 1) return
    if (metadataStatus === 'init') dispatch(getMyNFTMetadata({ connection, nfts }))
  }, [nfts, metadataStatus])

  return (
    <HomeWrapper>
      <div className="top">
        <div className="guide-item guide-explore">
          <span className="guide-desc">🔥 View Popular NFTs and create synthetic NFTs</span>
          {/* <button className="guide-btn"></button> */}
          <Link className="guide-btn" to={`/`}>
            {'> Explore NFT <'}
          </Link>
        </div>
        <div className="guide-item guide-view-my">
          <span className="guide-desc">🔗 Connect your NFTs and Enchant it value</span>
          {/* <button className="guide-btn"> {'> View My NFT <'}</button> */}
          <Link className="guide-btn" to={`/nft-my`}>
            {'> View My NFT <'}
          </Link>
        </div>
      </div>
      <div className="center">
        <div className="list-tile">Popular NFTs</div>
        <NFTList></NFTList>
      </div>
      <div className="bottom">
        <span className="connect-desc">connect your NFT</span>
        {/* TODO  这个链接钱包按钮提取为公共组件*/}
        <WalletMultiButton className="connect-wallet">Connect Wallet</WalletMultiButton>
      </div>
    </HomeWrapper>
    // <div className="">
    //   <button
    //     onClick={() => {
    //       localStorage.setItem('tab', 'explore')
    //       setTab('explore')
    //     }}
    //   >
    //     Explore
    //   </button>{' '}
    //   |{' '}
    //   <button
    //     onClick={() => {
    //       localStorage.setItem('tab', 'mynft')
    //       setTab('mynft')
    //     }}
    //   >
    //     View My NFT
    //   </button>
    //   {tab === 'mynft' ? (
    //     <>
    //       <h1>My Collection: {nfts.length}</h1>
    //       {metadataArr.map((item, idx) => {
    //         const jsonData = item.toJSON()
    //         return (
    //           <NFTShower
    //             addr={nfts[idx].address.toString()}
    //             key={jsonData.data.mint}
    //             mint={jsonData.data.mint}
    //             uri={jsonData.data.data.uri}
    //           />
    //         )
    //       })}
    //     </>
    //   ) : (
    //     <div>
    //       <h1>Explore</h1>
    //       {exploreNFT.map((item) => {
    //         return <div key={item.uri}>{item.uri}</div>
    //       })}
    //     </div>
    //   )}
    // </div>
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
        font-family: 'Press Start 2P';
        font-size: 24px;
        line-height: 40px;
        /* or 167% */

        text-transform: uppercase;
      }
      .guide-btn {
        // 重置Link默认样式 - start
        text-decoration:none;
        // 重置Link默认样式 - end

        width: 216px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        background: #ebb700;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
        font-size: 12px;
        color: #ffffff;
        cursor: pointer;
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
    .list-tile {
      font-size: 24px;
      color: #333333;
      text-align: center;
      margin: 36px 0 24px;
      text-transform: uppercase;
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
      cursor: pointer;
      font-size: 12px;
      color: #ffffff;
      border-radius: 0px;
      justify-content: center;
    }
  }
`
