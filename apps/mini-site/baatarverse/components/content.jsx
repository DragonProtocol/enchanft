import { useState } from 'react';

import styled from 'styled-components';

export function Content({ title, content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Warpper>
      <header>{title}</header>
      <content dangerouslySetInnerHTML={{ __html: content }} />
    </Warpper>
  );
}

export default Content;

const Warpper = styled.div`
  background: url('/static/images/background.jpg');
  width: 100vw;
  min-height: 100vh;
  color: white;
  text-align: center;
  word-break: break-all;
  padding-bottom: 50px;
  header {
    border-bottom: 1px solid white;
    padding: 20px;
    font-family: 'Avenir';
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 33px;
    /* color: #111c9f;
    margin-bottom: 12px; */
    margin-bottom: 30px;
  }
  content {
    /* color: #6a6a6a; */
    letter-spacing: 0.69px;
    font-size: 18px;
    font-weight: 350;
    max-width: 800px;
    margin: 0 auto;
    display: block;
    white-space: pre-wrap;
    text-align: left;
    .question {
      font-family: 'Avenir';
      font-style: normal;
      font-weight: 900;
      font-size: 24px;
      line-height: 33px;
      /* color: #111c9f; */
      margin-bottom: 12px;
    }
  }
`;
