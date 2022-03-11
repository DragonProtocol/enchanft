import React from 'react'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link, useNavigate } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import LogoImg from './imgs/logo.svg'
export default function Header() {
  const navigate = useNavigate()
  const { connection } = useConnection()
  const wallet = useWallet()
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    if (!wallet.publicKey) return
    ;(async (publicKey) => {
      const _balance = await connection.getBalance(publicKey)
      setBalance(_balance)
    })(wallet.publicKey)
  }, [wallet])

  return (
    <HeaderWrapper>
      {/* <Link style={{ display: 'block', margin: '1rem 0' }} to={`/`}>
        SYNFT
      </Link>
      <span>{balance}</span>
      <WalletMultiButton />
      <WalletDisconnectButton /> */}

      <div className="left">
        <img src={LogoImg} className="logo" onClick={()=>navigate('/')}></img>
      </div>
      <div className="right">
        <input type="text" className="search" />
        {/* TODO  这个链接钱包按钮提取为公共组件*/}
        <WalletMultiButton className="connect-wallet">{!wallet.publicKey && 'Connect Wallet'}</WalletMultiButton>
      </div>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    .logo {
      width: 128px;
      height: 32px;
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    .search {
      // 重置input默认样式 - start
      background: none;
      outline: none;
      border: 0px;
      // 重置input默认样式 - end

      width: 204px;
      height: 48px;
      background: #f8f8f8;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
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
      font-family: 'PressStart2P-Regular';
    }
  }
`
