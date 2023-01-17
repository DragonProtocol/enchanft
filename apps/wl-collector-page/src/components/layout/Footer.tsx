/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-29 12:19:51
 * @Description: 站点头部
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  WL_APP_VERSION,
  WL_DISCORD_URL,
  WL_INFO_URL,
  WL_TWITTER_URL,
} from '../../constants';
import IconDiscordBlack from '../common/icons/IconDiscordBlack';
import IconTwitterBlack from '../common/icons/IconTwitterBlack';
import IconWebsite from '../common/icons/IconWebsite';

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterLeft>
        <ProjectLink
          href={WL_INFO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWebsite />
        </ProjectLink>
        <ProjectLink
          href={WL_TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconTwitterBlack />
        </ProjectLink>
        <ProjectLink
          href={WL_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconDiscordBlack />
        </ProjectLink>
      </FooterLeft>
      <FooterRight>
        <ReportBugs
          href={WL_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          report bugs
        </ReportBugs>
        |<Version>v{WL_APP_VERSION}</Version>
      </FooterRight>
    </FooterWrapper>
  );
};
export default Footer;

// footer style
const FooterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FooterLeft = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;
const ProjectLink = styled.a`
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const FooterRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
`;
const ReportBugs = styled.a`
  color: #3dd606;
`;
const Version = styled.span``;
