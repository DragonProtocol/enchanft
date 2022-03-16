import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import LogoImg from './imgs/logo.svg'
import ButtonConnectWallect from './common/ButtonConnectWallet'
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
        {/* <input type="text" className="search" /> */}
        <ButtonConnectWallect />
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
      width: 274px;
      height: 36px;
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
  }
`
