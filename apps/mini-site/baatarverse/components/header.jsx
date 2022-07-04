import { useState } from 'react';
import Router from 'next/router';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Wrapper>
      {isExpanded ? (
        <CloseIcon onClick={() => setIsExpanded(false)} data-tip="close" />
      ) : (
        <MoreIcon
          onClick={() => {
            setIsExpanded(true);
            console.log('----------------------');
          }}
          data-tip="more"
        />
      )}
      {isExpanded ? (
        <>
          <AboutIcon
            data-tip="about"
            onClick={() => {
              Router.push('/about');
            }}
          />
          <RoadmapIcon
            data-tip="roadmap"
            onClick={() => {
              Router.push('/roadmap');
            }}
          />
          <StoryIcon
            data-tip="story"
            onClick={() => {
              Router.push('/story');
            }}
          />
          <TeamIcon
            data-tip="team"
            onClick={() => {
              Router.push('/team');
            }}
          />
          <FAQIcon
            data-tip="FAQ"
            onClick={() => {
              Router.push('/faq');
            }}
          />
          <ReactTooltip place="bottom" />
        </>
      ) : null}
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.header`
  position: absolute;
  right: 30px;
  top: 30px;
  z-index: 1;
  color: #561c30;
  font-size: 12px;
  display: flex;
  align-items: center;
  & > * {
    margin-right: 14px;
    cursor: pointer;
  }
  svg {
    color: white;
  }
`;

const MoreIcon = (props) => (
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
      d="M2 8a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H3Z"
    ></path>
  </svg>
);

const AboutIcon = (props) => (
  <svg
    t="1656745583639"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2309"
    width="17"
    height="17"
    {...props}
  >
    <path
      d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m62.464 774.144c0 27.648-22.528 50.176-50.176 50.176h-25.088c-27.648 0-50.176-22.528-50.176-50.176V474.624c0-27.648 22.528-50.176 50.176-50.176h25.088c27.648 0 50.176 22.528 50.176 50.176v299.52zM512 349.696c-34.304 0-62.464-28.16-62.464-62.464 0-34.304 28.16-62.464 62.464-62.464s62.464 28.16 62.464 62.464c0 34.304-28.16 62.464-62.464 62.464z"
      p-id="2310"
      fill="#ffffff"
    ></path>
  </svg>
);

const RoadmapIcon = (props) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   aria-hidden="true"
  //   role="img"
  //   width="20"
  //   height="20"
  //   preserveAspectRatio="xMidYMid meet"
  //   viewBox="0 0 32 32"
  // >
  //   <path
  //     fill="currentColor"
  //     d="M12 30H4a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h8a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zm-8-6v4h8v-4zm24-4H12a2.002 2.002 0 0 1-2-2v-4a2.002 2.002 0 0 1 2-2h16a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zm-16-6v4h16v-4zm4-4H4a2.002 2.002 0 0 1-2-2V4a2.002 2.002 0 0 1 2-2h12a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2zM4 4v4h12V4z"
  //   ></path>
  // </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="20"
    height="20"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="currentColor"
      d="M23.188 3.735a1.766 1.766 0 0 0-3.532-.001c0 .975 1.766 4.267 1.766 4.267s1.766-3.292 1.766-4.267zm-2.61 0a.844.844 0 1 1 1.687-.001a.844.844 0 0 1-1.687.001zm4.703 14.76c-.56 0-1.097.047-1.59.123L11.1 13.976c.2-.18.312-.38.312-.59a.663.663 0 0 0-.088-.315l8.41-2.238c.46.137 1.023.22 1.646.22c1.52 0 2.75-.484 2.75-1.082c0-.6-1.23-1.083-2.75-1.083s-2.75.485-2.75 1.083c0 .07.02.137.054.202L9.896 12.2a8.075 8.075 0 0 0-2.265-.303c-2.087 0-3.78.667-3.78 1.49s1.693 1.49 3.78 1.49c.574 0 1.11-.055 1.598-.145l11.99 4.866c-.19.192-.306.4-.306.623c0 .19.096.364.236.533L8.695 25.415c-.158-.005-.316-.01-.477-.01c-3.24 0-5.87 1.036-5.87 2.31c0 1.277 2.63 2.313 5.87 2.313s5.87-1.034 5.87-2.312c0-.22-.083-.432-.23-.633l10.266-5.214c.37.04.753.065 1.155.065c2.413 0 4.37-.77 4.37-1.723c0-.944-1.957-1.716-4.37-1.716z"
    ></path>
  </svg>
);

const StoryIcon = (props) => (
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
      d="M2 21V6h6V2h8v4h6v6.275q-.875-.625-1.9-.95Q19.075 11 18 11q-2.9 0-4.95 2.05Q11 15.1 11 18q0 .775.163 1.538q.162.762.512 1.462Zm8-15h4V4h-4Zm8 17q-2.075 0-3.537-1.462Q13 20.075 13 18q0-2.075 1.463-3.538Q15.925 13 18 13t3.538 1.462Q23 15.925 23 18q0 2.075-1.462 3.538Q20.075 23 18 23Zm1.65-2.65l.7-.7l-1.85-1.85V15h-1v3.2Z"
    ></path>
  </svg>
);

const TeamIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8 2.002a1.998 1.998 0 1 0 0 3.996a1.998 1.998 0 0 0 0-3.996ZM12.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3Zm-9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3ZM5 7.993A1 1 0 0 1 6 7h4a1 1 0 0 1 1 1v3a3.02 3.02 0 0 1-.146.927A3.001 3.001 0 0 1 5 11V7.993ZM4 8c0-.365.097-.706.268-1H2a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 0 3.436 2.319A3.983 3.983 0 0 1 4 10.999V8Zm8 0v3c0 .655-.157 1.273-.436 1.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1Z"
    ></path>
  </svg>
);

const FAQIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="20"
    height="20"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 26 26"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13 0c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3h6l4 4v-4c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3H13zm4.188 3h1.718l1.688 6h-1.5l-.407-1.5h-1.5L16.813 9H15.5l1.688-6zM18 4c-.1.4-.212.888-.313 1.188l-.28 1.312h1.187l-.282-1.313C18.113 4.888 18 4.4 18 4zM3 10c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3v4l4-4h6c1.7 0 3-1.3 3-3v-6h-3c-1.9 0-3.406-1.3-3.906-3H3zm4.594 2.906c1.7 0 2.5 1.4 2.5 3c0 1.4-.481 2.288-1.281 2.688c.4.2.874.306 1.374.406l-.374 1c-.7-.2-1.426-.512-2.126-.813c-.1-.1-.275-.093-.375-.093C6.112 18.994 5 18 5 16c0-1.7.994-3.094 2.594-3.094zm0 1.094c-.8 0-1.188.9-1.188 2c0 1.2.388 2 1.188 2c.8 0 1.218-.9 1.218-2s-.418-2-1.218-2z"
    ></path>
  </svg>
);

const CloseIcon = (props) => (
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
      d="m12 13.4l-4.9 4.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275Z"
    ></path>
  </svg>
);
