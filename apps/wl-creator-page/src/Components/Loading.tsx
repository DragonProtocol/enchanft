import styled from 'styled-components';
import loadingGif from './imgs/loading.gif';

export default function LoadingBox() {
  return (
    <Box>
      <Loading />
    </Box>
  );
}

const Box = styled.div`
  text-align: center;
  padding-top: 100px;
  & img {
    width: 100px;
  }
`;

export function Loading() {
  return <img src={loadingGif} alt="" />;
}
