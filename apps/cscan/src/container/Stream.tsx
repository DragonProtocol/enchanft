import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getStreamInfo } from '../api';
import StreamTable from '../components/StreamTable';
import { Network, Stream } from '../types';

export default function StreamPage() {
  let { network, streamId } = useParams();
  const [stream, setStream] = useState<Stream>();

  const loadStreamInfo = async (network: Network, streamId: string) => {
    const resp = await getStreamInfo(network, streamId);

    setStream(resp.data.data);
  };

  useEffect(() => {
    if (!streamId || !network) return;
    loadStreamInfo(network as Network, streamId);
  }, [streamId, network]);

  return (
    <PageBox>
      {stream && <StreamTable data={stream} network={network as Network} />}
    </PageBox>
  );
}

const PageBox = styled.div`
  margin: 20px 0;
`;
