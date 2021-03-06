/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 10:30:53
 * @Description: 站点头部
 */
import SolanaConnectWalletButton from 'components/business/connect/SolanaConnectWalletButton'
import React, { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLocation, useNavigate } from 'react-router-dom'
import bs58 from 'bs58'
import styled from 'styled-components'
import { setToken, selectAccount, userLogin } from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SIGN_MSG } from 'constants/solana'
import LogoImg from '../imgs/logo.svg'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { connected, signMessage, publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const navs = [
    {
      name: 'launchpad',
      link: '/',
    },
    // {
    //   name: 'calendar',
    //   link: '/calendar',
    // },
    {
      name: 'profile',
      link: '/profile',
    },
  ]
  const [curNavLink, setCurNavLink] = useState('/')

  const authenticate = useCallback(async () => {
    if (!signMessage || !publicKey) return
    if (account.token) return
    try {
      const msg = SIGN_MSG
      const data = await signMessage(Buffer.from(msg))
      const signature = bs58.encode(data)
      dispatch(
        userLogin({
          signature,
          payload: msg,
          pubkey: publicKey.toString(),
        }),
      )
    } catch (error) {
      if (error.message === 'User rejected the request.') {
        // TODO ui
        alert('sign in first')
      }
    }
  }, [account, signMessage, publicKey])

  useEffect(() => {
    if (navs.findIndex((item) => item.link === location.pathname) !== -1) {
      setCurNavLink(location.pathname)
    }
  }, [location])

  useEffect(() => {
    if (!connected) return
    authenticate()
  }, [connected])

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
        <HeaderLogoBox>
          <img src={LogoImg} alt="" />
        </HeaderLogoBox>
      </HeaderLeft>
      <HeaderCenter>{PcNav()}</HeaderCenter>
      <HeaderRight>
        <SolanaConnectWalletButtonBox>
          <SolanaConnectWalletButton />
        </SolanaConnectWalletButtonBox>
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
const HeaderLogoBox = styled.div``
const HeaderCenter = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
`
const HeaderRight = styled.div`
  display: flex;
  justify-content: end;
`
const SolanaConnectWalletButtonBox = styled.div`
  width: auto;
`

// nav style
const PcNavList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 40px;
`
const PcNavItem = styled.div<{ isActive: boolean }>`
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: ${(props) => (props.isActive ? 'inset 0 -2px #000' : 'none')};
`
