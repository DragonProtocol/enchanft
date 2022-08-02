/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-20 14:29:03
 * @FilePath: \synft-app\src\container\AboutEnchaNFT.tsx
 * @Description: about container
 */
import React from 'react';
import styled from 'styled-components';
import { ButtonPrimary, ButtonWarning } from '../components/common/ButtonBase';
import {
  APPLY_FORM_URL,
  CONTACT_US_EMAIL,
  EVENTS_URL,
  MOBILE_BREAK_POINT,
  TWITTER_URL,
} from '../utils/constants';
import BannerIconImg from './images/banner_icon.png';
import BannerImg from './images/banner.jpg';
import EnchanftWhitelist from './images/enchanft_whitelist.png';
import TasksAutomation from './images/tasks_automation.png';
import UnifyCommunity from './images/unify_community.png';
import WhyEnchanftCreator from './images/why_enchanft_creator.png';
import WhyEnchanftCollector from './images/why_enchanft_collector.png';
import NftPlusSolImg from './images/nft_plus_sol.png';
import TwitterIcon from './images/twitter.svg';
import WL_LOGO from './images/wl.svg';
import { CursorPointerUpCss } from '../GlobalStyle';

function About() {
  const whitelist = {
    icon: EnchanftWhitelist,
    title: 'EnchaNFT Whitelist',
    subTitle: 'whitelist management, no more manual wallet collection ',
    items: [
      'Save time for project team',
      'Identify the best members',
      'Fast organic growth of community',
    ],
  };
  const tasksAutomation = {
    icon: TasksAutomation,
    title: 'tasks automation',
    subTitle: 'automation of whitelist task verification, no more screenshots',
    items: [
      'Automatic collection of wallet addresses',
      'Automatic verification of user task completion',
    ],
  };
  const unifyCommunity = {
    icon: UnifyCommunity,
    title: 'Unify Your Community',
    subTitle: '',
    items: [
      'Tracking social engagement (RT, Like) as contribution point even when you are not running contests or giveaway',
      'Bring your community together with a unified contribution points sysyem',
      'Reward your best contributors everywhere',
    ],
  };

  const why_enchanft = [
    {
      icon: WhyEnchanftCreator,
      title: 'creator',
      items: [
        'Unbreakable launch floor price with SOL injects',
        'Create upward price momentum with rising floor',
        'Incentivise holding with real SOL staking return',
      ],
    },
    {
      icon: WhyEnchanftCollector,
      title: 'collector',
      items: [
        'Injected with SOL; so no “worthless” JPEG, but gold plated JPEG',
        'Part of royalty goes into NFT itself. So the floor is also rising',
        'Real staking return from staked SOL. So you are rewarded as a holder',
      ],
    },
  ];

  const problems = [
    {
      icon: '📉',
      text: 'Crashing floor price leads to vicious downtrend cycle',
    },
    {
      icon: '😩',
      text: 'Limited Token Utility & Staking using governance token as yield is difficult to attract user',
    },
  ];

  const problemSolves = [
    {
      apparentTitle: 'nft + sol',
      minorTitle: 'to fix floor price',
      nftPlusTokenImg: NftPlusSolImg,
    },
  ];

  const openTwitter = () => {
    window.open(TWITTER_URL, '__blank');
  };
  const openEvents = () => {
    window.open(EVENTS_URL, '__blank');
  };
  const openApplyForm = () => {
    window.open(APPLY_FORM_URL, '__blank');
  };

  return (
    <AboutWrapper>
      <BannerBox url={BannerImg}>
        <BannerIcon src={BannerIconImg} />
        <BannerText>
          Supercharged NFT allow lists
          <br />
          with EnchaNFT
        </BannerText>
        <BannerButtonBox>
          <BannerButtonStartCommunity onClick={openApplyForm}>
            Start your community
          </BannerButtonStartCommunity>
          <BannerButtonExplore onClick={openEvents}>
            Explore
          </BannerButtonExplore>
        </BannerButtonBox>
      </BannerBox>

      <TextAndImgBox>
        <TextBox>
          <WLLogoBox src={WL_LOGO}></WLLogoBox>
          <TextTitle>{whitelist.title}</TextTitle>
          <TextSubTitle>{whitelist.subTitle}</TextSubTitle>
          <TextContent>
            {whitelist.items.map((item, index) => (
              <TextContentItem key={index}>{item}</TextContentItem>
            ))}
          </TextContent>
        </TextBox>
        <ImgBox src={whitelist.icon}></ImgBox>
      </TextAndImgBox>

      <TextAndImgBox>
        <ImgBox src={tasksAutomation.icon}></ImgBox>
        <TextBox>
          <TextTitle>{tasksAutomation.title}</TextTitle>
          <TextSubTitle>{tasksAutomation.subTitle}</TextSubTitle>
          <TextContent>
            {tasksAutomation.items.map((item, index) => (
              <TextContentItem key={index}>{item}</TextContentItem>
            ))}
          </TextContent>
        </TextBox>
      </TextAndImgBox>

      <TextAndImgBox>
        <TextBox>
          <TextTitle>{unifyCommunity.title}</TextTitle>
          <TextSubTitle>{unifyCommunity.subTitle}</TextSubTitle>
          <TextContent>
            {unifyCommunity.items.map((item, index) => (
              <TextContentItem key={index}>{item}</TextContentItem>
            ))}
          </TextContent>
        </TextBox>
        <ImgBox src={unifyCommunity.icon}></ImgBox>
      </TextAndImgBox>

      <InfoBox>
        <InfoBoxItemInner>
          <InfoTitle>Why EnchaNFT Hardfloor NFT</InfoTitle>
          <InfoSubTitle uppercase={true}>
            (Asset-Backed NFT Launch)
          </InfoSubTitle>
          <WhyBox>
            {why_enchanft.map((item, index) => (
              <WhyRowBox key={index}>
                <WhyRowIcon src={item.icon} />
                <WhyRowRightBox>
                  <WhyRowTitle>{item.title}</WhyRowTitle>
                  <WhyRowContent>
                    {item.items.map((item, index) => (
                      <WhyRowContentItem key={index}>{item}</WhyRowContentItem>
                    ))}
                  </WhyRowContent>
                </WhyRowRightBox>
              </WhyRowBox>
            ))}
          </WhyBox>
        </InfoBoxItemInner>

        <InfoBoxHorizontalLine></InfoBoxHorizontalLine>

        <InfoBoxItemInner>
          <InfoTitle>The PFP Problem</InfoTitle>
          <ProblemBox>
            {problems.map((item, index) => (
              <ProblemItemBox key={index}>
                <ProblemItemIcon>{item.icon}</ProblemItemIcon>
                <ProblemItemText>{item.text}</ProblemItemText>
              </ProblemItemBox>
            ))}
          </ProblemBox>
          <ProblemSolvePointerIcon>👇</ProblemSolvePointerIcon>
          <InfoTitle>EnchaNFT solves this</InfoTitle>
          <InfoSubTitle>
            Combine NFT with other Tokens, Intrinsic value + Rarity value!
          </InfoSubTitle>
          <ProblemSolvesBox>
            {problemSolves.map((item, index) => (
              <ProblemSolveItem key={index}>
                <ProblemSolveItemTitle>
                  <ProblemSolveItemTitleApparentText>
                    {item.apparentTitle}
                  </ProblemSolveItemTitleApparentText>
                  <ProblemSolveItemTitleMinorText>
                    {item.minorTitle}
                  </ProblemSolveItemTitleMinorText>
                </ProblemSolveItemTitle>
                <ProblemSolveItemNftPlusTokenImg src={item.nftPlusTokenImg} />
              </ProblemSolveItem>
            ))}
          </ProblemSolvesBox>
        </InfoBoxItemInner>
      </InfoBox>
      <EmailUsBox>
        <div
          className="about-row lets-enchnft"
          aria-hidden
          onClick={openApplyForm}
        >
          <span className="text-icon">✉️</span>
          <div>
            <span className="text-icon">👉</span>
            <span>Start your community</span>
            <span className="text-icon">👈</span>
          </div>
        </div>
        <div className="contact-us" aria-hidden onClick={() => openTwitter()}>
          <img src={TwitterIcon} />
          <span>contact</span>
          <span>us</span>
        </div>
      </EmailUsBox>
    </AboutWrapper>
  );
}

