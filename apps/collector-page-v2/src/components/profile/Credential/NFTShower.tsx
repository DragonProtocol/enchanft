import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

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

  const imageErrCheck = useCallback(async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const resp = await axios.get(imageUrl);
      setContentType(resp.headers['content-type']);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    attemptPlay();
  }, [contentType]);

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
    return <video src={img} autoPlay muted loop ref={videoEl} />;
  }

  return (
    <img
      src={img}
      alt=""
      onError={() => {
        imageErrCheck(img);
      }}
    />
  );
}
