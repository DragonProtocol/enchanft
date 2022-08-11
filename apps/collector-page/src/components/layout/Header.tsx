/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-11 11:13:35
 * @Description: 站点头部
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { matchPath, matchRoutes, useLocation, useMatch, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LogoImg from '../imgs/logo.svg'
import ConnectBtn from '../ConnectBtn'
import { CutomRouteObject, permissionRoutes, RouteKeys, routes } from './Main'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [routeKey, setRouteKey] = useState<RouteKeys>(RouteKeys.noMatch)
  useEffect(() => {
    const match = matchRoutes([...permissionRoutes, ...routes], location)
    if (!match) {
      setRouteKey(RouteKeys.noMatch)
    } else {
      const { key } = match[0].route as CutomRouteObject
      setRouteKey(key || RouteKeys.noMatch)
    }
  }, [location])

  const navs = [
    {
      name: 'events',
      link: '/',
      activeRouteKeys: [RouteKeys.events, RouteKeys.todoTask, RouteKeys.task],
    },
    {
      name: 'projects',
      link: '/projects',
      activeRouteKeys: [RouteKeys.projects, RouteKeys.project, RouteKeys.contributionranks],
    },
    // {
    //   name: 'calendar',
    //   link: '/calendar',
    // },
  ]

  const PcNav = useCallback(
    () => (
      <PcNavList>
        {navs.map((item) => (
          <PcNavItemBox
            key={item.link}
            isActive={item.activeRouteKeys.includes(routeKey)}
            onClick={() => navigate(item.link)}
          >
            <PcNavItemText>{item.name}</PcNavItemText>
          </PcNavItemBox>
        ))}
      </PcNavList>
    ),
    [navs, routeKey],
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
const PcNavItemBox = styled.div<{ isActive: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: ${(props) => (props.isActive ? 'inset 0 -2px #000' : 'none')};
  transition: all 1s ease-out;
`
const PcNavItemText = styled.span`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  color: #333333;
  /* 鼠标移入整体上移2px */
  &:hover {
    transform: translateY(-4px);
  }
  /* 鼠标点击整体缩小2% */
  &:active {
    transform: scale(0.98);
  }
  transition: all 0.5s ease-out;
`
