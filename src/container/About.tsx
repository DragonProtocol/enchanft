/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-23 10:28:16
 * @FilePath: \synft-app\src\container\AboutEnchaNFT.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../GlobalStyle'
import BannerImg from './images/banner.svg'
import CombineNftWithTokensImg from './images/combine_nft_with_tokens.svg'

function About() {
  const roadmap = [
    {
      title: 'v1',
      content: 'EnchaNFT Tools',
      status: true,
    },
    {
      title: 'v2',
      content: 'EnchaNFT Launchpad',
      status: false,
    },
    {
      title: 'v3',
      content: 'EnchaNFT Marketplace',
      status: false,
    },
    {
      title: 'v4',
      content: 'Lending (EnchaNFT can be liquidated liked Fungible token)',
      status: false,
    },
  ]
  return (
    <AboutWrapper>
      <div className="about-row banner">
        <img src={BannerImg} alt="" />
      </div>
      <div className="about-title">the pfp problem</div>
      <div className="about-row the-pfp-problem">
        <div className="the-pfp-problem-item">
          <span>📉</span>
          <span>Crashing floor price leads to vicious downtrend cycle</span>
        </div>
        <div className="the-pfp-problem-item">
          <span>😩</span>
          <span>Limited Token Utility & Staking using governance token as yield is difficult to attract user</span>
        </div>
      </div>
      <div className="about-title">enchanft solves this</div>
      <div className="about-row enchanft-solves-this">
        <img src={CombineNftWithTokensImg} alt="" />
      </div>

      <div className="about-row roadmap-enchanft-ecosystem">
        <div className="about-title">roadmap enchanft ecosystem</div>
        <Timeline position="alternate">
          {roadmap.map((item) => (
            <TimelineItem position="left">
              <TimelineOppositeContent color="text.secondary">
                <span className="roadmap-item-content">{item.content}</span>
                <span className="roadmap-item-status">{item.status && '✅'}</span>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  variant={item.status ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: '0%',
                    borderColor: '#222222',
                    backgroundColor: item.status ? '#222222' : '',
                  }}
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  flex: 0,
                }}
              >
                <span className="roadmap-item-title">{item.title}</span>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      <div className="about-title">why composable nfts?</div>
      <div className="about-row why-composable-nfts">
        <div className="why-composable-nfts-item">
          <div>NFT 1.0</div>
          <div>
            <li>Visual Representation</li>
            <li>Functionality</li>
          </div>
        </div>
        <div className="why-composable-nfts-item">
          <div>NFT 2.0</div>
          <div>
            <li>Objects on the Internet</li>
            <li>Programmable</li>
            <li>Interoperable</li>
          </div>
        </div>
      </div>
      <div className="about-title">remember defi lego?</div>
      <div className="about-row remember-defi-lego">Composability Unlocks Power</div>
      <div className="about-row lets-enchnft">
        <span className="text-icon">✉️</span>
        <div>
          <span className="text-icon">👉</span>
          <span>Let's EnchaNFT!</span>
          <span className="text-icon">👈</span>
        </div>
      </div>
      <div className="contact-us">
        <span>✉️</span>
        <span>contact</span>
        <span>us</span>
      </div>
    </AboutWrapper>
  )
}

export default About

const AboutWrapper = styled.div`
  .banner {
    img {
      width: 100%;
    }
  }
  .about-title {
    text-transform: uppercase;
    font-size: 24px;
    line-height: 40px;
    text-align: center;
    color: #3dd606;
    margin-top: 60px;
    margin-bottom: 24px;
  }
  .the-pfp-problem {
    display: flex;
    justify-content: space-between;
    gap: 80px;
    .the-pfp-problem-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 0px;
      gap: 12px;
      & > span:first-child {
        font-size: 40px;
        line-height: 40px;
      }
      & > span:last-child {
        font-size: 12px;
        line-height: 24px;
        color: #333333;
      }
    }
  }
  .enchanft-solves-this {
    img {
      width: 100%;
    }
  }
  .roadmap-enchanft-ecosystem {
    margin-top: 60px;
    background: #f8f8f8;
    padding: 40px 126px;
    .about-title {
      margin: 0;
    }
    .roadmap-item-title,
    .roadmap-item-content {
      font-size: 12px;
      color: #000000;
      ${FontFamilyCss}
    }
    .roadmap-item-title {
      text-transform: uppercase;
    }
    .roadmap-item-content {
    }
    .roadmap-item-status {
      font-size: 24px;
      line-height: 24px;
      margin-left: 10px;
    }
  }
  .why-composable-nfts {
    display: flex;
    .why-composable-nfts-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 16px 28px;
      gap: 24px;
      &:first-child {
        background: #f8f8f8;
      }
      &:last-child {
        background: #e4ffdb;
      }
      & > div {
        &:first-child {
          font-size: 18px;
          line-height: 40px;
          text-transform: uppercase;
        }
        li {
          font-size: 12px;
          line-height: 24px;
        }
      }
    }
  }
  .remember-defi-lego {
    text-align: center;
    font-size: 24px;
    line-height: 40px;

    text-align: center;
    text-transform: uppercase;
  }
  .lets-enchnft {
    background: #fffbdb;
    border: 4px solid #222222;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
    gap: 10px;
    padding: 15px 0 30px 0;
    ${CursorPointerUpCss}
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0px;
      gap: 24px;
      span {
        font-size: 18px;
        line-height: 40px;
      }
    }
    .text-icon {
      font-size: 40px;
      line-height: 40px;
    }
  }
  .contact-us {
    position: absolute;
    width: 100px;
    height: 100px;
    right: 20px;
    bottom: 50%;
    transform: translateY(50%);
    background: #fffbdb;
    border: 4px solid #222222;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    ${CursorPointerUpCss}
    span {
      font-size: 10px;
    }
    span:first-child {
      font-size: 40px;
    }
  }
`
