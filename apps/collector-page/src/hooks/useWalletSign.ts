import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import bs58 from 'bs58'
import { useNavigate } from 'react-router-dom'

import { selectAccount, setDefaultWallet, setIsLogin, setPubkey, setWalletChecked } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { DEFAULT_WALLET, SIGN_MSG, TokenType } from '../utils/token'

export default function useWalletSign() {
  const windowObj: any = window
  windowObj.phantomValidChecked = false
  windowObj.metaMaskValidChecked = false

  const [phantomValid, setPhantomValid] = useState(false)
  const [metamaskValid, setMetamaskValid] = useState(false)
  const [martianValid, setMartianValid] = useState(false)

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
  async function getAptosProvider() {
    if (windowObj.martian) {
      await windowObj.martian.connect()
      const provider = windowObj.martian
      return provider
    } else {
      return null
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      let phantomValid = false
      let metamaskValid = false
      let martianValid = false
      if (windowObj.solana && windowObj.solana.isPhantom) {
        phantomValid = true
      }
      if (windowObj.ethereum) {
        metamaskValid = true
      }
      if (windowObj.martian) {
        martianValid = true
      }
      setPhantomValid(phantomValid)
      setMetamaskValid(metamaskValid)
      setMartianValid(martianValid)
      console.log({ phantomValid, metamaskValid })
      walletCheck(phantomValid, metamaskValid, martianValid).finally(() => {
        dispatch(setWalletChecked())
      })
    }, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const walletCheck = async (metamaskValid: boolean, phantomValid: boolean, martianValid: boolean) => {
    const defaultWallet = (localStorage.getItem(DEFAULT_WALLET) as TokenType) || ''
    if (defaultWallet === TokenType.Ethereum && metamaskValid) {
      if (windowObj.metaMaskValidChecked) return
      windowObj.metaMaskValidChecked = true
      const ethProvider = await getEthProvider()
      if (!ethProvider) {
        dispatch(setIsLogin(false))
        return
      }
      const signer = ethProvider.getSigner()
      const addr = await signer.getAddress()
      if (!addr) {
        dispatch(setIsLogin(false))
        return
      }
      dispatch(setPubkey(addr))
    }
    if (defaultWallet === TokenType.Solana && phantomValid) {
      if (windowObj.phantomValidChecked) return
      windowObj.phantomValidChecked = true
      console.log('getSolanaProvider' + Date.now())
      const provider = await getSolanaProvider()
      if (!provider) {
        dispatch(setIsLogin(false))
        return
      }
      const addr = provider.publicKey.toString()

      if (!addr) {
        dispatch(setIsLogin(false))
        return
      }
      dispatch(setPubkey(addr))
    }
    if (martianValid && defaultWallet === TokenType.Aptos) {
      if (windowObj.martianValidChecked) return
      windowObj.martianValidChecked = true
      console.log('getMartianProvider' + Date.now())
      const provider = await getAptosProvider()
      if (!provider) {
        return
      }
      const addr = await getMartianAddr()
      if (!addr) {
        dispatch(setIsLogin(false))
        return
      }
      dispatch(setPubkey(addr))
    }
  }

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
  const signMsgWithMartian = async () => {
    const provider = await getAptosProvider()
    if (!provider) return
    const walletAddr = await getMartianAddr()
    const resp = await provider.signMessage({
      message: SIGN_MSG,
    })
    console.log('signMsgWithMartian', resp)
    const { signature } = resp
    return {
      walletType: TokenType.Aptos,
      pubkey: walletAddr,
      signature: signature.slice(2),
      payloadMsg: resp.fullMessage,
    }
  }

  const getPhantomAddr = async () => {
    const solanaProvider = await getSolanaProvider()
    if (!solanaProvider) return
    const pubkey = solanaProvider.publicKey
    return pubkey.toString()
  }

  const getMetamaskAddr = async () => {
    const ethProvider = await getEthProvider()
    if (!ethProvider) return
    const signer = ethProvider.getSigner()
    const walletAddr = await signer.getAddress()
    return walletAddr
  }

  const getMartianAddr = async () => {
    const provider = await getAptosProvider()
    if (!provider) return
    const { publicKey } = await provider.account()
    return publicKey.slice(2)
  }
  return {
    phantomValid,
    metamaskValid,
    martianValid,
    signMsgWithPhantom,
    signMsgWithMetamask,
    signMsgWithMartian,
    getPhantomAddr,
    getMetamaskAddr,
    getMartianAddr,
  }
}
