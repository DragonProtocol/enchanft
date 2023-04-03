import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Credential from '../components/profile/Credential';
import {
  addOrDelWallet,
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
import PageTitle from '../components/common/PageTitle';

export default function Gallery() {
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
      <PageTitle>Gallery</PageTitle>
      <ContentWrapper id="profile-wrapper">
        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) || (
          <Credential
            {...{
              poap: profileData.poap,
              noox: profileData.noox,
              galxe: profileData.galxe,
            }}
          />
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
