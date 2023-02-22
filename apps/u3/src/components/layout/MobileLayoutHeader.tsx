/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-22 15:49:52
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoIconSvg } from '../imgs/logo-icon.svg';
import LogoutConfirmModal from './LogoutConfirmModal';
import useLogin from '../../hooks/useLogin';
import MobileLoginButton from './MobileLoginButton';

export default function MobileLayoutHeader() {
  const { logout } = useLogin();
  const navigate = useNavigate();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  return (
    <MobileLayoutHeaderWrapper>
      <LogoBox onClick={() => navigate('/')}>
        <LogoIconBox>
          <LogoIconSvg />
        </LogoIconBox>

        <LogoText>Alpha</LogoText>
      </LogoBox>
      <LoginButtonBox>
        <MobileLoginButton
          onLogout={() => {
            setOpenLogoutConfirm(true);
          }}
        />
      </LoginButtonBox>
      <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
      />
    </MobileLayoutHeaderWrapper>
  );
}
const MobileLayoutHeaderWrapper = styled.div`
  background: #1b1e23;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 20px 10px;
  border-bottom: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  gap: 20;
  justify-content: space-between;
  align-items: center;
`;
const LogoBox = styled.div`
  width: 142px;
  display: flex;
  gap: 10px;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div`
  width: 36px;
  height: 36px;
`;
const LogoText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
const LoginButtonBox = styled.div`
  transition: all 0.3s ease-out;
`;
