/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 15:18:30
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Info from '../components/info';
import DailyDigest from '../components/info/DailyDigest';
import Credential from '../components/profile/Credential';
import OnChainInterest, {
  OnChainNoItem,
} from '../components/profile/OnChainInterest';
import OffChainInterest from '../components/profile/OffChainInterest';
import {
  addOrDelWallet,
  fetchU3Profiles,
  fetchU3ProfileWithWallet,
  fetchU3Wallets,
  getPreference,
  ProfileDefault,
} from '../services/api/profile';
import { ProfileEntity, ProfileWallet } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/mergeProfilesData';
import useConfigsTopics from '../hooks/useConfigsTopics';
import OnBoard from '../components/onboard';

function Profile() {
  const { wallet } = useParams();
  const { user } = useWlUserReact();
  const [tab, setTab] = useState<'Credential' | 'OnChain' | 'OffChain'>(
    'Credential'
  );
  const { topics } = useConfigsTopics();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();
  const [wallets, setWallets] = useState<ProfileWallet[]>([]);
  const [preference, setPreference] = useState<{ [key: string]: any }>({});

  const fetchData = useCallback(async () => {
    try {
      const { data } = await fetchU3Profiles(user.token);
      const r = mergeProfilesData(data.data);
      setProfileData(r);
      // setProfileData(data.data);
    } catch (error) {
      setProfileData(ProfileDefault);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const fetchPreference = useCallback(async () => {
    try {
      const { data } = await getPreference(user.token);
      setPreference(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const fetchWallets = useCallback(async () => {
    try {
      const { data } = await fetchU3Wallets(user.token);
      setWallets(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  }, [user.token]);

  const fetchDataWithWallet = useCallback(async () => {
    try {
      const { data } = await fetchU3ProfileWithWallet(wallet);
      setProfileData(data.data);
    } catch (error) {
      setProfileData(ProfileDefault);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  const addOrRemoveWallet = useCallback(
    async (addr: string, add: boolean) => {
      try {
        await addOrDelWallet(addr, add, user.token);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [user.token]
  );

  const addWallet = useCallback(
    async (addr: string) => {
      await addOrRemoveWallet(addr, true);
      await fetchWallets();
      return true;
    },
    [user.token]
  );
  const delWallet = useCallback(
    async (addr: string) => {
      await addOrRemoveWallet(addr, false);
      await fetchWallets();
    },
    [user.token]
  );

  useEffect(() => {
    if (wallet) {
      fetchDataWithWallet();
    } else {
      fetchData();
    }
    fetchPreference();
    fetchWallets();
  }, [fetchData, fetchPreference, fetchDataWithWallet, wallet]);

  const lists = useMemo(() => {
    const { contentTypes, eventRewards, eventTypes, projectTypes } = topics;
    const listData: Array<{
      type: string;
      value: string;
      name: string;
    }> = [];

    return listData
      .concat(
        contentTypes.map((item) => ({
          type: 'contentTypes',
          ...item,
        }))
      )
      .concat(
        eventRewards.map((item) => ({
          type: 'eventRewards',
          ...item,
        }))
      )
      .concat(
        eventTypes.map((item) => ({
          type: 'eventTypes',
          ...item,
        }))
      )
      .concat(
        projectTypes.map((item) => ({
          type: 'projectTypes',
          ...item,
        }))
      );
  }, [topics]);

  if (Object.keys(preference).length === 0) {
    return (
      <OnBoard
        lists={lists}
        finishAction={(data) => {
          console.log('finishAction', data);
          // TODO submit
        }}
      />
    );
  }

  return (
    <ProfileWrapper id="profile-wrapper">
      <div>
        {!wallet && user && (
          <div className="infos">
            <Info
              {...{
                date: (user as any).createdAt,
                nickname: user.name,
                avatar: user.avatar,
                wallets,
                walletAddr:
                  user.accounts[0]?.thirdpartyName ||
                  user.accounts[0]?.thirdpartyId,
              }}
              addWallet={addWallet}
              delWallet={delWallet}
            />
            <DailyDigest />
          </div>
        )}

        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) || (
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
            {tab === 'OnChain' &&
              ((profileData.nfts.total && (
                <OnChainInterest
                  data={profileData.nfts}
                  wallet={profileData.erc20Balances}
                  ethBalance={profileData.ethBalance}
                />
              )) || <OnChainNoItem />)}
            {tab === 'OffChain' && <OffChainInterest />}
            <div className="placeholder" />
          </div>
        )}
      </div>
    </ProfileWrapper>
  );
}
export default Profile;
const ProfileWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  & div.loading {
    display: flex;
    justify-content: center;
    height: calc(100% - 210px);
    align-items: center;
  }
  > div {
    margin: 0 auto;
    padding: 24px;
    height: 100%;
    box-sizing: border-box;

    .infos {
      display: flex;
      gap: 40px;
      margin-bottom: 24px;
    }

    .content {
      .tab {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;
        gap: 24px;

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
          line-height: 24px;
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

      & .placeholder {
        min-height: 100px;
      }
    }
  }
`;
