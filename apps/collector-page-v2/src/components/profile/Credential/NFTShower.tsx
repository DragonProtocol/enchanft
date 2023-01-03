import { useEffect, useMemo, useRef, useState } from 'react';
import * as IPFS from 'ipfs-core';
import axios from 'axios';
import Loading from '../../common/loading/Loading';

export default function NFTShower({
  url,
  ipfs,
}: {
  url: string;
  ipfs?: boolean;
}) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [contentType, setContentType] = useState('');

  const attemptPlay = () => {
    if (videoEl && videoEl.current) {
      videoEl.current.play().catch((error) => {
        console.error('Error attempting to play', error);
      });
    }
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  useEffect(() => {
    if (url.startsWith('ipfs') && !url.includes('.')) {
      const dataUrl = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      axios
        .get(dataUrl)
        .then((resp) => {
          setContentType(resp.headers['content-type']);
        })
        .catch((err) => {});
    }
  }, [url]);

  const img = useMemo(() => {
    if (ipfs) {
      if (url) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      return url;
    }
    return url;
  }, [url, ipfs]);

  if (img.endsWith('mp4') || contentType.startsWith('video')) {
    return <video src={img} autoPlay loop ref={videoEl} />;
  }

  return <img src={img} alt="" />;
}
