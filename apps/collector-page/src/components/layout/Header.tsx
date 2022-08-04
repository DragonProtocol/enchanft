/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 14:53:48
 * @Description: 站点头部
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LogoImg from '../imgs/logo.svg'
import ConnectBtn from '../ConnectBtn'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
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
  const deactivateLinks = ['/profile', '/contributionranks', '/ref', '/creator']
  const [curNavLink, setCurNavLink] = useState('/')

  useEffect(() => {
    if (navs.findIndex((item) => item.link === location.pathname) !== -1) {
      setCurNavLink(location.pathname)
    } else if (deactivateLinks.includes(location.pathname)) {
      setCurNavLink('')
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
  height: 48px;
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
