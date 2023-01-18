/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 15:54:05
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWlUserReact } from '@ecnft/wl-user-react';
import LoginButton from './LoginButton';
import Nav from './Nav';
import { ReactComponent as LogoIconSvg } from '../imgs/logo-icon.svg';
import LogoutConfirmModal from './LogoutConfirmModal';
import useLogin from '../../hooks/useLogin';
import { useAppSelector } from '../../store/hooks';
import {
  checkIn,
  incScore,
  selectKarmaState,
} from '../../features/profile/karma';
import { Atom02 } from '../icons/atom';
import { store } from '../../store/store';

export default function Menu() {
  const { logout } = useLogin();
  const { user } = useWlUserReact();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const { totalScore, checked } = useAppSelector(selectKarmaState);

  return (
    <>
      <MenuWrapper
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <LogoBox onlyIcon={!isOpen} onClick={() => navigate('/')}>
          <LogoIconBox onlyIcon={!isOpen}>
            <LogoIconSvg />
          </LogoIconBox>

          <LogoText>Alpha</LogoText>
        </LogoBox>
        <NavListBox>
          <Nav onlyIcon={!isOpen} />
        </NavListBox>
        <LoginButtonBox>
          <LoginButton
            onlyIcon={!isOpen}
            onLogout={() => {
              setOpenLogoutConfirm(true);
            }}
            karmaScore={totalScore}
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
          onAfterOpen={() => {
            setIsOpen(false);
          }}
        />
      </MenuWrapper>
      {!checked && (
        <KarmaGM
          isOpen={isOpen}
          onClick={() => {
            if (!user.token) return;
            store.dispatch(checkIn({ token: user.token }));
          }}
        >
          GM
          <Atom02 />
        </KarmaGM>
      )}
    </>
  );
}
const MenuWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '160px' : '60px')};
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
  align-items: flex-start;
`;
const LogoBox = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  display: flex;
  gap: 10px;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div<{ onlyIcon?: boolean }>`
  width: 36px;
  height: 36px;
  path {
    transition: all 0.3s ease-out;
  }
  ${({ onlyIcon }) =>
    onlyIcon &&
    `path {
      fill: #fff;
    }
  `};
`;
const LogoText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
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

const KarmaGM = styled.div<{ isOpen: boolean }>`
  position: fixed;
  transition: all 0.3s ease-out;
  left: ${({ isOpen }) => (isOpen ? '160px' : '60px')};
  bottom: 100px;
  color: #fff;
  padding: 4px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 82px;
  height: 36px;
  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  border-radius: 0px 22px 22px 0px;

  font-size: 24px;
  line-height: 28px;

  cursor: pointer;
`;
