import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { checkValidNFT } from '../utils';

export default (mint: string | undefined) => {
  const { connection } = useConnection();

  const [valid, setValid] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      setChecking(true);
      if (!mint) {
        return;
      }

      const mintKey = new PublicKey(mint);
      const result = await checkValidNFT(mintKey, connection);
      setValid(result);
      setChecking(false);
    })();
  }, [mint]);

  return { valid, checking };
};
