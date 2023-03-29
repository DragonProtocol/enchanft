import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import OnChainInterest, {
  OnChainNoItem,
} from '../components/profile/OnChainInterest';
import {
  fetchU3Profiles,
  fetchU3ProfileWithWallet,
  fetchU3Wallets,
  ProfileDefault,
} from '../services/api/profile';
import { ProfileEntity, ProfileWallet } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/mergeProfilesData';
import useLogin from '../hooks/useLogin';
import { MainWrapper } from '../components/layout/Index';

export default function Asset() {
  const { wallet } = useParams();
  const { user } = useLogin();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    try {
      const { data } = await fetchU3Profiles(user?.token);
      const r = mergeProfilesData(data.data);
      setProfileData(r);
      // setProfileData(data.data);
    } catch (error) {
      setProfileData(ProfileDefault);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

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

  useEffect(() => {
    if (wallet) {
      fetchDataWithWallet();
    } else {
      fetchData();
    }
  }, [fetchData, fetchDataWithWallet, wallet]);

  return (
    <Wrapper>
      {(loading && (
        <div className="loading">
          <Loading />
        </div>
      )) ||
        (profileData.nfts.result.length > 0 && (
          <OnChainInterest
            data={profileData.nfts}
            wallet={profileData.erc20Balances}
            ethBalance={profileData.ethBalance}
          />
        )) || <OnChainNoItem />}
    </Wrapper>
  );
}
const Wrapper = styled(MainWrapper)``;
