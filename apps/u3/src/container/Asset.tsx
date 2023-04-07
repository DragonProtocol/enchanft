import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useUs3rProfileContext } from '@us3r-network/profile';
import OnChainInterest from '../components/profile/OnChainInterest';
import { fetchU3Assets, ProfileDefault } from '../services/api/profile';
import { ProfileEntity } from '../services/types/profile';
import Loading from '../components/common/loading/Loading';
import { mergeProfilesData } from '../utils/mergeProfilesData';
import { MainWrapper } from '../components/layout/Index';
import PageTitle from '../components/common/PageTitle';

export default function Asset() {
  const { wallet } = useParams();
  const { sessId } = useUs3rProfileContext();
  const sessWallet = useMemo(() => sessId.split(':').pop() || '', [sessId]);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileEntity>();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const fetchData = useCallback(async (wallet: string) => {
    if (!wallet) return;
    try {
      const { data } = await fetchU3Assets(
        [wallet],
        ['nfts', 'erc20Balances', 'ethBalance']
      );
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
      <PageTitle>Asset</PageTitle>
      <ContentWrapper>
        {(loading && (
          <div className="loading">
            <Loading />
          </div>
        )) || (
          <OnChainInterest
            data={profileData.nfts}
            wallet={profileData.erc20Balances}
            ethBalance={profileData.ethBalance}
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
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;
