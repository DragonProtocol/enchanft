/*
 * @Author: your name
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-09-01 10:54:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: header component
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MOBILE_BREAK_POINT,
  TWITTER_URL,
  WL_DISCORD_URL,
} from '../utils/constants';
import IconDiscordBlack from '../components/common/icons/IconDiscordBlack';
import IconTwitterBlack from '../components/common/icons/IconTwitterBlack';
export default function Header() {
  const navigate = useNavigate();
  return (
    <HeaderWrapper>
      <div className="left">
        <div className="logo" onClick={() => navigate('/')}></div>
      </div>
      <div className="right">
        <IconLink href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
          <IconTwitterBlack />
        </IconLink>
        <IconLink
          href={WL_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconDiscordBlack />
        </IconLink>
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
  .right {
    display: flex;
    gap: 48px;
    align-items: center;
  }
`;
const IconLink = styled.a`
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