export default About;

const AboutWrapper = styled.div``;

const BannerBox = styled.div<{ url: any }>`
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  background: linear-gradient(
      0deg,
      rgba(32, 72, 18, 0.2),
      rgba(32, 72, 18, 0.2)
    ),
    url(${(props) => props.url});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
`;
const BannerIcon = styled.img`
  width: 104px;
  height: 45.22px;
`;
const BannerText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
`;
const BannerButtonBox = styled.div`
  display: flex;
  gap: 24px;
`;
const BannerButtonStartCommunity = styled(ButtonPrimary)`
  padding: 18px;
`;
const BannerButtonExplore = styled(ButtonWarning)`
  padding: 18px;
`;

const TextAndImgBox = styled.div`
  display: flex;
  margin-top: 100px;
  gap: 40px;
`;
const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TextTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 40px;
  text-transform: uppercase;
  color: #333333;
`;
const TextSubTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 36px;
  color: #333333;
  margin-top: 12px;
`;
const TextContent = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const TextContentItem = styled.div`
  max-width: 472px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #333333;
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00b300;
    margin-right: 14px;
    line-height: 20px;
    vertical-align: middle;
  }
`;

const ImgBox = styled.img`
  width: 474px;
  height: 350px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100px;
    height: 100px;
  }
`;
const WLLogoBox = styled.img`
  width: 100px;
  margin-bottom: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100px;
    height: 100px;
  }
