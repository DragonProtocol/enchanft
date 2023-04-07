import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useUs3rProfileContext } from '@us3r-network/profile';
import Credential from '../components/profile/Credential';
import { fetchU3Assets, ProfileDefault } from '../services/api/profile';
import { ProfileEntity } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/mergeProfilesData';
import { MainWrapper } from '../components/layout/Index';
import PageTitle from '../components/common/PageTitle';

export default function Gallery() {
  const { wallet } = useParams();
  const { sessId } = useUs3rProfileContext();
  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchData = useCallback(async (wallet: string) => {
    if (!wallet) return;
    try {
      const { data } = await fetchU3Assets([wallet], ['poap', 'noox', 'galxe']);
      const r = mergeProfilesData(data.data);
      setProfileData(r);
    } catch (error) {
      setProfileData(ProfileDefault);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(wallet || sessWallet);
  }, [fetchData, sessWallet, wallet]);

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
