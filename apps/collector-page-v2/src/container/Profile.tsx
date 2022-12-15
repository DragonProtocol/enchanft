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
import { toast } from 'react-toastify';
import Info from '../components/info';
import DailyDigest from '../components/info/DailyDigest';
import Credential from '../components/profile/Credential';
import OnChainInterest from '../components/profile/OnChainInterest';
import OffChainInterest from '../components/profile/OffChainInterest';
import { fetchU3Profile } from '../services/api/profile';
import { ProfileEntity } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';

function Profile() {
  const { user } = useWlUserReact();
  const [tab, setTab] = useState<'Credential' | 'OnChain' | 'OffChain'>(
    'Credential'
  );
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await fetchU3Profile(user.token);
      setProfileData(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <ProfileWrapper>
        <div className="loading">
          <Loading />
        </div>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <div>
        <div className="infos">
          <Info
            {...{
              date: (user as any).createdAt,
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
              <span>Soon</span>
            </div>
          </div>

          {tab === 'Credential' && profileData && (
            <Credential
              {...{
                poap: profileData.poap,
                noox: profileData.noox,
                galxe: profileData.galxe,
              }}
            />
          )}
          {tab === 'OnChain' && profileData && (
            <OnChainInterest
              data={profileData.nfts}
              wallet={profileData.erc20Balances}
              ethBalance={profileData.ethBalance}
            />
          )}
          {tab === 'OffChain' && <OffChainInterest />}
        </div>
      </div>
    </ProfileWrapper>
  );
}
export default Profile;
const ProfileWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  > div.loading {
    display: flex;
    justify-content: center;
  }
  > div {
    margin: 0 auto;
    width: 1160px;
    padding-top: 40px;

    .infos {
      display: flex;
      gap: 40px;
    }

    .content {
      margin-top: 50px;
      .tab {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;
        gap: 40px;

        width: 1160px;
        height: 72px;

        border-bottom: 1px solid #39424c;
        color: white;

        > div {
          cursor: pointer;
          align-items: center;
          display: flex;
          position: relative;
          height: inherit;
          font-weight: 700;
          font-size: 18px;
          line-height: 21px;
          color: #ffffff;
          > span {
            margin-left: 3px;
            padding: 3px;
            background: #718096;
            border-radius: 4px;
            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            color: #14171a;
          }
          &.active {
            &::after {
              content: ' ';
              height: 3px;
              position: absolute;
              width: 100%;
              background: #ffffff;
              border-radius: 100px 100px 0px 0px;
              bottom: 0;
            }
          }
        }
      }
    }
  }
`;
