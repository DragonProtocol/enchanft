/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 18:28:05
 * @Description: 站点头部
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  LoginButton,
  useWlUserReact,
  WlUserModalType,
} from '@ecnft/wl-user-react';
import LogoImg from '../imgs/logo.svg';

function Header() {
  const { isLogin, dispatchModal } = useWlUserReact();
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <HeaderLeft>
        <HeaderLogo src={LogoImg} alt="" onClick={() => navigate('/')} />
      </HeaderLeft>
      <HeaderRight>
        <ConnectBtnBox>
          <LoginButton
            onClick={() =>
              isLogin
                ? navigate('/profile')
                : dispatchModal({ type: WlUserModalType.LOGIN })
            }
          />
        </ConnectBtnBox>
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
  gap: 80px;
`;
const ConnectBtnBox = styled.div``;
