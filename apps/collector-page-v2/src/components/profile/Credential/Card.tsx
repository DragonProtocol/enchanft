import styled from 'styled-components';

export function Card() {
  return (
    <Box>
      <img
        src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
        alt=""
      />
      <div className="hover">
        <button type="button">Get The OAT</button>
      </div>
    </Box>
  );
}

const Box = styled.div`
  display: inline-block;
  width: 120px;
  height: 190px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #d3d3d38a;
  }

  &:hover {
    .hover {
      display: flex;
    }
  }
`;

export function CircleCard() {
  return (
    <CircleCardBox>
      <img
        src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
        alt=""
      />
      <div className="hover">
        <button type="button">Get The OAT</button>
      </div>
    </CircleCardBox>
  );
}

const CircleCardBox = styled.div`
  display: inline-block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #d3d3d38a;
  }

  &:hover {
    .hover {
      display: flex;
    }
  }
`;
