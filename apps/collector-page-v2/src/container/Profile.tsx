/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 15:18:30
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import Info from '../components/info';
import DailyDigest from '../components/info/DailyDigest';
import Credential from '../components/profile/Credential';
import OnChainInterest from '../components/profile/OnChainInterest';
import OffChainInterest from '../components/profile/OffChainInterest';
import { fetchU3Profile } from '../services/api/profile';
import { ProfileEntity, ProfileResponse } from '../services/types/profile';

function Profile() {
  const { user } = useWlUserReact();
  const [tab, setTab] = useState<'Credential' | 'OnChain' | 'OffChain'>(
    'Credential'
  );
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  const fetchData = useCallback(async () => {
    const { data } = await fetchU3Profile(user.token);
    setProfileData(data.data);
    setLoading(false);
  }, [user.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <ProfileWrapper>
      <div className="infos">
        <Info
          {...{
            nickname: user.name,
            avatar: user.avatar,
            walletAddr:
              user.accounts[0]?.thirdpartyName ||
              user.accounts[0]?.thirdpartyId,
          }}
        />
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

        {tab === 'Credential' && (
          <Credential
            {...{
              poap: profileData.poap,
              noox: profileData.noox,
              galxe: profileData.galxe,
            }}
          />
        )}
        {tab === 'OnChain' && (
          <OnChainInterest
            data={profileData.nfts}
            wallet={profileData.erc20Balances}
            ethBalance={profileData.ethBalance}
          />
        )}
        {tab === 'OffChain' && <OffChainInterest />}
      </div>
    </ProfileWrapper>
  );
}
export default Profile;
const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
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
