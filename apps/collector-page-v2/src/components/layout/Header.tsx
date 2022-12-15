/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 14:57:31
 * @Description: 站点头部
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { usePermissions, useWlUserReact } from '@ecnft/wl-user-react';
import LogoImg from '../imgs/logo.svg';
import SubmitNav from './SubmitNav';
import LoginButton from './LoginButton';

function Header() {
  const { isLogin } = useWlUserReact();
  const { isAdmin } = usePermissions();
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <HeaderLeft>
        <HeaderLogo src={LogoImg} alt="" onClick={() => navigate('/')} />
      </HeaderLeft>
      <HeaderRight>
        {isLogin && isAdmin && <SubmitNav />}
        <LoginButton />
      </HeaderRight>
    </HeaderWrapper>
  );
}
export default Header;

// header style
const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const HeaderLeft = styled.div`
  display: flex;
`;
const HeaderLogo = styled.img`
  height: 48px;
  cursor: pointer;
`;
const HeaderRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 16px;
`;
