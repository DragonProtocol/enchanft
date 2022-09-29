import { useState } from 'react';

import Image from 'next/image';
import styled from 'styled-components';
import classnames from 'classnames';

import Header from '../components/header';

export function Index() {
  const [isMute, setIsMute] = useState(true);
  const [isExpand, setIsExpand] = useState(false);

  const scrollToAnchor = (anchorName) => {
    console.log('anchorName', anchorName);
    if (anchorName) {
      // const tabBar = document.getElementById('tab-bar').offsetHeight
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };
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

  const renderNavComponents = (isBottom) => (
    <div className={classnames('nav-box', { isBottom: isBottom })}>
      <div className="nav-item">
        <Image
          src={'/static/images/twitter.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div>
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

      {isBottom && (
        <div
          className="nav-item"
          onClick={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Image
            src={'/static/images/to-top.png'}
            layout="fill"
            objectFit="contain"
            // objectFit='cover'
            alt={'basic'}
          />
        </div>
      )}
    </div>
  );

  return (
    <Wrapper>
      <StyledVideo
        x5-video-player-type="h5"
        x-webkit-airplay="true"
        webkit-playsinline="true"
        loop
        autoPlay
        muted={isMute}
        onTimeUpdate={() => {}}
      >
        <source src={require('../public/static/bg.mp4')} type="video/mp4" />
      </StyledVideo>

      <div className={classnames('sidebar', { expand: isExpand })}>
        <div
          className="image-container more"
          onClick={() => setIsExpand((isExpand) => !isExpand)}
        >
          <Image
            className="image"
            src={'/static/images/more.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>
        {[
          'Home',
          'CaskBaatar\ncontract',
          'About',
          'Story',
          'Rodmap',
          'Team',
          'FAQ',
        ]?.map((key) => (
          <div
            className="sidebar-item"
            key={key}
            onClick={() => scrollToAnchor(key)}
          >
            {key}
          </div>
        ))}
      </div>

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

      {renderNavComponents(null)}

      <div className="image-container cloud">
        <Image
          className={'image'}
          src={'/static/images/cloud.png'}
          layout="fill"
          alt={'basic'}
        />
      </div>

      <div className="middle-bg">
        <div className="image-container big-title">
          <Image
            src={'/static/images/CASKBAATAR.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>
        <div className="image-container title-gif">
          <Image
            src={'/static/images/title.gif'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>
      </div>
      <div className="bg-texture">
        <div className="home title-img" id="Home">
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
          cask selectors. Each CaskBaatar NFT contains an NFT picture and at
          least a bottle of whisky.
          <br />
          <br />
          CaskBaatar NFT is created based on the image of a Mongolian man, and
          matches the costumes of different periods from the 13th century to the
          present.As a Mongolian in the 21st century, the artist Yieder, while
          recalling the ancient history and culture, mostly conveys the concept
          of "Mongolian in the 21st century", and shows the state of
          contemporary Mongolian people from his perspective. Give the character
          visual representation of tradition and future.
        </div>
      </div>
      <div className="image-container">
        <Image
          className={'image avatar-loop-front'}
          src={'/static/images/avatar_loop_front.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
        <div className="avatar-loop-box ">
          <video
            x5-video-player-type="h5"
            x-webkit-airplay="true"
            webkit-playsinline="true"
            className="avatar-loop"
            loop
            autoPlay
            muted={isMute}
            onTimeUpdate={() => {}}
          >
            <source
              src={require('../public/static/avatar_loop.mp4')}
              type="video/mp4"
            />
          </video>
        </div>
        {/* <div className="avatar-loop">
          <Image
            className={'image'}
            src={'/static/images/avatar_loop.gif'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div> */}
      </div>
      <div className="bg-t">
        <div className="contract title-img" id="CaskBaatar contract">
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
              Our technical team comes from EnchaNFT Company in Singapore, and
              we use the ERC721 smart contract.
              <br />
              <br />
              After your mint on our official website, 70% of the amount will be
              stored in the contract, and the remaining 30% will be transferred
              to the managing team for the operation of the project.
              <div className="dot-box">
                <i className="dot" />
              </div>
            </div>
            <div className="contract-box">
              At the same time, the estimated bottling time and conversion time
              of the whisky will also be announced. Our technical team comes
              from EnchaNFT Company in Singapore, and we use the ERC721 smart
              contract.
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
              Generally, the conversion time of whisky will last one year. If
              you neither destroy nor convert the NFT during that, you will lose
              your right to convert. At the same time, the managing team will
              gain the 70% amount in the NFT.
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
      </div>

      <div className="bg-b">
        <div className="about-wrapper">
          <div className="black-cloud black-cloud-1 image-container">
            <Image
              className={'image'}
              src={'/static/images/black-cloud-1.png'}
              layout="fill"
              objectFit="contain"
              alt={'basic'}
            />
          </div>
          <div className="about-box">
            <div className="left-box">
              <div className="about title-img" id="About">
                <Image
                  src={'/static/images/about.png'}
                  layout="fill"
                  objectFit="contain"
                  alt={'basic'}
                />
              </div>
              <div className="about-text">
                The vision of CaskBaatar is to combine the art collection and
                the investment in whisky through web3.
                <br />
                <br />
                Only by integrating NFT with the real things can we create a
                sustainable and stable NFT ecosystem, which is the most
                significant value of this project.
                <br />
                <br />
                The owners of CaskBaatar NFT also become contributors and
                investors to our mission.
              </div>
            </div>
            <div className="about-avatar-box">
              <div className="about-avatar image-container">
                <Image
                  className="image"
                  src={'/static/images/about-avatar.gif'}
                  layout="fill"
                  objectFit="contain"
                  alt={'basic'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="about-box top">
          <div className="left-box">
            <div className="about title-img" id="Story">
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
              sustainable and stable NFT ecosystem, which is the most
              significant value of this project.
              <br />
              <br />
              The owners of CaskBaatar NFT also become contributors and
              investors to our mission.
            </div>
          </div>
        </div>

        <div className="roadmap title-img" id="Rodmap">
          <Image
            src={'/static/images/roadmap.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>

        <div className="image-container map-wrapper">
          {/* <Image
          src={'/static/images/roadmap.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        /> */}
          <Image
            className={'image map'}
            src={'/static/images/map.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
          <div className="map-text map-text-1">
            NFT collection
            <br />
            on sale
          </div>
          <div className="map-text map-text-2">
            Airdrop bonus whisky (if any) to
            <br /> the rare NFT owners
          </div>
          <div className="map-text map-text-3">
            More interesting activities
            <br /> are waiting to be unlocked
          </div>
          <div className="map-text map-text-4">
            Whitelist extraction of <br />
            Exclusive NFT collection
          </div>
          <div className="black-cloud image-container">
            <Image
              className={'image'}
              src={'/static/images/black-cloud-2.png'}
              layout="fill"
              objectFit="contain"
              alt={'basic'}
            />
          </div>
        </div>
      </div>

      {/* <div className="map-bg">
        <div className="roadmap title-img">
          <Image
            src={'/static/images/roadmap.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>

        <div className="image-container map">
          <Image
            className={'image'}
            src={'/static/images/map.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>
      </div> */}
      {/* <div className="map">
        <Image
          src={'/static/images/map.png'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
      </div> */}

      <div className="team title-img" id="Team">
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
            {renderProfile('/static/images/Oddie.png', 'Oddie', 'Founder')}
            {renderProfile(
              '/static/images/Yideer.png',
              'Yideer',
              'Chief Artist'
            )}
            {renderProfile(
              '/static/images/Tony.png',
              'Tony',
              'Project Advisor'
            )}
          </div>
          <div className="row">
            {renderProfile('/static/images/Katie.png', 'Katie', 'Manager')}
            {renderProfile('/static/images/Ariaa.png', 'Ariaa', 'Designer')}
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

      <div className="faq title-img" id="FAQ">
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
      {renderNavComponents(true)}
      {/* <div className="image-container">
        <div className="image-container middle-bg">
          <Image
            className={'image'}
            src={'/static/images/middle-bg.png'}
            layout="fill"
            alt={'basic'}
          />
        </div>
        <div className="image-container">
        <Image
          src={'/static/images/title.gif'}
          layout="fill"
          objectFit="contain"
          alt={'basic'}
        />
        </div>
      </div> */}
    </Wrapper>
  );
}

export default Index;

const StyledVideo = styled.video`
  /* top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    transform: translateX(-50%) translateY(-50%);
    margin-top: -1px; */

  position: absolute;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  left: 0;
  top: 0;
  z-index: 0;
  /* opacity: 0.9; */
`;

const Wrapper = styled.div`
  width: 100vw;
  min-height: 1800px;
  /* min-height: 18000px; */
  /* background-image: url('/static/images/background-clip.png'); */
  background-repeat: no-repeat;
  background-color: #071726;
  background-size: contain;
  overflow: hidden;
  /* padding-top: 45vw; */

  .image-container {
    width: 100%;
    position: relative;
    > span {
      position: unset !important;
    }
    .image {
      object-fit: contain;
      width: 100% !important;
      position: relative !important;
      height: unset !important;
    }
  }

  .sidebar {
    position: fixed;
    top: 20px;
    right: 40px;
    width: 75px;
    max-height: 50px;
    overflow: hidden;
    border-radius: 55px;
    font-size: 0.6rem;
    transition: all 1.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    z-index: 999;
    font-family: 'Futura Condensed';

    &:hover {
      max-height: 800px;
      background: #07142380;
    }
    .sidebar-item {
      text-align: center;
      margin: 20px auto;
      cursor: pointer;
      white-space: pre;
      &:hover {
        color: #00a791;
      }
    }
  }

  .expand {
    max-height: 800px;
    background: #07142380;
    /* background: #07142366; */
  }

  .more {
    width: 0.8rem;
    filter: grayscale(100%) brightness(200%);
    margin: 20px auto;
    cursor: pointer;
    &:hover {
      color: #00a791;
      filter: invert(47%) sepia(23%) saturate(2504%) hue-rotate(132deg)
        brightness(95%) contrast(101%);
    }
  }
  .bg-t {
    margin-top: -100px;
    padding-top: 100px;
    padding-bottom: 15rem;
    background-image: url('/static/images/texture.png');
    /* background-repeat: no-repeat; */
    background-size: 100%;
  }
  .bg-b {
    background: #0d2c45;
    background-image: url('/static/images/texture.png');
    background-size: 100%;
    /* margin-top: min(100px,2vw); */
    /* padding-bottom: 400px; */
  }

  .logo {
    position: absolute;
    top: 10px;
    left: 0px;
  }

  .bg-texture {
    width: 100vw;
    /* min-height: 900px; */
    margin-top: -415px;
    padding-top: calc(60px + 0.1 * 100vw);
    background-image: url('/static/images/bg-texture.png'),
      url('/static/images/texture-bottom.png');
    background-repeat: no-repeat;
    background-size: 100%, 100%;
    background-position: top, 0% 12%;
    /* background-image: url('/static/images/bg-texture.png'); */
    /* url('/static/images/texture.png'); */
    /* background-repeat: no-repeat, no-repeat; */
    /* background-position: 0 0, bottom;  */
    /* background-size: cover; */
    /* background-size: 100%, 40%; */
  }

  .nav-box {
    white-space: nowrap;
    position: absolute;
    bottom: 0vw;
    left: 50%;
    width: 80%;
    justify-content: center;
    align-items: center;
    display: flex;
    transform: translateX(-50%);
    z-index: 999;
    span {
      margin-left: 20px !important;
      cursor: pointer;
      filter: grayscale(100%) brightness(200%);
      &:hover {
        filter: invert(47%) sepia(23%) saturate(2504%) hue-rotate(132deg)
          brightness(95%) contrast(101%);
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
    .wl-xyz {
      /* rio 2.6 */
      width: 42px;
      height: 16px;
    }
    & > * + * {
      margin-left: 10px;
    }
    @media (min-width: 700px) {
      .nav-item {
        width: 52px;
        height: 52px;
      }
      .wl-xyz {
        width: 52px;
        height: 20px;
      }
    }

    @media (min-width: 1250px) {
      .nav-item {
        width: 62px;
        height: 62px;
      }
      .wl-xyz {
        width: 72px;
        height: 27px;
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
      .wl-xyz {
        width: 72px;
        height: 27px;
      }
      & > * + * {
        margin-left: 20px;
      }
    }
  }

  .isBottom {
    position: relative;
    margin: 100px auto 200px auto;
    left: auto;
    bottom: auto;
    transform: none;
  }

  .cloud {
    /* opacity: 0.4; */
    margin-top: calc(99vh - (0.1 * 100vw));
    z-index: 99;

    /* margin-top: calc(85vh + (0.01 * 100vw)); */
    /* margin-top: calc(500px - (0.01 * 100vw)); */
    /* margin-top: 550px; */

    /* width: 120%;
    margin-left: -10vw;
    height: 170.5px;

    position: relative;
    padding-top: 115vw;
    z-index: 1; */
  }

  .middle-bg {
    margin-top: -6vw;
    /* margin-top: calc(-6vw + (0.1 * 100vw)); */
    padding-top: 100px;
    width: 100%;
    height: 600px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
      url('/static/images/middle-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .title-gif {
    width: 100%;
    /* width: 100%; */
    height: 100px;
    margin-top: -35px;
    transform: scale(2);
    position: relative;
    @media (min-width: 700px) {
      margin-top: -15px;
      transform: scale(2.5);
    }
    @media (min-width: 800px) {
      margin-top: 0px;
      transform: scale(3);
    }
    @media (min-width: 1000px) {
      margin-top: 0px;
      transform: scale(4);
    }
    @media (min-width: 1200px) {
      margin-top: 10px;
      transform: scale(4.5);
    }
    /* margin-top: calc(0.1 * 100vw); */
  }

  .big-title {
    width: 80%;
    height: 100px;
    margin: 0 auto;
    position: relative;
    margin-top: calc(2vw);
  }

  .flag {
    width: 80%;
    height: 309px;
    margin: 0 auto;
    margin-top: -60vw;
    position: relative;
    @media (min-width: 700px) {
      margin-top: -40vw;
    }
  }

  .home {
    position: relative;
    margin-top: 12vw;
    margin-bottom: calc(20px + 4vw);
    /* padding-top: 20px; */
    height: 40px;
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
    @media (min-width: 1200px) {
      transform: scale(1.2);
    }
    @media (min-width: 1400px) {
      transform: scale(1.3);
    }
  }

  .text {
    width: 80%;
    /* width: 90%; */
    max-width: 1400px;
    color: white;
    /* font-size: 1rem; */
    font-size: 1.2rem;
    padding-bottom: 80px;
    margin: 0 auto;
  }

  .title {
    font-size: 1.4rem;
    font-weight: bolder;
    padding-bottom: calc(15px + 0.4vw);
  }

  .contract-wrapper {
    position: relative;
    width: 80%;
    margin: 0 auto;
    margin-top: 50px;
    max-width: 1400px;
    font-size: 1rem;
    z-index: 2;
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
    margin-top: calc(3.125rem + 2.2vw);
    /* margin-top: 50px; */
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

  .avatar-loop-box {
    position: absolute;
    top: 0px;
    object-fit: cover;
    /* top: calc(-0px + -0.1 * 100vw); */
    width: 100%;
    height: 100%;
    z-index: 1;
    /* height: 400px;
    position: relative;
    margin: 20vw auto; */
  }

  .avatar-loop {
    /* object-fit: cover; */
    width: 100%;
    /* width: calc(100vw + 150px); */
    /* position: absolute;
    top: calc(-0px + -0.1 * 100vw);
    width: 100%;
    height: 100%;
    z-index: 1;
    transform: scale(1.2); */

    /* height: 400px; */
    /* top: -10vw; */
    /* @media (min-width: 800px) {
      height: 500px;
    } */
  }

  .avatar-loop-front {
    z-index: 2;
    /* width: calc(100vw + 150px);
    height: 400px;
    right: -86vw;
    transform: translateX(-50%);
    position: absolute;
    @media (min-width: 800px) {
      right: -87vw;
      top: -12vw;
      height: 600px;
    } */
  }

  .about-wrapper {
    position: relative;
    /* padding-top: 100px; */
  }

  .about-box {
    width: 80%;
    max-width: 1400px;
    height: calc(60vw);
    max-height: 800px;

    /* height: calc(450px + 4vw); */
    margin: 0 auto;
    margin-top: 0px;

    position: relative;
    .about-text {
      margin-top: 10px;
      font-size: 1.2rem;
      text-shadow: 4px 8px 25px rgba(13, 44, 69, 0.6);
    }
    .left-box {
      position: absolute;
      top: 2vw;
      /* top: clamp(0px, 0vw, 30%); */
      /* top: calc(0 + 3vw); */
      /* top: calc(150px - 13vw);; */
      /* top: 80px; */
      left: calc(0px + 1vw);
      width: calc(250px + 20vw);
      /* width: calc(300px + 8vw); */
      z-index: 2;
      @media (min-width: 600px) {
        top: 8vw;
      }
      .about {
        width: 130px;
        max-width: 19rem;
      }
    }
    .about-avatar-box {
      position: absolute;
      right: calc(0px + 1vw);
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      .about-avatar {
        /* width: 80%; */
        /* width: 60vw; */
        width: clamp(305px, 50vw, 800px);
        max-width: 800px;
        /* width: 300px; */
        /* height: 550px; */
        position: relative;
      }
    }
  }

  .top {
    margin-top: calc(200px - 10.14vw);
    height: auto;
    .left-box {
      position: relative;
      /* top: 150px; */
    }
  }

  .roadmap {
    width: 180px;
    margin: 200px auto 50px;
    z-index: 1;
  }

  .map-wrapper {
    background: #071726;
    position: relative;
  }
  .image-container {
    .map {
      z-index: 2;
      width: 90% !important;
      min-width: 90% !important;
      max-width: 1400px !important;
      margin: 20px auto 200px auto;
    }
  }
  .map-text {
    position: absolute;
    color: #ff9d69;
    z-index: 2;
    white-space: pre-wrap;
    font-size: 1rem;
  }

  .map-text-1 {
    position: absolute;
    left: max(9vw, 80px);
    bottom: calc(16vw - 30px);
    transform: translateX(-50%);
  }

  .map-text-2 {
    position: absolute;
    left: 30vw;
    bottom: calc(-5vw - 10px);

    transform: translateX(-50%);
  }

  .map-text-3 {
    position: absolute;
    left: 60vw;
    /* bottom: min(30vw,180px); */
    bottom: calc(25vw - 50px);
    transform: translateX(-50%);
  }

  .map-text-4 {
    position: absolute;
    right: max(-12vw, -50px);
    bottom: calc(5vw - 30px);
    transform: translateX(-50%);
  }

  .team {
    margin: 200px auto 50px;
  }

  .black-cloud {
    position: absolute;
    top: -44vw;
    /* top: calc(-200px + -0.2 * 100vw); */
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .black-cloud-1 {
    top: -44vw;
    /* top: calc(-200px - 0.1 * 100vw); */
  }

  .map-bg {
    width: 100%;
    height: 900px;
    /* object-fit: contain; */
    /* opacity: 0.4; */
    background-image: url('/static/images/black-cloud-2.png');
    /* background-image: url('/static/images/middle-bg.png'); */
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .profile-wrapper {
    /* width: 90%; */
    max-width: 1400px;
    width: 90vw;
    margin: 50px auto 0 auto;
    position: relative;
    /* padding: 0 20px; */

    .profile-item {
      max-width: 30%;
      flex-grow: 1;
      /* width: 33%; */
      /* width: 44vmin; */

      /* width: 142px; */
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .row {
      display: flex;
      margin-top: 2rem;
      justify-content: center;
      align-items: flex-start;
      & > * + * {
        margin-left: 1.9rem;
      }
    }
    .profile {
      /* width: 44vmin;
      height: 44vmin; */
      width: 100%;
      height: min(1400px * 0.3, 90vw * 0.3);
      /* min-height: 200px; */
      /* min-width: 200px; */
      /* height: 100%; */
      /* max-width: 200px;
      max-height: 200px; */
      /* width: 142px;
      height: 142px; */
      position: relative;
    }

    /* @media (min-width: 800px) {
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
    @media (min-width: 600px) and (max-width: 900px) {
      .profile-item {
        width: 22vmin;
      }
      .profile {
        width: 22vmin;
        height: 22vmin;
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
    } */
    .name {
      font-size: 1.56rem;
      font-family: Futura;
      font-weight: bold;
      color: #ffffff;
      line-height: 65px;
      white-space: nowrap;
    }
    .position {
      /* height: 45px; */
      font-size: 0.7rem;

      text-align: center;
      overflow: hidden;
    }
  }

  .wl {
    /* width: 800px !important; */
    .position {
      width: 90vw;
      max-width: 500px;
    }
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
    max-width: 1400px;
    margin: 20px auto 0 auto;
    .faq-item {
      margin-bottom: 40px;
      .ques {
        font-weight: bolder;
        margin-bottom: 10px;
        font-size: 1.3rem;
      }
    }
  }
`;
