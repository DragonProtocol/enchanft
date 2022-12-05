import { useMemo } from 'react';
import styled from 'styled-components';
import {
  GalxeDataListItem,
  NooxDataListItem,
  PoapData,
} from '../../../services/types/profile';

export function NooxCard({ data }: { data: NooxDataListItem }) {
  const img = useMemo(() => {
    return data?.uriMetaData.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }, [data?.uriMetaData.image]);

  return (
    <Box>
      <img src={img} alt="" />
      <div className="hover">
        <button type="button">Get The OAT</button>
      </div>
    </Box>
  );
}

const Box = styled.div`
  display: inline-block;
  width: 150px;
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

export function GalxeCard({ data }: { data: GalxeDataListItem }) {
  return (
    <CircleCardBox>
      <img src={data?.image} alt="" />
      <div className="hover">
        <button type="button">Get The OAT</button>
      </div>
    </CircleCardBox>
  );
}

export function PoapCard({ data }: { data: PoapData }) {
  return (
    <CircleCardBox>
      <img src={data?.event?.image_url} alt="" />
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
