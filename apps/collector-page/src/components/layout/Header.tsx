/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:33:34
 * @Description: 站点头部
 */
import SolanaConnectWalletButton from 'components/business/connect/SolanaConnectWalletButton'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LogoImg from '../imgs/logo.svg'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navs = [
    {
      name: 'task dashboard',
      link: '/',
    },
    {
      name: 'calendar',
      link: '/calendar',
    },
    {
      name: 'profile',
      link: '/profile',
    },
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
  justify-content: space-around;
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