`;
const InfoBox = styled.div`
  width: 100%;
  background: #f8f8f8;
  margin-top: 100px;
`;
const InfoBoxItemInner = styled.div`
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const InfoTitle = styled.div`
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
  color: #333333;
  text-align: center;
`;
const InfoSubTitle = styled.div<{ uppercase?: Boolean }>`
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: #333333;
  margin-top: 20px;
  text-align: center;
  ${(props) => props.uppercase && 'text-transform: uppercase;'}
`;
const InfoBoxHorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
`;

const WhyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 20px;
`;
const WhyRowBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const WhyRowIcon = styled.img`
  width: 138px;
  height: 90px;
`;
const WhyRowRightBox = styled.div`
  flex: 1;
`;
const WhyRowTitle = styled.div`
  font-size: 14px;
  line-height: 14px;
  text-transform: uppercase;
  color: #3dd606;
`;
const WhyRowContent = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const WhyRowContentItem = styled.li`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`;

const ProblemBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const ProblemItemBox = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;
const ProblemItemIcon = styled.div`
  width: 40px;
  height: 40px;
  font-weight: 400;
  font-size: 40px;
  line-height: 40px;
`;
const ProblemItemText = styled.div`
  flex: 1;
  font-size: 12px;
  line-height: 24px;
  color: #333333;
`;

const ProblemSolvePointerIcon = styled.div`
  width: 100%;
  font-size: 40px;
  text-align: center;
  margin-bottom: 20px;
`;
const ProblemSolvesBox = styled.div`
  margin-top: 20px;
  padding: 0 70px;
  box-sizing: border-box;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    margin-top: 12px;
    padding: 0;
  }
`;
const ProblemSolveItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 12px;
  }
`;
const ProblemSolveItemTitle = styled.div`
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
  }
`;
const ProblemSolveItemTitleIcon = styled.span`
  font-size: 40px;
  line-height: 40px;
  color: #000000;
  margin-right: 24px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
  }
`;
const ProblemSolveItemTitleApparentText = styled.span`
  color: #3dd606;
  margin-right: 24px;
`;
const ProblemSolveItemTitleMinorText = styled.span`
  color: #333333;
`;
const ProblemSolveItemNftPlusTokenImg = styled.img`
  width: 100%;
`;
const EmailUsBox = styled.div`
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
        @media (max-width: ${MOBILE_BREAK_POINT}px) {
          font-size: 14px;
        }
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
    bottom: 20px;
    background: #fffbdb;
    border: 4px solid #222222;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    ${CursorPointerUpCss}
    span {
      font-size: 10px;
    }
    span:first-child {
      font-size: 40px;
    }
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      right: 0;
      bottom: 0;
      transform: scale(0.6) translateX(20%);
    }
  }
`;
