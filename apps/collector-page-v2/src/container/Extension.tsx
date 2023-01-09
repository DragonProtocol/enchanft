// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styled from 'styled-components';

import ContentCreateExtension from './ContentCreateExtension';

import LogoImg from '../components/imgs/logo-icon.svg';
import { Add } from '../components/icons/add';

const website = 'https://u3.xyz';

function Extension({
  onClose,
  token,
}: {
  onClose: () => void;
  token?: string;
}) {
  return (
    <ExtensionWrapper>
      <i className="close" onClick={() => onClose()}>
        <Add />
      </i>

      {token ? (
        <>
          <a href={`${website}`} target="__blank">
            <img className="u3-logo" src={LogoImg} alt="u3.xyz" />
          </a>
          <ContentCreateExtension token={token} />
        </>
      ) : (
        <div className="welcome">
          <div className="logo">
            <img src={LogoImg} alt="u3.xyz" />
          </div>
          <div className="title">Welcome to U3</div>
          <a
            href={`${website}/contents/create?url=${window?.location?.href}`}
            target="__blank"
          >
            <div className="btn">START</div>
          </a>
          <div className="tip">
            {`You'll be redirected to U3 to sign up / connect`}
          </div>
        </div>
      )}
    </ExtensionWrapper>
  );
}
export default Extension;

const ExtensionWrapper = styled.div`
  width: 400px;
  height: 100%;
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 99999;
  font-family: Rubik;
  color: rgb(113, 128, 150);

  background: rgb(20, 23, 26);
  box-shadow: rgba(0, 0, 0, 0.62) 0px 0px 5px;

  .close {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    transform: rotate(45deg);
  }

  .u3-logo {
    position: fixed;
    top: 13px;
    right: 340px;
    cursor: pointer;
  }

  .welcome {
    padding-top: 280px;
    margin: 0 auto;
    /* height: 982px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-weight: 600;
      font-size: 40px;
      line-height: 125%;
      text-align: center;
      letter-spacing: 0.02em;
      white-space: nowrap;
      color: white;
    }

    .logo {
      width: 168px;
      height: 168px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 108px;
        height: 108px;
      }
    }

    .btn {
      margin-top: 20px;
      width: 300px;
      font-size: 25px;
      font-weight: bolder;
      padding: 10px;
      border: 1px solid rgb(57, 66, 76);
      border-radius: 12px;
      line-height: 40px;
      height: 40px;
      color: rgb(113, 128, 150);
      letter-spacing: 0.0892857143em;
      text-align: center;
      box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
        0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    .tip {
      font-size: 12px;
      margin-top: 1rem;
    }
    a {
      text-decoration: none;
      flex: 1;
    }
  }
`;
