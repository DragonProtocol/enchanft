import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useRef, useState } from 'react'

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
      const owner = wallet.publicKey
      // const owner = new PublicKey('AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK')
      dispatch(getMyNFTData({ connection, owner }))
    }
  }, [wallet, tab])

  useEffect(() => {
    if (nfts.length < 1) return
    if (metadataStatus === 'init') dispatch(getMyNFTMetadata({ connection, nfts }))
  }, [nfts, metadataStatus])

  return (
    <div className="">
      <button
        onClick={() => {
          localStorage.setItem('tab', 'explore')
          setTab('explore')
        }}
      >
        Explore
      </button>{' '}
      |{' '}
      <button
        onClick={() => {
          localStorage.setItem('tab', 'mynft')
          setTab('mynft')
        }}
      >
        View My NFT
      </button>
      {tab === 'mynft' ? (
        <>
          <h1>My Collection: {nfts.length}</h1>
          {metadataArr.map((item, idx) => {
            const jsonData = item.toJSON()
            return (
              <NFTShower
                addr={nfts[idx].address.toString()}
                key={jsonData.data.mint}
                mint={jsonData.data.mint}
                uri={jsonData.data.data.uri}
              />
            )
          })}
        </>
      ) : (
        <div>
          <h1>Explore</h1>
          {exploreNFT.map((item) => {
            return <div key={item.uri}>{item.uri}</div>
          })}
        </div>
      )}
    </div>
  )
}

export default Home
