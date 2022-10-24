/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:06:48
 * @Description: 站点头部
 */
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { isDesktop } from 'react-device-detect'
import LogoImg from '../imgs/logo.svg'
import useRoute from '../../hooks/useRoute'
import { navs } from '../../route/routes'
import { LoginButton, useWlUserReact, WlUserModalType } from '@ecnft/wl-user-react'
const Header: React.FC = () => {
  const { isLogin, dispatchModal } = useWlUserReact()
  const navigate = useNavigate()
  const { routeKey } = useRoute()

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
        {isDesktop && PcNav()}
        <ConnectBtnBox>
          {/* <ConnectBtn /> */}
          <LoginButton
            onClick={() => (isLogin ? navigate('/profile') : dispatchModal({ type: WlUserModalType.LOGIN }))}
          />
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
  box-shadow: ${(props) => (props.isActive ? 'inset 0 -4px #3DD606' : 'none')};
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
