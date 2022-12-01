/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 15:18:30
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import Info from '../components/info';
import DailyDigest from '../components/info/DailyDigest';
import Credential from '../components/profile/Credential';
import OnChainInterest from '../components/profile/OnChainInterest';
import OffChainInterest from '../components/profile/OffChainInterest';

function Profile() {
  const [tab, setTab] = useState<'Credential' | 'OnChain' | 'OffChain'>(
    'Credential'
  );
  return (
    <ProfileWrapper>
      <div className="infos">
        <Info />
        <DailyDigest />
      </div>

      <div className="content">
        <div className="tab">
          <div
            onClick={() => setTab('Credential')}
            className={tab === 'Credential' ? 'active' : ''}
          >
            Credential Data
          </div>
          <div
            onClick={() => setTab('OnChain')}
            className={tab === 'OnChain' ? 'active' : ''}
          >
            On-Chain Interest
          </div>
          <div
            onClick={() => setTab('OffChain')}
            className={tab === 'OffChain' ? 'active' : ''}
          >
            Off-Chain Interest
            <span>soon</span>
          </div>
        </div>

        {tab === 'Credential' && <Credential />}
        {tab === 'OnChain' && <OnChainInterest />}
        {tab === 'OffChain' && <OffChainInterest />}
      </div>
    </ProfileWrapper>
  );
}
export default Profile;
const ProfileWrapper = styled.div`
  width: 100%;
  .infos {
    display: flex;
    gap: 30px;
  }

  .content {
    margin-top: 20px;
    .tab {
      margin-bottom: 20px;
      width: 700px;
      display: grid;
      grid-template-columns: repeat(3, minmax(10px, 1fr));
      background-color: darkgray;
      color: white;
      > div {
        cursor: pointer;
        text-align: center;
        display: inline-block;
        position: relative;
        > span {
          position: absolute;
          right: 0px;
          top: 0px;
          background-color: lightgray;
          font-size: 13px;
        }
        &.active {
          background-color: gray;
        }
      }
    }
  }
`;
