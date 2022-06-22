/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-21 17:55:56
 * @FilePath: \synft-app\src\container\AboutEnchaNFT.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

function About() {
  return (
    <AboutWrapper>
      <div className="about-row banner">
        <img src="" alt="" />
      </div>
      <div className="about-row the-pfp-problem">
        <div className="about-title">the pfp problem</div>
      </div>
      <div className="about-row enchanft-solves-this">
        <div className="about-title">the pfp problem</div>
      </div>
      <div className="about-row roadmap-enchanft-ecosystem">
        <div className="about-title">roadmap enchanft ecosystem</div>
      </div>
      <div className="about-row why-composable-nfts">
        <div className="about-title">why composable nfts?</div>
      </div>
      <div className="about-row remember-defi-lego">
        <div className="about-title">remember defi lego?</div>
      </div>
      <div className="about-row lets-enchnft">aaa</div>
    </AboutWrapper>
  )
}

export default About

const AboutWrapper = styled.div`
  .about-row {
    margin-top: 60px;
    .about-title {
      text-transform: uppercase;
      font-size: 24px;
      line-height: 40px;
      text-align: center;
      color: #3dd606;
    }
  }
`
