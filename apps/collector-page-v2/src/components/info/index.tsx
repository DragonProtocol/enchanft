import styled from 'styled-components';

export default function Info() {
  return (
    <InfoBox>
      <div className="user-info">
        <img
          className="user-avatar"
          src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
          alt=""
        />

        <div className="">
          <div className="nickname">
            <span className="name">Nickname</span>
            <span>share</span>
          </div>
          <div>
            <span>wallet addr</span>
          </div>
        </div>
      </div>
      <div className="attach">
        <div>date</div>
        <div>
          <span>twitter</span>
          <span>discord</span>
        </div>
      </div>
    </InfoBox>
  );
}

const InfoBox = styled.div`
  flex-grow: 1;
  .user-info {
    display: flex;
    gap: 10px;
    & img.user-avatar {
      border-radius: 5px;

      width: 100px;
      height: 100px;
    }
    & > div {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      & .nickname {
        display: flex;
        justify-content: space-between;
        & .name {
          font-size: 25px;
          font-weight: 700;
        }
      }
    }
  }

  .attach {
    display: flex;
    justify-content: space-between;
  }
`;
