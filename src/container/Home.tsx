import { useConnection, useWallet } from '@solana/wallet-adapter-react'
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
import { getExploreData, selectExploreData } from '../features/explore/exploreSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

function Home() {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()

  // TODO: hard code
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
  const exploreNFTData = useAppSelector(selectExploreData)
  //------
  const nfts = useAppSelector(selectMyNFTs) // nfts count 可用于分页或作为显示
  const metadataArr = useAppSelector(selectMyNFTMetadataArr)
  const metadataStatus = useAppSelector(selectMyNFTMetadataStatus)

  useEffect(() => {
    if (!wallet.publicKey) return
    if (walletRef.current !== wallet.publicKey.toString()) {
      walletRef.current = wallet.publicKey.toString()
      dispatch(setWalletAddr(walletRef.current))
      const owner = wallet.publicKey
      // const owner = new PublicKey('AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK')
      dispatch(getMyNFTData({ connection, owner }))
      dispatch(getExploreData({ collectionID: 'Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb' }))
    }
  }, [wallet])

  useEffect(() => {
    if (nfts.length < 1) return
    if (metadataStatus === 'init') dispatch(getMyNFTMetadata({ connection, nfts }))
  }, [nfts, metadataStatus])

  console.log({ exploreNFTData })

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
            console.log(nfts[idx].address.toString())
            return <NFTShower key={jsonData.data.mint} mint={jsonData.data.mint} uri={jsonData.data.data.uri} />
          })}
        </>
      ) : (
        <div>
          <h1>Explore</h1>
          {exploreNFT.map((item) => (
            <div key={item.uri}>{item.uri}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
