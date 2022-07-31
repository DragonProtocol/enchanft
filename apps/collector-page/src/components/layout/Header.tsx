/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 15:02:59
 * @Description: 站点头部
 */
import SolanaConnectWalletButton from 'components/business/connect/SolanaConnectWalletButton'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLocation, useNavigate } from 'react-router-dom'
import bs58 from 'bs58'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { setToken, selectAccount, userLogin, setPubkey, userGetProfile } from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import LogoImg from '../imgs/logo.svg'
import ConnectBtn from '../ConnectBtn'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { connected, signMessage, publicKey, disconnecting } = useWallet()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const prePublicKey = useRef<PublicKey | null>()
  const navs = [
    {
      name: 'events',
      link: '/',
    },
    {
      name: 'projects',
      link: '/projects',
    },
    // {
    //   name: 'calendar',
    //   link: '/calendar',
    // },
  ]
  const [curNavLink, setCurNavLink] = useState('/')

  useEffect(() => {
    if (navs.findIndex((item) => item.link === location.pathname) !== -1) {
      setCurNavLink(location.pathname)
    }
  }, [location])

  const PcNav = useCallback(
    () => (
      <PcNavList>
        {navs.map((item) => (
          <PcNavItem key={item.link} isActive={item.link === curNavLink} onClick={() => navigate(item.link)}>
            {item.name}
          </PcNavItem>
        ))}
      </PcNavList>
    ),
    [navs, curNavLink],
  )
  return (
    <HeaderWrapper>
      <HeaderLeft>
        <HeaderLogo src={LogoImg} alt="" onClick={() => navigate('/')} />
      </HeaderLeft>
      <HeaderRight>
        {PcNav()}
        <ConnectBtnBox>
          <ConnectBtn />
        </ConnectBtnBox>
      </HeaderRight>
    </HeaderWrapper>
  )
}
export default Header

// header style
const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const HeaderLeft = styled.div`
  display: flex;
`
const HeaderLogo = styled.img`
  width: 190px;
  height: 24px;
  cursor: pointer;
`
const HeaderRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 80px;
`
const ConnectBtnBox = styled.div``
// nav style
const PcNavList = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 80px;
`
const PcNavItem = styled.div<{ isActive: boolean }>`
  height: 100%;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  color: #333333;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: ${(props) => (props.isActive ? 'inset 0 -2px #000' : 'none')};
`
