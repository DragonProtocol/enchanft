import { useState } from 'react';
import Image from 'next/image';

import styled from 'styled-components';

export function Content({ title, content, renderContent }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Warpper>
      <header>{title}</header>
      <content>
        <div className="img-box">
          <Image
            src={'/static/images/basic.jpg'}
            width={900}
            height={364}
            layout="responsive"
            objectFit="cover"
            alt={'basic'}
          />
        </div>
        {renderContent ? (
          renderContent()
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </content>
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
  padding-bottom: 30px;
  white-space: pre-wrap;
  header {
    /* border-bottom: 1px solid white; */
    padding: 20px;
    font-family: 'Avenir';
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 33px;
    /* color: #111c9f;
    margin-bottom: 12px; */
    margin-bottom: 10px;
  }
  content {
    /* color: #6a6a6a; */
    letter-spacing: 0.69px;
    font-size: 18px;
    font-weight: 350;
    max-width: 900px;
    margin: 0 auto;
    display: block;
    white-space: pre-wrap;
    text-align: left;
    .img-box {
      margin-bottom: 30px;
    }
    .flex {
      display: flex;
      & > div{
        white-space: pre-wrap;
        width: 50%;
      }
      &> div:last-child {
        margin-left: 60px;
      }
    }
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
