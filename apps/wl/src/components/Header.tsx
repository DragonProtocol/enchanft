/*
 * @Author: your name
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-06-28 14:10:13
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: header component
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MOBILE_BREAK_POINT } from '../utils/constants';
import { CursorPointerUpCss } from '../GlobalStyle';

export default function Header() {
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}></div>
      </div>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    .logo {
      width: 100px;
      height: 40px;
      background-image: url('/logo.svg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-image: url('/logo192.png');
      }
    }
  }
`;
