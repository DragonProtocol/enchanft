/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 11:49:18
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import Nav from './Nav';
import LogoSvg from '../imgs/logo.svg';
import LogoIconSvg from '../imgs/logo-icon.svg';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <MenuWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <Logo onlyIcon={!isOpen} onClick={() => navigate('/')} />
      <NavListBox>
        <Nav onlyIcon={!isOpen} />
      </NavListBox>
      <LoginButtonBox>
        <LoginButton onlyIcon={!isOpen} />
      </LoginButtonBox>
    </MenuWrapper>
  );
}
const MenuWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '200px' : '60px')};
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 20px 10px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 20;
  justify-content: space-between;
  align-items: center;
`;
const Logo = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  height: 36px;
  background-image: url(${({ onlyIcon }) =>
    onlyIcon ? LogoIconSvg : LogoSvg});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all 0.3s ease-out;
`;
const NavListBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
`;
const LoginButtonBox = styled.div`
  width: 100%;
  transition: all 0.3s ease-out;
`;
