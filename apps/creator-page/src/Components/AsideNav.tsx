import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import TextPng from './imgs/text.png';
import SettingPng from './imgs/setting.png';
import UpSvg from './imgs/up.svg';
import { ProjectDetail } from '../redux/projectSlice';
import { useState } from 'react';

export default function AsideNav({ project }: { project: ProjectDetail }) {
  const [showTasks, setShowTasks] = useState(true);
  const [showSetting, setShowSetting] = useState(true);
  const { slug, image, name, tasks } = project;
  return (
    <AsideBox>
      <NavLink
        className={({ isActive }) =>
          isActive ? 'project-item active' : 'project-item'
        }
        to={`/project/${slug}/detail`}
      >
        <div className="project">
          <img src={image} alt="" />
          <span>{name}</span>
        </div>
      </NavLink>
      <div className="events">
        <div
          className="sec-title"
          onClick={() => {
            setShowTasks(!showTasks);
          }}
        >
          <img src={TextPng} alt="" />
          <span>Events</span>
          <img src={UpSvg} alt="" className={showTasks ? '' : 'trans'} />
        </div>
        {showTasks && (
          <>
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
            {[...tasks]
              .sort((a, b) => {
                return a.endTime - b.endTime;
              })
              .map((item) => {
                const { startTime, endTime } = item;
                const dateNow = Date.now();
                let statusClass = '';
                if (startTime > dateNow) {
                  statusClass = 'future';
                } else if (endTime < dateNow) {
                  statusClass = 'closed';
                } else {
                  statusClass = 'live';
                }
                return (
                  <div key={item.id} className="nav">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? 'link-item active' : 'link-item'
                      }
                      to={`/project/${slug}/task/${item.id}`}
                    >
                      <span className={`dot ${statusClass}`}></span>
                      {item.name}
                    </NavLink>
                  </div>
                );
              })}
          </>
        )}
      </div>
      <div className="settings">
        <div className="sec-title" onClick={() => setShowSetting(!showSetting)}>
          <img src={SettingPng} alt="" />
          <span>Settings</span>
          <img src={UpSvg} alt="" className={showSetting ? '' : 'trans'} />
        </div>
        {showSetting && (
          <div className="nav">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'link-item active' : 'link-item'
              }
              to={`/project/${slug}/account`}
            >
              Account
            </NavLink>
          </div>
        )}
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
  padding: 10px;
  box-sizing: border-box;
  padding-bottom: 30px;

  & > div {
    margin-top: 10px;
  }
  & .project,
  & .sec-title {
    padding: 10px;
    display: flex;
    align-items: center;
  }
  & .project-item {
    &.active {
      & .project {
        background: #333333;
        border-radius: 10px;
        & span {
          color: #fff;
        }
      }
    }
  }
  & .sec-title {
    cursor: pointer;
    & img {
      background: inherit;
      &.trans {
        transform: rotate(180deg);
      }
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
    margin-top: 10px;
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
      /* overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; */
      &.active {
        color: #fff;
        background: #333333;
      }
      & .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #c4c4c4;

        &.live {
          background-color: #3dd606;
        }

        &.closed {
          background-color: red;
        }

        &.future {
          background-color: #ebb700;
        }
      }
    }
  }

  & a {
    text-decoration: none;
  }
`;
