import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import { MetaInfo } from '../synft';
import { getMetadataInfoWithMint } from '../utils';

/**
 * 获取 MetaInfo
 */
export default (mint: string | undefined) => {
  const { connection } = useConnection();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<MetaInfo | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!mint) return;
      const mintKey = new PublicKey(mint);
      const data: MetaInfo | null = await getMetadataInfoWithMint(
        mintKey,
        connection
      );
      setInfo(data);
      setLoading(false);
    })();
  }, [mint]);

  return { info, loading };
};
