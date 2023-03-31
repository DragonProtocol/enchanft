import styled from 'styled-components';
import { Profile } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';

export default function ProfileRe() {
  const { sessId } = useUs3rProfileContext();
  return (
    <ProfileWrapper>
      <div className="profile-wrap">
        <Profile did={sessId} />
      </div>
      <div className="reviews-warp">
        <div className="reviews">
          <h3>My Reviews (17)</h3>
        </div>
      </div>
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
  }

  .reviews-warp {
    padding-top: 40px;
    flex-grow: 1;
  }

  .reviews {
    color: #ffffff;

    padding: 20px;
    gap: 20px;

    background: #1b1e23;
    border-radius: 20px;
  }
`;
