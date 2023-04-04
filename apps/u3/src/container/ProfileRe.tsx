import styled from 'styled-components';
import { Profile } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useState } from 'react';
import LogoutConfirmModal from '../components/layout/LogoutConfirmModal';
import useLogin from '../hooks/useLogin';
import { LogoutButton } from '../components/layout/LoginButton';
import Reviews from '../components/profile/review/Reviews';

export default function ProfileRe() {
  const { sessId } = useUs3rProfileContext();
  const { logout } = useLogin();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  return (
    <ProfileWrapper>
      <div className="profile-wrap">
        <Profile did={sessId} />
        <LogoutButton
          className="logout-button"
          onClick={() => {
            setOpenLogoutConfirm(true);
          }}
        />
      </div>
      <div className="reviews-warp">
        <Reviews />
      </div>
      <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
      />
    </ProfileWrapper>
  );
}

const ProfileWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  display: flex;
  gap: 40px;
  .profile-wrap {
    padding-top: 40px;
    margin: 0 auto;
    .logout-button {
      margin-top: 20px;
    }
  }

  .reviews-warp {
    padding-top: 40px;
    flex-grow: 1;
  }
`;
