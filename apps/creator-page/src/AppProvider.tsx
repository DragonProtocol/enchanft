import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = new Metaplex(connection);
const windowObj: any = window;

type PhantomProvider = {
  provider: any;
  publicKey: PublicKey;
};
type MetaMaskProvider = {
  provider: any;
  publicKeyStr: string;
};

export interface AppContextData {
  metaplex: Metaplex;
  phantomValid: boolean;
  metaMaskValid: boolean;
  phantom: PhantomProvider | null;
  metaMask: MetaMaskProvider | null;
}

export const AppContext = createContext<AppContextData | null>(null);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [phantomValid, setPhantomValid] = useState(false);
  const [metaMaskValid, setMetaMaskValid] = useState(false);
  const [metaMask, setMetaMask] = useState<MetaMaskProvider | null>(null);
  const [phantom, setPhantom] = useState<PhantomProvider | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let phantomValid = false;
      let metamaskValid = false;
      if (windowObj.solana && windowObj.solana.isPhantom) {
        phantomValid = true;
      }
      if (windowObj.ethereum) {
        metamaskValid = true;
      }
      setPhantomValid(phantomValid);
      setMetaMaskValid(metamaskValid);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const walletCheck = async (metamaskValid: boolean, phantomValid: boolean) => {
    if (metamaskValid) {
      if (windowObj.metaMaskValidChecked) return;
      windowObj.metaMaskValidChecked = true;
      const ethProvider = await getEthProvider();
      if (!ethProvider) return;
      const signer = ethProvider.getSigner();
      const addr = await signer.getAddress();
      setMetaMask({
        provider: ethProvider,
        publicKeyStr: addr,
      });
      console.log('metamaskValid', addr);
    }
    if (phantomValid) {
      if (windowObj.phantomValidChecked) return;
      windowObj.phantomValidChecked = true;
      console.log('getSolanaProvider' + Date.now());
      const provider = await getSolanaProvider();
      if (!provider) {
        return;
      }
      const addr = provider.publicKey as PublicKey;
      setPhantom({
        provider: provider,
        publicKey: addr,
      });
      console.log('phantomValid', addr);
    }
  };

  return (
    <AppContext.Provider
      value={{
        metaplex,
        phantomValid,
        metaMaskValid,
        metaMask,
        phantom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppConfig() {
  const context = useContext(AppContext);
  return {
    metaplex: context?.metaplex,
    phantomValid: context?.phantomValid,
    metaMaskValid: context?.metaMaskValid,
  };
}

async function getEthProvider() {
  if (windowObj.ethereum) {
    const provider = new ethers.providers.Web3Provider(windowObj.ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider;
  } else {
    return null;
  }
}
async function getSolanaProvider() {
  if (windowObj.solana) {
    await windowObj.solana.connect(); // opens wallet to connect to

    const provider = windowObj.solana;
    if (provider.isPhantom) {
      return provider;
    }
  } else {
    return null;
  }
}

// metaplex.use(walletAdapterIdentity(provider));
// const myNfts = await metaplex
//   .nfts()
//   .findAllByOwner({ owner: provider.publicKey })
//   .run();
// console.log(myNfts);
