import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';

import TextPng from './imgs/text.png';
import SettingPng from './imgs/setting.png';
import UpSvg from './imgs/up.svg';

export default function AsideNav() {
  const { phantomValid, metaMaskValid } = useAppConfig();
  const navigation = useNavigate();
  const { slug } = useParams();

  return (
    <AsideBox>
      <div className="project">
        <img
          src="https://ihsjifyh373rbw4xqsbf4u5gcj6rhojof47a25npn7cez47o7z4q.arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
          alt=""
        />
        <span>One Piece</span>
      </div>
      <div className="events">
        <div className="sec-title">
          <img src={TextPng} alt="" />
          <span>Events</span>
          <img src={UpSvg} alt="" />
        </div>
        <div className="nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'link-item active' : 'link-item'
            }
            to={`/project/${slug}/task/new`}
          >
            New Task
          </NavLink>
        </div>
      </div>
      <div className="settings">
        <div className="sec-title">
          <img src={SettingPng} alt="" />
          <span>Settings</span>
          <img src={UpSvg} alt="" />
        </div>
        <div className="nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'link-item active' : 'link-item'
            }
            to={`/account`}
          >
            Account
          </NavLink>
        </div>
      </div>
      {/* {(phantomValid && <button>Connect Phantom</button>) || (
        <button>installPhantom</button>
      )}
      {(metaMaskValid && <button>Connect MetaMask</button>) || (
        <button>installMetaMask</button>
      )} */}
    </AsideBox>
  );
}

const AsideBox = styled.aside`
  width: 200px;
  background: #f7f9f1;
  padding: 0 10px;
  box-sizing: border-box;

  & > div {
    margin-top: 10px;
  }
  & .project,
  & .sec-title {
    padding: 10px;
    display: flex;
    align-items: center;
  }
  & .sec-title {
    cursor: pointer;
    & img {
      background: inherit;
    }
  }

  & img {
    width: 18px;
    height: 18px;
    background: #d9d9d9;
    border-radius: 4px;
    margin-right: 10px;
  }
  & span {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    flex-grow: 1;
  }

  & .nav {
    display: flex;

    & .link-item {
      flex-grow: 1;
      width: 100%;
      text-align: start;

      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      color: #333333;
      padding: 10px;
      padding-left: 38px;
      border-radius: 10px;
      &.active {
        color: #fff;
        background: #333333;
      }
    }
  }

  & a {
    text-decoration: none;
  }
`;
