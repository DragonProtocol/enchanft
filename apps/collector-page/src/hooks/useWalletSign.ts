import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import bs58 from 'bs58'
import { useNavigate } from 'react-router-dom'

import { selectAccount, setDefaultWallet, setPubkey } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { SIGN_MSG, TokenType } from '../utils/token'

export default function useWalletSign() {
  const windowObj: any = window
  const [phantomValid, setPhantomValid] = useState(false)
  const [metamaskValid, setMetamaskValid] = useState(false)

  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const getEthProvider = async () => {
    if (windowObj.ethereum) {
      const provider = new ethers.providers.Web3Provider(windowObj.ethereum)
      await provider.send('eth_requestAccounts', [])
      return provider
    } else {
      // TODO toast?
      alert('metamask required')
    }
  }
  const getSolanaProvider = async () => {
    if (windowObj.solana) {
      await windowObj.solana.connect() // opens wallet to connect to

      const provider = windowObj.solana
      if (provider.isPhantom) {
        return provider
      }
    } else {
      // TODO toast?
      alert('Phantom required')
    }
  }

  useEffect(() => {
    if (windowObj.solana && windowObj.solana.isPhantom) {
      setPhantomValid(true)
    }
    if (windowObj.ethereum) {
      setMetamaskValid(true)
    }
  }, [])

  useEffect(() => {
    if (account.defaultWallet === TokenType.Ethereum && phantomValid) {
      getEthProvider()
        .then((ethProvider) => {
          if (!ethProvider) return
          const signer = ethProvider.getSigner()
          return signer.getAddress()
        })
        .then((addr) => {
          if (!addr) return
          dispatch(setPubkey(addr))
        })
    }
    if (account.defaultWallet === TokenType.Solana && metamaskValid) {
      getSolanaProvider()
        .then((provider) => {
          if (!provider) return
          return provider.publicKey.toString()
        })
        .then((addr) => {
          if (!addr) return
          dispatch(setPubkey(addr))
        })
    }
  }, [account.defaultWallet, phantomValid, metamaskValid])

  const signMsgWithPhantom = async () => {
    const solanaProvider = await getSolanaProvider()
    if (!solanaProvider) return
    const pubkey = solanaProvider.publicKey
    const { signature: signatureBuf } = await solanaProvider.signMessage(Buffer.from(SIGN_MSG))
    const signature = bs58.encode(signatureBuf)
    return { walletType: TokenType.Solana, pubkey: pubkey.toString(), signature }
  }
  const signMsgWithMetamask = async () => {
    const ethProvider = await getEthProvider()
    if (!ethProvider) return
    const signer = ethProvider.getSigner()
    const walletAddr = await signer.getAddress()
    const signature = await signer.signMessage(SIGN_MSG)
    return { walletType: TokenType.Ethereum, pubkey: walletAddr, signature }
  }

  return {
    phantomValid,
    metamaskValid,
    signMsgWithPhantom,
    signMsgWithMetamask,
  }
}
