import { useMemo } from 'react';
import styled from 'styled-components';
import {
  GalxeDataListItem,
  NooxDataListItem,
  PoapData,
} from '../../../services/types/profile';

export function NooxCard({
  data,
  oatAction,
}: {
  data: NooxDataListItem;
  oatAction: () => void;
}) {
  const img = useMemo(() => {
    return data?.uriMetaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }, [data?.uriMetaData.image]);

  return (
    <Box>
      <img src={img} alt="" />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>
    </Box>
  );
}

const Box = styled.div`
  display: inline-block;
  width: 150px;
  height: 200px;
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
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
    & button {
      width: 136px;
      height: 41px;
      border: none;
      outline: none;
      background: #ffffff;
      border-radius: 12px;
    }
  }

  &:hover {
    .hover {
      display: flex;
    }
  }
`;

export function GalxeCard({
  data,
  oatAction,
}: {
  data: GalxeDataListItem;
  oatAction: () => void;
}) {
  return (
    <CircleCardBox>
      <img src={data?.image} alt="" />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>
    </CircleCardBox>
  );
}

export function PoapCard({
  data,
  oatAction,
}: {
  data: PoapData;
  oatAction: () => void;
}) {
  return (
    <CircleCardBox>
      <img src={data?.event?.image_url} alt="" />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>
    </CircleCardBox>
  );
}

const CircleCardBox = styled.div`
  display: inline-block;
  width: 170px;
  height: 170px;
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
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));

    & button {
      width: 136px;
      height: 41px;
      border: none;
      outline: none;
      background: #ffffff;
      border-radius: 12px;
    }
  }

  &:hover {
    .hover {
      display: flex;
    }
  }
`;
