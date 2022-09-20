import { useState } from 'react';

import Image from 'next/image';
import styled from 'styled-components';

import Header from '../components/header';

export function Index() {
  const [isMute, setIsMute] = useState(true);

  const renderProfile = (
    imgPath: string,
    name: string,
    position: string,
    className?: string
  ) => (
    <div className={`profile-item ${className}`}>
      <div className="profile">
        <Image
          src={imgPath}
          layout="fill"
          // objectFit='cover'
          alt={'basic'}
        />
      </div>
      <div className="name">{name}</div>
      <div className="position">{position}</div>
    </div>
  );

  return (
    <Wrapper>
      <div className="logo">
        <Image
          src={'/static/images/logo.png'}
          width={92}
          height={52}
          layout="fixed"
          // objectFit='cover'
          alt={'basic'}
        />
      </div>

      <div className="nav-box">
        <span className="twitter nav-item">
          <Image
            src={'/static/images/twitter.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </span>
        <div className="nav-item">
          <Image
            src={'/static/images/discord.png'}
            layout="fill"
            objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>
        <div className="nav-item">
          <Image
            src={'/static/images/instagram.png'}
            layout="fill"
            objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>

        <div className="nav-item">
          <Image
            src={'/static/images/OpenSea.png'}
            layout="fill"
            objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>

        <div className="nav-item wl-xyz">
          <Image
            src={'/static/images/wl_xyz.png'}
            layout="fill"
            // objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>

        <div className="nav-item">
          <Image
            src={'/static/images/more.png'}
            layout="fill"
            objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>
      </div>

      <div className="cloud">
        <Image
          src={'/static/images/cloud.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="flag">
        <Image
          src={'/static/images/CASKBAATAR.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="home title-img">
        <Image
          src={'/static/images/home.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="title text">
        CaskBaatar is a perfect combination of whisky investment and art
        collection.
      </div>
      <br />
      <div className="text">
        Each of the CaskBaatar’s NFT collections is bound to a single whisky
        cask. Among them, the artworks are designed by the famous Mongolian
        artist Yideer, and the single whisky cask are selected by professional
        cask selectors. Each CaskBaatar NFT contains an NFT picture and at least
        a bottle of whisky.
        <br />
        <br />
        CaskBaatar NFT is created based on the image of a Mongolian man, and
        matches the costumes of different periods from the 13th century to the
        present.As a Mongolian in the 21st century, the artist Yieder, while
        recalling the ancient history and culture, mostly conveys the concept of
        "Mongolian in the 21st century", and shows the state of contemporary
        Mongolian people from his perspective. Give the character visual
        representation of tradition and future.
      </div>

      <div className="avatar-loop-box">
        <div className='avatar-loop'>
        <Image
          src={'/static/images/avatar_loop.png'}
          layout="fill"
          objectFit="contain"
          // objectPosition={'-110px 35vw'}
          // objectPosition={'-110px 95px'}
          alt={'basic'}
        />
        </div>
        <div className='avatar-loop-front'>
        <Image
          src={'/static/images/avatar_loop_front.png'}
          layout="fill"
          objectFit="contain"
          // objectPosition={"130px 0px"}

          alt={'basic'}
        />
        </div>
      </div>

      <div className="contract title-img">
        <Image
          src={'/static/images/caskbaatar-02.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="contract-wrapper">
        <div className="contract-row row">
          <div className="contract-box">
            Our technical team comes from EnchaNFT Company in Singapore, and we
            use the ERC721 smart contract.
            <br />
            <br />
            After your mint on our official website, 70% of the amount will be
            stored in the contract, and the remaining 30% will be transferred to
            the managing team for the operation of the project.
            <div className="dot-box">
              <i className="dot" />
            </div>
          </div>
          <div className="contract-box">
            At the same time, the estimated bottling time and conversion time of
            the whisky will also be announced.  Our technical team comes from
            EnchaNFT Company in Singapore, and we use the ERC721 smart contract.
            <br />
            <br />
            NFT holders will visit the official website for conversion within
            the agreed time. After that, 70% of the crypto in the NFT will be
            transferred to the managing team. You can also destroy the NFT
            before the end of conversion time and get back the 70% amount
            without the whisky.
            <div className="dot-box">
              <i className="dot" />
              <i className="dot" />
            </div>
          </div>
        </div>
        <div className="contract-row row">
          <div className="contract-box">
            Generally, the conversion time of whisky will last one year. If you
            neither destroy nor convert the NFT during that, you will lose your
            right to convert. At the same time, the managing team will gain the
            70% amount in the NFT.
            <br />
            <br />
            Since the whisky bound to CaskBaatar NFT has very good aging
            potential, we usually bottle them within three to five years after
            the release of NFT. 
            <div className="dot-box">
              <i className="dot" />
              <div className="dot-row row">
                <i className="dot" />
                <i className="dot" />
              </div>
            </div>
          </div>
          <div className="contract-box">
            During this period, the holders can trade the NFT, when the crypto
            in it at the time of minting would be transferred to the buyer. 
            <br />
            <br />
            After bottling, we will deliver the whisky to you according to the
            address you provided. After conversion, you still own all other
            rights in the NFT artwork.
            <div className="dot-box">
              <div className="dot-row row">
                <i className="dot" />
                <i className="dot" />
              </div>
              <div className="dot-row row">
                <i className="dot" />
                <i className="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-box">
        <div className="left-box">
          <div className="about title-img">
            <Image
              src={'/static/images/about.png'}
              layout="fill"
              objectFit="contain"
              alt={'basic'}
            />
          </div>
          <div className="about-text">
            The vision of CaskBaatar is to combine the art collection and the
            investment in whisky through web3.
            <br />
            <br />
            Only by integrating NFT with the real things can we create a
            sustainable and stable NFT ecosystem, which is the most significant
            value of this project.
            <br />
            <br />
            The owners of CaskBaatar NFT also become contributors and investors
            to our mission.
          </div>
        </div>
        <div className="about-avatar-box">
          <div className="about-avatar">
            <Image
              src={'/static/images/about-avatar.png'}
              layout="fill"
              objectFit="contain"
              alt={'basic'}
            />
          </div>
        </div>
      </div>

      <div className="about-box">
        <div className="left-box">
          <div className="about title-img">
            <Image
              src={'/static/images/story.png'}
              layout="fill"
              objectFit="contain"
              alt={'basic'}
            />
          </div>
          <div className="about-text">
            The vision of CaskBaatar is to combine the art collection and the
            investment in whisky through web3.
            <br />
            <br />
            Only by integrating NFT with the real things can we create a
            sustainable and stable NFT ecosystem, which is the most significant
            value of this project.
            <br />
            <br />
            The owners of CaskBaatar NFT also become contributors and investors
            to our mission.
          </div>
        </div>
      </div>

      <div className="roadmap title-img">
        <Image
          src={'/static/images/roadmap.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>
      <div className="map">
        <Image
          src={'/static/images/map.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="team title-img">
        <Image
          src={'/static/images/team.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="profile-wrapper">
        <div className="profile-inner">
          <div className="row">
            {renderProfile(
              '/static/images/Oddie.png',
              'Oddie',
              'CEO，Founder. Whisky  collectors, investors.'
            )}
            {renderProfile(
              '/static/images/Yideer.png',
              'Yideer',
              'Chief Artist，Mongolian painter / tattoo artist / trend designer'
            )}
            {renderProfile(
              '/static/images/Tony.png',
              'Tony',
              'Project Advisor Early investors in Bitcoin, interested in blockchain and NFT development'
            )}
          </div>
          <div className="row">
            {renderProfile(
              '/static/images/Katie.png',
              'Katie',
              'Marketing Manager'
            )}
            {renderProfile(
              '/static/images/Oddie.png',
              'Oddie',
              'CEO，Founder. Whisky  collectors, investors.'
            )}
          </div>
          <div className="row">
            {renderProfile(
              '/static/images/Ken.png',
              'Mr.Ken',
              'Professional Cask Selector'
            )}
          </div>
          <div className="row">
            {renderProfile(
              '/static/images/Wl.png',
              'EnchaNFT (wl.xyz)',
              'A group of experienced web3 veterans, building tools and infrastructure for the NFT ecosystem. Our members are from Tsinghua, the National University of Singapore, UPenn, INSEAD, Bitmain, and Binance.',
              'wl'
            )}
          </div>
        </div>
      </div>

      <div className="bg-bottom">
        <Image
          src={'/static/images/bg-bottom.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="faq title-img">
        <Image
          src={'/static/images/faq.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="faq-box">
        <div className="faq-item">
          <div className="ques">Sounds awesome - How do I get involved?</div>A
          great place to start is our Discord, home to a very large and very
          active community of CaskBaatar enthusiasts. You don't need to be a
          CaskBaatar holder to join us there! All are welcome to jump into the
          conversation, let us know your ideas, and hang out with many others
          who like the CaskBaatars.
        </div>
        <div className="faq-item">
          <div className="ques">Is CaskBaatar a good investment?</div>
          The success of the project depends on many factors. We do not have the
          magic to predict, so it is impossible to know how it will go, but we
          strongly believe in our project and think it has a bright future
          ahead, but ultimately you will have to decide for yourself.
        </div>
        <div className="faq-item">
          <div className="ques">
            If I also like NFT and am a single cask whisky collector, can I
            contact you?
          </div>
          Of course. Provide your relevant information, make an invoice in the
          community and contact us, and we will explore interesting things
          together.
        </div>
        <div className="faq-item">
          <div className="ques">
            Can I use the picture commercially after purchasing it?
          </div>
          Yes, you can use the image of CaskBaatar owned by you for commercial
          purpose. However, you are not allowed to modify the image.
        </div>
      </div>

      {/* <div className="roadmap title-img">
        <Image
          src={'/static/images/roadmap.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
        <Image
          src={'/static/images/map.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="team title-img">
        <Image
          src={'/static/images/team.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>

      <div className="faq title-img">
        <Image
          src={'/static/images/faq.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        /> */}
      {/* </div> */}
    </Wrapper>
  );
}

export default Index;

const Wrapper = styled.div`
  width: 100vw;
  min-height: 1800px;
  /* min-height: 18000px; */
  background-image: url('/static/images/background-clip.png');
  background-repeat: no-repeat;
  background-color: #071726;
  background-size: contain;
  overflow: hidden;
  /* padding-top: 45vw; */

  .logo {
    position: absolute;
    top: 10px;
    left: 0px;
  }

  .nav-box {
    white-space: nowrap;
    position: absolute;
    top: 36vw;
    left: 50%;
    width: 80%;
    justify-content: center;
    align-items: center;
    display: flex;
    transform: translateX(-50%);
    z-index: 2;
    .twitter {
      filter: grayscale(0%) brightness(55%);
    }
    span {
      margin-left: 20px !important;
      cursor: pointer;
      &:hover {
        filter: grayscale(100%) brightness(200%) !important;
      }
    }
    .nav-item {
      width: 42px;
      height: 42px;
      
      /* max-width: 62px;
      max-height: 62px; */
      /* object-fit: cover; */
      position: relative;
      
    }
    .wl-xyz{
        width: 42px;
        height: 22px;
      }
    & > * + * {
      margin-left: 10px;
    }
    @media (min-width: 700px) {
      .nav-item {

      width: 52px;
      height: 52px;
      }
      .wl-xyz{
        width: 52px;
        height: 32px;
      }
    }
    
    @media (min-width: 850px) {
      .nav-item {

      width: 62px;
      height: 62px;
      }
      .wl-xyz{
        width: 72px;
        height: 42px;
      }
      & > * + * {
        margin-left: 20px;
      }
    }
    


    @media (min-width: 1600px) {
      .nav-item {
        width: 72px;
        height: 72px;
      }
      & > * + * {
        margin-left: 20px;
      }
    }
  }

  .cloud {
    width: 120%;
    margin-left: -10vw;
    /* overflow: hidden; */
    height: 170.5px;

    position: relative;
    padding-top: 115vw;
    z-index: 1;
  }
  .flag {
    width: 80%;
    height: 309px;
    margin: 0 auto;
    margin-top: -60vw;
    /* margin-top: -60vmin; */
    /* margin-top: -60vmin; */
    position: relative;
    @media (min-width: 700px) {
      margin-top: -40vw;
    }
  }

  .home {
    position: relative;
    margin-top: 12vw;
    margin-bottom: 30px;
    height: 50px;
    @media (min-width: 1200px) {
      margin-top: 17vw;
    }
    @media (min-width: 1400px) {
      margin-top: 20vw;
    }
  }

  .title-img {
    position: relative;
    height: 50px;
  }

  .text {
    width: 80%;
    max-width: 1024px;
    color: white;
    /* font-size: 13px; */
    margin: 0 auto;
  }

  .title {
    font-size: 16px;
    font-weight: bolder;
  }

  .contract-wrapper {
    position: relative;
    width: 80%;
    margin: 0 auto;
    margin-top: 50px;
    max-width: 1024px;
    /* &::before {
      content: '';
      background: white;
      width: 100%;
      height: 2.5px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    } */
    &::after {
      content: '';
      background: white;
      width: 2.5px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .row {
    display: flex;
    /* align-items: center; */
  }

  .contract {
    margin-top: 50px;
  }

  .contract-row {
    min-height: 200px;
    color: white;
    & > div {
      width: 50%;
      position: relative;
    }
    .dot-box {
      position: absolute;
      right: 15px;
      bottom: -20px;
      /* bottom: 15px; */
      /* bottom: -20px; */
      display: flex;
      flex-wrap: wrap;
      & > * + * {
        margin-left: 8px;
      }
      /* width: 24px;
      height: 24px; */
    }
    .dot-row {
      margin-left: 0;
      margin-top: 5px;
      & > * + * {
        margin-left: 8px;
      }
    }
    .dot {
      width: 7.5px;
      height: 7.5px;
      background: white;
      border-radius: 50%;
    }
    &:nth-child(1) {
      padding-bottom: 35px;
      /* margin-bottom: 30px; */
      border-bottom: 2.5px solid white;
      & > div:nth-of-type(1) {
        padding-right: 15px;
        /* padding-bottom: 30px; */
      }
      & > div:nth-of-type(2) {
        padding-left: 15px;
        /* padding-bottom: 30px; */
        .dot-box {
          left: 15px;
        }
      }
    }
    &:nth-child(2) {
      padding-top: 45px;
      & > div:nth-of-type(1) {
        padding-right: 15px;
        .dot-box {
          top: -35px;
          right: 9px;
          flex-direction: column;
          align-items: center;
        }
      }
      & > div:nth-of-type(2) {
        padding-left: 15px;

        .dot-box {
          top: -35px;
          left: 15px;
          flex-direction: column;
          margin-top: -5px;
        }
      }
    }
  }

  .avatar-loop-box{
    height: 400px;
    position: relative;
    margin: 20vw auto;
  }

  .avatar-loop {
    width: calc(100vw + 150px);
    position: absolute;
    height: 400px;
    top: -10vw;
    @media (min-width: 800px) {
      height: 500px;
    }
  }

  .avatar-loop-front{
    width: calc(100vw + 150px);
    height: 400px;
    right: -86vw;
    transform: translateX(-50%);
    position: absolute;
    @media (min-width: 800px) {
     right: -87vw;
     top: -12vw;
      height: 600px;
    }
  }


  .about-box {
    width: 80%;
    max-width: 800px;
    height: 450px;
    margin: 0 auto;
    margin-top: 100px;

    position: relative;
    .about-text {
      margin-top: 10px;
    }
    .left-box {
      position: absolute;
      top: 80px;
      left: -20px;
      width: 300px;
      z-index: 2;
      .about {
        width: 130px;
        max-width: 300px;
      }
    }
    .about-avatar-box {
      position: absolute;
      right: -20px;
      z-index: 1;
      .about-avatar {
        /* width: 80%; */
        width: 60vw;
        max-width: 600px;
        /* width: 300px; */
        height: 550px;
        position: relative;
      }
    }
  }

  .roadmap {
    width: 180px;
    margin: 0 auto;
    margin-top: 100px;
  }

  .map {
    width: 80%;
    /* height: 20vw; */
    height: 200px;
    position: relative;
    margin: 50px auto 80px auto;
    @media (min-width: 800px) {
     height: 400px;
    }
  }

  .profile-wrapper {
    width: 90%;
    margin: 50px 0 0 10px;

    .profile-item {
      width: 44vmin;

      /* width: 142px; */
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .row {
      display: flex;
      margin-top: 15px;
      justify-content: center;
      align-items: center;
      & > * + * {
        margin-left: 15px;
      }
    }
    .profile {
      width: 44vmin;
      height: 44vmin;
      /* max-width: 200px;
      max-height: 200px; */
      /* width: 142px;
      height: 142px; */
      position: relative;
    }
    @media (min-width: 800px) {
      .profile-item {
        width: 55vmin;
      }
      .profile {
        max-width: 300px;
        max-height: 300px;
        width: 55vmin;
        height: 55vmin;
      }
    }
    @media (max-width: 600px) {
      .profile-item {
        width: 142px;
      }
      .profile {
        width: 142px;
        height: 142px;
      }
    }
    .name {
      font-size: 25px;
      font-family: Futura;
      font-weight: bold;
      color: #ffffff;
      line-height: 65px;
      white-space: nowrap;
    }
    .position {
      height: 45px;
      text-align: center;
      overflow: hidden;
    }
  }

  .wl {
    width: 800px !important;
  }

  .bg-bottom {
    width: 100%;
    height: 100vw;
    /* height: 400px; */
    position: relative;
  }

  .faq {
    margin: 00px 0 50px 0;
  }

  .faq-box {
    width: 90%;
    max-width: 1024px;
    margin: 20px auto 200px auto;
    .faq-item {
      margin-bottom: 40px;
      .ques {
        font-weight: bolder;
        margin-bottom: 10px;
        font-size: 23px;
      }
    }
  }
`;

const StyledImage = styled(Image)`
  margin: 20px 20px;
  display: none;
`;

const StyledBottomRightRow = styled.div`
  position: absolute;
  right: 45px;
  bottom: 30px;
  z-index: 1;
  /* color: #561c30; */
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  & > * {
    cursor: pointer;
  }
`;
const StyledBottomCenterRow = styled.div`
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  z-index: 1;
  /* color: #561c30; */
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  & > * {
    cursor: pointer;
  }
  .links {
    margin: 0 25px;
    display: flex;
    & > * {
      margin-right: 5px;
    }
  }
  .copyright {
    margin-right: 25px;
  }
  .languages {
    /* span:first-of-type {
      margin-right: 5px;
    } */
    & > * {
      margin-right: 5px;
    }
    .cur-lang {
      color: #561c30;
    }
  }
`;

const MuteIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    className="iconify iconify--mdi"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12Z"
    ></path>
  </svg>
);

const VolIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5H7z"></path>
  </svg>
);

const PauseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M14 19V5h4v14Zm-8 0V5h4v14Z"></path>
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
    ></path>
  </svg>
);
const OpenSeaIcon = (props) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   aria-hidden="true"
  //   role="img"
  //   width="20"
  //   height="20"
  //   preserveAspectRatio="xMidYMid meet"
  //   viewBox="0 0 24 24"
  // >
  //   <path
  //     fill="currentColor"
  //     d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12s12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081l3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528c-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199a.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962c-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132c-.026.226.017.459.125.67c.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992c.156-.274.308-.566.43-.86c.024-.052.043-.107.065-.16c.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787c0-.108-.004-.221-.014-.327c-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312a6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972a5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197a4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05l.192.054l.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202a.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017c.034.024.084.062.147.11c.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691c.065.074.127.146.192.226c.062.079.132.156.19.232c.079.104.16.212.235.324c.033.053.074.108.105.161c.096.142.178.288.257.435c.034.067.067.141.096.213c.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254c-.075.17-.161.343-.264.502c-.034.06-.075.122-.113.182c-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209c-.081.098-.16.19-.245.278c-.048.058-.1.118-.156.17c-.052.06-.108.113-.156.161c-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298c.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z"
  //   ></path>
  // </svg>
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7130"
    width="20"
    height="20"
    {...props}
  >
    <path
      d="M136.106667 566.528l2.986666-4.693333 180.053334-281.642667a6.144 6.144 0 0 1 10.794666 0.768c30.08 67.413333 56.064 151.253333 43.904 203.434667-5.205333 21.504-19.413333 50.56-35.413333 77.44a141.738667 141.738667 0 0 1-6.784 11.477333 6.101333 6.101333 0 0 1-5.12 2.688h-185.173333a6.144 6.144 0 0 1-5.248-9.472z"
      p-id="7131"
      fill="#fff"
    ></path>
    <path
      d="M938.666667 618.88v44.586667a6.4 6.4 0 0 1-3.84 5.845333c-13.952 5.973333-61.653333 27.861333-81.493334 55.466667C802.688 795.221333 764.032 896 677.546667 896H316.8C188.928 896 85.333333 792.021333 85.333333 663.765333v-4.138666c0-3.413333 2.773333-6.186667 6.186667-6.186667h201.088c4.010667 0 6.912 3.712 6.570667 7.594667-1.450667 13.098667 0.981333 26.453333 7.168 38.613333 11.946667 24.277333 36.693333 39.424 63.445333 39.424H469.333333V661.333333H370.901333a6.357333 6.357333 0 0 1-5.12-9.941333c1.066667-1.664 2.304-3.370667 3.584-5.290667 9.301333-13.226667 22.613333-33.749333 35.84-57.173333 9.002667-15.786667 17.749333-32.64 24.789334-49.536 1.450667-3.072 2.56-6.186667 3.712-9.258667 1.92-5.418667 3.925333-10.453333 5.333333-15.488 1.408-4.266667 2.56-8.746667 3.712-12.970666 3.328-14.336 4.736-29.568 4.736-45.354667 0-6.186667-0.256-12.672-0.853333-18.858667a244.906667 244.906667 0 0 0-1.962667-20.266666 208.981333 208.981333 0 0 0-2.773333-18.048 304.64 304.64 0 0 0-5.717334-27.008l-0.768-3.413334c-1.706667-6.186667-3.114667-12.117333-5.12-18.304A690.261333 690.261333 0 0 0 411.392 294.4c-2.517333-7.04-5.333333-13.781333-8.192-20.565333-4.181333-10.154667-8.448-19.413333-12.373333-28.16a393.728 393.728 0 0 1-5.418667-11.306667 398.72 398.72 0 0 0-5.888-12.373333c-1.408-3.029333-3.072-5.888-4.181333-8.746667l-12.16-22.442667a3.968 3.968 0 0 1 4.48-5.76l76.074666 20.608h0.213334l0.298666 0.085334 10.026667 2.773333 11.008 3.114667 4.053333 1.152v-45.226667c0-21.845333 17.493333-39.552 39.125334-39.552 10.794667 0 20.608 4.394667 27.648 11.605333a39.765333 39.765333 0 0 1 11.434666 27.946667V234.666667l8.106667 2.261333c0.64 0.213333 1.28 0.512 1.877333 0.938667 1.962667 1.493333 4.821333 3.712 8.448 6.4 2.858667 2.261333 5.888 5.034667 9.6 7.893333 7.338667 5.888 16.085333 13.525333 25.685334 22.272 2.56 2.176 5.034667 4.48 7.296 6.741333 12.373333 11.52 26.24 25.045333 39.466666 39.978667 3.712 4.181333 7.338667 8.448 11.050667 12.928 3.669333 4.565333 7.594667 9.045333 11.008 13.525333 4.48 5.973333 9.301333 12.16 13.525333 18.602667 1.962667 3.072 4.266667 6.186667 6.186667 9.258667 5.376 8.192 10.154667 16.64 14.72 25.088 1.92 3.925333 3.882667 8.192 5.589333 12.373333 5.077333 11.306667 9.045333 22.826667 11.605334 34.346667 0.768 2.517333 1.365333 5.205333 1.621333 7.637333v0.554667c0.853333 3.413333 1.152 7.04 1.450667 10.752a114.901333 114.901333 0 0 1-6.186667 50.346666c-1.706667 4.821333-3.413333 9.856-5.632 14.634667-4.266667 9.898667-9.301333 19.754667-15.274667 29.013333-1.92 3.413333-4.224 7.04-6.485333 10.453334-2.474667 3.626667-5.034667 7.04-7.338667 10.368-3.114667 4.266667-6.442667 8.746667-9.856 12.757333a135.253333 135.253333 0 0 1-9.6 12.074667c-4.778667 5.632-9.344 10.965333-14.08 16.085333a146.773333 146.773333 0 0 1-9.045333 9.813333c-3.072 3.413333-6.186667 6.442667-9.045333 9.301334a360.192 360.192 0 0 1-12.074667 11.52l-7.808 7.168a6.4 6.4 0 0 1-4.224 1.578666h-60.586667v77.738667h76.245334c17.066667 0 33.28-6.058667 46.378666-17.152 4.48-3.925333 24.021333-20.821333 47.146667-46.378667a5.888 5.888 0 0 1 2.901333-1.749333l210.56-60.885333a6.229333 6.229333 0 0 1 7.893334 5.973333z"
      p-id="7132"
      fill="#fff"
    ></path>
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#fff"
      d="M12 2c2.717 0 3.056.01 4.122.06c1.065.05 1.79.217 2.428.465c.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428c.047 1.066.06 1.405.06 4.122c0 2.717-.01 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772a4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465c-1.066.047-1.405.06-4.122.06c-2.717 0-3.056-.01-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153a4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122c.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10a5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0a1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z"
    ></path>
  </svg>
);
const DiscordIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
    ></path>
  </svg>
);

const MagicedenIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="20"
    viewBox="0 0 314 68"
    fill="none"
  >
    {/* <path
      d="M237.38 39.3041H232.28C231.885 39.2941 231.51 39.1352 231.231 38.8601C230.951 38.585 230.79 38.2148 230.78 37.8258V36.6432C230.79 36.2543 230.951 35.8841 231.231 35.609C231.51 35.3339 231.885 35.1749 232.28 35.165H236.64C237.038 35.165 237.419 35.0092 237.701 34.732C237.982 34.4548 238.14 34.0788 238.14 33.6867C238.14 33.2947 237.982 32.9186 237.701 32.6414C237.419 32.3642 237.038 32.2084 236.64 32.2084H232.24C231.845 32.1985 231.47 32.0395 231.191 31.7644C230.911 31.4893 230.75 31.1191 230.74 30.7302V29.5476C230.75 29.1587 230.911 28.7884 231.191 28.5133C231.47 28.2382 231.845 28.0793 232.24 28.0693H237.24C237.638 28.0693 238.019 27.9136 238.301 27.6363C238.582 27.3591 238.74 26.9831 238.74 26.5911C238.74 26.199 238.582 25.823 238.301 25.5458C238.019 25.2685 237.638 25.1128 237.24 25.1128H231.24C231.006 25.1081 230.778 25.1845 230.595 25.3286C230.412 25.4726 230.287 25.6752 230.24 25.9012L227.04 40.7824V41.078C227.096 41.4235 227.281 41.7359 227.559 41.9545C227.836 42.1731 228.186 42.2822 228.54 42.2606H237.34C237.738 42.2606 238.119 42.1049 238.401 41.8277C238.682 41.5504 238.84 41.1744 238.84 40.7824C238.84 40.3903 238.682 40.0143 238.401 39.7371C238.119 39.4598 237.738 39.3041 237.34 39.3041H237.38Z"
      fill="white"
    /> */}
    {/* <path
      d="M126.38 25.2113H124.38C124.086 25.215 123.798 25.3001 123.551 25.457C123.303 25.6138 123.106 25.836 122.98 26.0983L118.58 36.5447C118.58 36.5708 118.569 36.5959 118.551 36.6144C118.532 36.6329 118.507 36.6432 118.48 36.6432C118.38 36.6432 118.38 36.6432 118.38 36.5447L113.98 26.0983C113.873 25.8317 113.701 25.5949 113.48 25.4084C113.08 25.1128 112.58 25.507 112.48 25.9998L109.18 41.078C109.154 41.2487 109.189 41.4231 109.28 41.5708C109.4 41.809 109.585 42.0093 109.815 42.1487C110.045 42.2881 110.31 42.361 110.58 42.3592H111.18C111.568 42.3394 111.933 42.1762 112.204 41.9021C112.475 41.628 112.63 41.2633 112.64 40.8809V31.2229C112.64 31.1968 112.651 31.1717 112.669 31.1533C112.688 31.1348 112.713 31.1244 112.74 31.1244C112.767 31.1244 112.792 31.1348 112.811 31.1533C112.829 31.1717 112.84 31.1968 112.84 31.2229L116.94 41.3737C117.049 41.6479 117.243 41.8812 117.494 42.0405C117.746 42.1997 118.042 42.2768 118.34 42.2606H118.74C119.034 42.2569 119.322 42.1718 119.569 42.015C119.817 41.8582 120.014 41.636 120.14 41.3737L124.24 31.3215C124.24 31.2954 124.251 31.2703 124.269 31.2518C124.288 31.2333 124.313 31.2229 124.34 31.2229C124.367 31.2229 124.392 31.2333 124.411 31.2518C124.429 31.2703 124.44 31.2954 124.44 31.3215V40.8809C124.45 41.2698 124.611 41.6401 124.891 41.9152C125.17 42.1902 125.545 42.3492 125.94 42.3592H126.54C126.935 42.3492 127.31 42.1902 127.589 41.9152C127.869 41.6401 128.03 41.2698 128.04 40.8809V26.6896C127.971 26.2955 127.771 25.9355 127.47 25.6674C127.168 25.3994 126.785 25.2387 126.38 25.2113Z"
      fill="white"
    />
    <path
      d="M172.18 33.194H167.78C167.409 33.194 167.053 33.3393 166.79 33.5981C166.527 33.8568 166.38 34.2077 166.38 34.5737C166.38 34.9396 166.527 35.2905 166.79 35.5493C167.053 35.808 167.409 35.9534 167.78 35.9534H168.58C169.38 35.9534 170.18 36.6432 169.78 37.4316C169.18 38.7128 167.98 39.4026 166.08 39.4026C163.28 39.4026 161.58 37.3331 161.58 33.7853C161.58 30.2374 163.38 28.1679 166.08 28.1679C166.706 28.136 167.33 28.2644 167.891 28.5408C168.452 28.8171 168.93 29.2319 169.28 29.7447C169.436 30.032 169.666 30.2741 169.947 30.447C170.228 30.6198 170.549 30.7175 170.88 30.7302H171.78C171.982 30.7464 172.186 30.7138 172.372 30.6352C172.559 30.5566 172.723 30.4344 172.851 30.2792C172.979 30.1239 173.067 29.9403 173.107 29.7441C173.147 29.548 173.137 29.3452 173.08 29.1534C172.456 27.8613 171.459 26.7794 170.214 26.0431C168.968 25.3069 167.531 24.949 166.08 25.0142C161.48 25.0142 157.98 28.2664 157.98 33.7853C157.98 39.3041 161.28 42.5563 166.18 42.5563C170.58 42.5563 173.68 39.7968 173.68 35.3621V34.6722C173.684 34.477 173.648 34.2829 173.574 34.1018C173.5 33.9206 173.39 33.756 173.25 33.618C173.11 33.4799 172.943 33.3711 172.759 33.2983C172.575 33.2254 172.378 33.1899 172.18 33.194Z"
      fill="white"
    />
    <path
      d="M146.18 26.1969C146.077 25.9109 145.888 25.6629 145.638 25.4866C145.387 25.3103 145.088 25.2142 144.78 25.2113H142.18C141.872 25.2142 141.573 25.3103 141.322 25.4866C141.072 25.6629 140.883 25.9109 140.78 26.1969L135.78 40.3882C135.705 40.61 135.684 40.8461 135.718 41.0775C135.752 41.3089 135.841 41.5292 135.977 41.7208C136.113 41.9124 136.293 42.0699 136.502 42.1808C136.71 42.2916 136.943 42.3527 137.18 42.3592H137.98C138.288 42.3563 138.587 42.2602 138.838 42.0839C139.088 41.9076 139.277 41.6596 139.38 41.3737L139.98 39.5012C140.083 39.2152 140.272 38.9673 140.522 38.791C140.773 38.6147 141.072 38.5186 141.38 38.5157H145.48C145.788 38.5186 146.087 38.6147 146.338 38.791C146.588 38.9673 146.777 39.2152 146.88 39.5012L147.48 41.3737C147.583 41.6596 147.772 41.9076 148.022 42.0839C148.273 42.2602 148.572 42.3563 148.88 42.3592H149.68C149.917 42.3527 150.15 42.2916 150.358 42.1808C150.567 42.0699 150.747 41.9124 150.883 41.7208C151.019 41.5292 151.108 41.3089 151.142 41.0775C151.176 40.8461 151.155 40.61 151.08 40.3882L146.18 26.1969ZM143.64 35.5592H143.34C143.103 35.5527 142.87 35.4916 142.661 35.3808C142.453 35.2699 142.273 35.1124 142.137 34.9208C142.001 34.7292 141.912 34.5089 141.878 34.2775C141.844 34.0461 141.865 33.81 141.94 33.5882L143.44 29.0548C143.44 29.0287 143.451 29.0036 143.469 28.9851C143.488 28.9667 143.513 28.9563 143.54 28.9563C143.567 28.9563 143.592 28.9667 143.611 28.9851C143.629 29.0036 143.64 29.0287 143.64 29.0548L145.14 33.5882C145.194 33.8169 145.197 34.0546 145.148 34.2845C145.1 34.5144 145 34.731 144.857 34.9189C144.714 35.1068 144.531 35.2616 144.321 35.3722C144.11 35.4828 143.878 35.5466 143.64 35.5592Z"
      fill="white"
    />
    <path
      d="M183.78 25.2113H183.08C182.685 25.2213 182.31 25.3803 182.031 25.6554C181.751 25.9305 181.59 26.3007 181.58 26.6896V40.8809C181.59 41.2698 181.751 41.6401 182.031 41.9152C182.31 42.1902 182.685 42.3492 183.08 42.3592H183.78C184.175 42.3492 184.55 42.1902 184.829 41.9152C185.109 41.6401 185.27 41.2698 185.28 40.8809V26.6896C185.254 26.3059 185.088 25.9445 184.812 25.6726C184.536 25.4007 184.169 25.2368 183.78 25.2113Z"
      fill="white"
    /> */}
    {/* <path
      d="M201.28 28.1679C201.954 28.1496 202.621 28.3034 203.217 28.6142C203.812 28.925 204.317 29.3824 204.68 29.9418C204.809 30.285 205.041 30.5816 205.344 30.7927C205.648 31.0037 206.009 31.1194 206.38 31.1244H207.08C207.282 31.1406 207.486 31.108 207.672 31.0294C207.859 30.9508 208.023 30.8286 208.151 30.6734C208.279 30.5181 208.367 30.3345 208.407 30.1383C208.447 29.9422 208.438 29.7394 208.38 29.5476C207.38 26.5911 204.68 24.9157 201.18 24.9157C196.58 24.9157 193.08 28.0693 193.08 33.6867C193.08 39.3041 196.48 42.4577 201.18 42.4577C204.88 42.4577 207.38 40.4867 208.28 38.0229C208.338 37.8311 208.347 37.6283 208.307 37.4322C208.267 37.236 208.179 37.0524 208.051 36.8972C207.923 36.7419 207.759 36.6197 207.572 36.5411C207.386 36.4625 207.182 36.4299 206.98 36.4461H206.18C205.816 36.4778 205.467 36.6039 205.168 36.8116C204.87 37.0193 204.632 37.3013 204.48 37.6287C204.147 38.1931 203.663 38.6567 203.081 38.9694C202.499 39.2821 201.842 39.432 201.18 39.4026C198.58 39.4026 196.78 37.4316 196.78 33.7853C196.78 30.1389 198.58 28.1679 201.28 28.1679Z"
      fill="white"
    />
    <path
      d="M253.08 25.2113H248.38C247.985 25.2213 247.61 25.3803 247.331 25.6554C247.051 25.9305 246.89 26.3007 246.88 26.6896V40.8809C246.89 41.2698 247.051 41.6401 247.331 41.9152C247.61 42.1902 247.985 42.3492 248.38 42.3592H253.08C258.38 42.3592 261.58 39.107 261.58 33.7853C261.58 28.4635 258.28 25.2113 253.08 25.2113ZM252.88 39.2056H252.08C251.685 39.1956 251.31 39.0366 251.031 38.7615C250.751 38.4864 250.59 38.1162 250.58 37.7273V29.7447C250.59 29.3558 250.751 28.9855 251.031 28.7104C251.31 28.4353 251.685 28.2764 252.08 28.2664H252.88C256.18 28.2664 257.88 29.9418 257.88 33.6867C257.88 37.4316 256.18 39.2056 252.88 39.2056Z"
      fill="white"
    />
    <path
      d="M279.58 39.3041H274.48C274.085 39.2941 273.71 39.1352 273.431 38.8601C273.151 38.585 272.99 38.2148 272.98 37.8258V36.6432C272.99 36.2543 273.151 35.8841 273.431 35.609C273.71 35.3339 274.085 35.1749 274.48 35.165H278.88C279.278 35.165 279.659 35.0092 279.941 34.732C280.222 34.4548 280.38 34.0788 280.38 33.6867C280.38 33.2946 280.222 32.9186 279.941 32.6414C279.659 32.3642 279.278 32.2084 278.88 32.2084H274.48C274.085 32.1985 273.71 32.0395 273.431 31.7644C273.151 31.4893 272.99 31.1191 272.98 30.7302V29.5476C272.99 29.1587 273.151 28.7884 273.431 28.5133C273.71 28.2382 274.085 28.0793 274.48 28.0693H279.48C279.878 28.0693 280.259 27.9136 280.541 27.6363C280.822 27.3591 280.98 26.9831 280.98 26.5911C280.98 26.199 280.822 25.823 280.541 25.5458C280.259 25.2685 279.878 25.1128 279.48 25.1128H270.78C270.385 25.1228 270.01 25.2817 269.731 25.5568C269.451 25.8319 269.29 26.2021 269.28 26.5911V40.7824C269.29 41.1713 269.451 41.5415 269.731 41.8166C270.01 42.0917 270.385 42.2506 270.78 42.2606H279.58C279.975 42.2506 280.35 42.0917 280.629 41.8166C280.909 41.5415 281.07 41.1713 281.08 40.7824C281.084 40.5871 281.048 40.3931 280.974 40.2119C280.9 40.0307 280.79 39.8662 280.65 39.7281C280.51 39.59 280.343 39.4813 280.159 39.4084C279.975 39.3356 279.778 39.3001 279.58 39.3041Z"
      fill="white"
    />
    <path
      d="M302.18 25.2113H301.48C301.085 25.2213 300.71 25.3803 300.431 25.6554C300.151 25.9305 299.99 26.3007 299.98 26.6896V35.8548C299.98 35.9534 299.98 35.9534 299.88 35.9534H299.78L292.78 25.9012C292.644 25.7134 292.464 25.5613 292.255 25.4583C292.046 25.3552 291.814 25.3042 291.58 25.3099H290.64C290.245 25.3199 289.87 25.4788 289.591 25.7539C289.311 26.029 289.15 26.3992 289.14 26.7882V40.9795C289.15 41.3684 289.311 41.7386 289.591 42.0137C289.87 42.2888 290.245 42.4477 290.64 42.4577H291.34C291.735 42.4477 292.11 42.2888 292.389 42.0137C292.669 41.7386 292.83 41.3684 292.84 40.9795V31.7157C292.84 31.6896 292.851 31.6645 292.869 31.646C292.888 31.6275 292.913 31.6171 292.94 31.6171H293.04L300.14 41.6693C300.276 41.8571 300.456 42.0092 300.665 42.1123C300.874 42.2154 301.106 42.2663 301.34 42.2606H302.24C302.635 42.2506 303.01 42.0917 303.289 41.8166C303.569 41.5415 303.73 41.1713 303.74 40.7824V26.5911C303.672 26.2231 303.482 25.8878 303.2 25.638C302.917 25.3882 302.559 25.2381 302.18 25.2113Z"
      fill="white"
    /> */}
    <path
      d="M66.01 22.0873L70.64 27.5273C71.17 28.1383 71.64 28.6409 71.83 28.9267C73.2147 30.3028 73.9911 32.1626 73.99 34.1006C73.86 36.387 72.37 37.9441 70.99 39.6096L67.75 43.4137L66.06 45.3847C65.9994 45.4526 65.9603 45.5366 65.9475 45.6263C65.9348 45.7159 65.949 45.8072 65.9884 45.889C66.0277 45.9708 66.0905 46.0394 66.169 46.0864C66.2475 46.1333 66.3382 46.1566 66.43 46.1534H83.32C85.9 46.1534 89.15 48.3215 88.96 51.6131C88.9547 53.1091 88.3493 54.5425 87.2759 55.6003C86.2025 56.6582 84.7481 57.2548 83.23 57.26H56.78C55.04 57.26 50.36 57.4473 49.05 53.456C48.7714 52.6219 48.7333 51.7281 48.94 50.8739C49.3208 49.611 49.9232 48.4235 50.72 47.3655C52.05 45.3945 53.49 43.4235 54.91 41.5116C56.74 39.0084 58.62 36.5841 60.47 34.0316C60.5357 33.9485 60.5714 33.8462 60.5714 33.7409C60.5714 33.6356 60.5357 33.5333 60.47 33.4502L53.75 25.5661C53.7062 25.509 53.6495 25.4626 53.5844 25.4307C53.5194 25.3988 53.4477 25.3822 53.375 25.3822C53.3023 25.3822 53.2306 25.3988 53.1656 25.4307C53.1005 25.4626 53.0438 25.509 53 25.5661C51.2 27.9609 43.32 38.565 41.64 40.7134C39.96 42.8618 35.82 42.98 33.53 40.7134L23.02 30.3163C22.9529 30.2499 22.8672 30.2046 22.774 30.1863C22.6807 30.1679 22.584 30.1773 22.4962 30.2132C22.4083 30.2491 22.3332 30.3099 22.2805 30.3879C22.2278 30.4659 22.1998 30.5576 22.2 30.6513V50.6473C22.2247 52.0663 21.7984 53.4573 20.9806 54.6255C20.1629 55.7936 18.9948 56.6804 17.64 57.1615C16.7743 57.4584 15.8492 57.5471 14.9416 57.4201C14.0341 57.2931 13.1706 56.9541 12.423 56.4314C11.6754 55.9088 11.0654 55.2175 10.6439 54.4154C10.2225 53.6132 10.0017 52.7234 10 51.82V15.8687C10.0603 14.5731 10.5333 13.3292 11.3519 12.3137C12.1705 11.2982 13.293 10.5628 14.56 10.2119C15.6468 9.92658 16.7908 9.92944 17.8761 10.2202C18.9614 10.5109 19.9494 11.0793 20.74 11.8676L36.9 27.8131C36.9484 27.8615 37.0069 27.8989 37.0716 27.9225C37.1362 27.9461 37.2054 27.9555 37.2741 27.9498C37.3428 27.9442 37.4094 27.9237 37.4692 27.8899C37.529 27.856 37.5804 27.8096 37.62 27.7539L49.1 12.0942C49.6305 11.4585 50.2956 10.9448 51.0488 10.589C51.8019 10.2332 52.6249 10.044 53.46 10.0345H83.32C84.1372 10.0359 84.9447 10.2091 85.6884 10.5427C86.4322 10.8764 87.0951 11.3627 87.6328 11.9691C88.1705 12.5755 88.5706 13.2881 88.8064 14.0592C89.0422 14.8303 89.1082 15.6421 89 16.4403C88.7896 17.825 88.0767 19.0876 86.9936 19.9937C85.9104 20.8998 84.5306 21.3881 83.11 21.3679H66.39C66.306 21.3699 66.2241 21.3941 66.1527 21.4379C66.0814 21.4817 66.0233 21.5436 65.9845 21.617C65.9457 21.6905 65.9276 21.7729 65.9321 21.8556C65.9366 21.9383 65.9635 22.0183 66.01 22.0873Z"
      fill="white"
    />
  </svg>
);

// export function Index() {
//   const [isMute, setIsMute] = useState(true);

//   return (
//     <>
//       <StyledVideo
//         x5-video-player-type="h5"
//         x-webkit-airplay="true"
//         webkit-playsinline="true"
//         loop
//         autoPlay
//         muted={isMute}
//         onTimeUpdate={() => {
//         }}
//       >
//         <source
//           src={require('../public/static/preview.mp4')}
//           type="video/mp4"
//         />
//       </StyledVideo>
//       <Header />
//       <StyledBottomRightRow>
//         {isMute ? (
//           <MuteIcon
//             onClick={() => {
//               setIsMute(false);
//             }}
//           />
//         ) : (
//           <VolIcon
//             onClick={() => {
//               setIsMute(true);
//             }}
//           />
//         )}
//       </StyledBottomRightRow>

//       <StyledBottomCenterRow>
//         {/* <PauseIcon /> */}

//         <div className="links">
//           <TwitterIcon />
//           <DiscordIcon />
//           <InstagramIcon />
//           <OpenSeaIcon />
//           <MagicedenIcon />
//         </div>
//         <div className="copyright">
//           ©{' '}
//           <a
//             href="https://septime.net/en/agency/about"
//             data-item="agency/intro"
//             title="Septime Création"
//           >
//             Baatarverse
//           </a>{' '}
//           2022{' '}
//         </div>
//         {/* <div className="languages">
//           <span className="cur-lang">EN</span>
//           <span>ZH</span>
//         </div> */}
//       </StyledBottomCenterRow>
//     </>
//   );
// }
