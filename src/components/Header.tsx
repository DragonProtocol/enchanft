/*
 * @Author: your name
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-06-21 17:41:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \synft-app\src\components\Header.tsx
 */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import ButtonConnectWallect from './common/ButtonConnectWallet'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { ButtonPrimary } from './common/ButtonBase'
import { CursorPointerUpCss } from '../GlobalStyle'
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

  const navs = [
    {
      name: 'ABOUT EHCHANFT',
      link: '/',
    },
    {
      name: 'LAUNCHPAD',
      link: '/launchpad',
    },
    {
      name: 'MY ENCHANFTED',
      link: '/myenchanft',
    },
  ]
  return (
    <HeaderWrapper>
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}></div>
      </div>
      <div className="center">
        {navs.map((item) => (
          <div className="nav" onClick={() => navigate(item.link)}>
            {item.name}
          </div>
        ))}
      </div>
      <div className="right">
        {/* <input type="text" className="search" /> */}
        <ButtonPrimary onClick={() => window.open('https://solfaucet.com/')}>{'Get SOL'}</ButtonPrimary>
        <ButtonConnectWallect className="btn-connect-wallect" />
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
      width: 190px;
      height: 24px;
      background-image: url('/logo.svg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-image: url('/logo192.png');
      }
    }
  }
  .center {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: space-around;
    .nav {
      height: 100%;
      font-size: 12px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      ${CursorPointerUpCss}
    }
  }
  .right {
    margin-left: 16px;
    display: flex;
    gap: 16px;
    .btn-connect-wallect {
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        width: 100px;
        overflow: hidden;
      }
    }
    /* .search {
      // 重置input默认样式 - start
      background: none;
      outline: none;
      border: 0px;
      // 重置input默认样式 - end

      width: 204px;
      height: 48px;
      background: #f8f8f8;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    } */
  }
`
