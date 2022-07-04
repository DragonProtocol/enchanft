import { useState } from 'react';

import styled from 'styled-components';

import Header from '../components/header';

export function Index() {
  const [isMute, setIsMute] = useState(false);

  return (
    <>
      <StyledVideo
        x5-video-player-type="h5"
        x-webkit-airplay="true"
        webkit-playsinline="true"
        loop
        autoPlay
        muted={isMute}
      >
        <source
          src={require('../public/static/preview.mp4')}
          type="video/mp4"
        />
      </StyledVideo>
      <Header />
      <StyledBottomRow>
        {/* <PauseIcon /> */}
        {isMute ? (
          <MuteIcon
            onClick={() => {
              setIsMute(false);
              console.log('------');
            }}
          />
        ) : (
          <VolIcon
            onClick={() => {
              setIsMute(true);
              console.log('------');
            }}
          />
        )}
        <div className="links">
          <TwitterIcon />
          <DiscordIcon />
        </div>
        <div className="copyright">
          ©{' '}
          <a
            href="https://septime.net/en/agency/about"
            data-item="agency/intro"
            title="Septime Création"
          >
            Baatarverse
          </a>{' '}
          2022{' '}
        </div>
        {/* <div className="languages">
          <span className="cur-lang">EN</span>
          <span>ZH</span>
        </div> */}
      </StyledBottomRow>
    </>
  );
}

export default Index;

const StyledVideo = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  opacity: 0.9;
`;

const StyledBottomRow = styled.div`
  position: absolute;
  left: 30px;
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
