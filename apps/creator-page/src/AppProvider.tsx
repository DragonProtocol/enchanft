import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import {
  DEFAULT_WALLET,
  LAST_LOGIN_AVATAR,
  LAST_LOGIN_NAME,
  LAST_LOGIN_PUBKEY,
  LAST_LOGIN_TOKEN,
  LAST_LOGIN_TYPE,
  SIGN_MSG,
  TokenType,
} from './utils/token';
import bs58 from 'bs58';
import { getProfile } from './api';
import log from 'loglevel';

// const connection = new Connection(clusterApiUrl('devnet'));
// const metaplex = new Metaplex(connection);
const windowObj: any = window;

type PhantomProvider = {
  provider: any;
  publicKey: PublicKey;
};
type MetaMaskProvider = {
  provider: any;
  publicKeyStr: string;
};

export type SignMsgResult = {
  walletType: TokenType;
  pubkey: string;
  signature: string;
};

export interface AppContextData {
  phantomValid: boolean;
  metaMaskValid: boolean;
  phantom: PhantomProvider | null;
  metaMask: MetaMaskProvider | null;
  account: any;
  updateAccount: (arg0: any) => void;
  getSolanaProvider: () => void;
  getEthProvider: () => void;
  getPhantomAddr: () => Promise<string | undefined>;
  getMetaMaskAddr: () => Promise<string | undefined>;
  signMsgWithPhantom: () => Promise<SignMsgResult | undefined>;
  signMsgWithMetaMask: () => Promise<SignMsgResult | undefined>;
  validLogin: boolean;
}

const DefaultCtxData: AppContextData = {
  phantomValid: false,
  metaMaskValid: false,
  phantom: null,
  metaMask: null,
  validLogin: false,
  account: {
    lastLoginToken: localStorage.getItem(LAST_LOGIN_TOKEN) || '',
    lastPubkey: localStorage.getItem(LAST_LOGIN_PUBKEY) || '',
    lastLoginType: localStorage.getItem(LAST_LOGIN_TYPE) || '',
    lastLoginInfo: {
      avatar: localStorage.getItem(LAST_LOGIN_AVATAR) || '',
      name: localStorage.getItem(LAST_LOGIN_NAME) || '',
    },
    info: {
      walletType: '',
      pubkey: localStorage.getItem(LAST_LOGIN_PUBKEY) || '',
      token: localStorage.getItem(LAST_LOGIN_TOKEN) || '',
      id: 0,
      name: localStorage.getItem(LAST_LOGIN_NAME) || '',
      avatar: localStorage.getItem(LAST_LOGIN_AVATAR) || '',
      accounts: [],
      roles: [],
      resourcePermissions: [],
    },
  },
  updateAccount: (arg0: any) => {},
  getSolanaProvider,
  getEthProvider,
  getMetaMaskAddr,
  getPhantomAddr,
  signMsgWithPhantom,
  signMsgWithMetaMask,
};

export const AppContext = createContext<AppContextData>(DefaultCtxData);

// for init
const DefaultWallet = (localStorage.getItem(DEFAULT_WALLET) as TokenType) || '';

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [phantomValid, setPhantomValid] = useState(false);
  const [metaMaskValid, setMetaMaskValid] = useState(false);
  const [metaMask, setMetaMask] = useState<MetaMaskProvider | null>(null);
  const [phantom, setPhantom] = useState<PhantomProvider | null>(null);
  const [account, setAccount] = useState<any>(DefaultCtxData.account);

  useEffect(() => {
    const timer = setTimeout(() => {
      let phantomValid = false;
      let metaMaskValid = false;
      if (windowObj.solana && windowObj.solana.isPhantom) {
        phantomValid = true;
      }
      if (windowObj.ethereum) {
        metaMaskValid = true;
      }
      setPhantomValid(phantomValid);
      setMetaMaskValid(metaMaskValid);
      walletCheck(metaMaskValid, phantomValid);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfileWithToken = useCallback(
    async (token: string, walletType: TokenType, pubkey: string) => {
      const resp = await getProfile(token);
      console.log(resp.data);
      const { data } = resp.data;
      setAccount({
        ...account,
        info: {
          walletType: walletType,
          pubkey: pubkey,
          ...data,
          token,
        },
      });
    },
    [account]
  );

  const walletCheck = useCallback(
    async (metamaskValid: boolean, phantomValid: boolean) => {
      console.log('walletCheck', {
        metamaskValid,
        phantomValid,
        DefaultWallet,
      });
      if (metamaskValid && DefaultWallet === TokenType.Ethereum) {
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
        if (account.lastPubkey !== addr.toString()) {
          setAccount({ ...account, info: {} });
        } else {
          await getProfileWithToken(
            account.lastLoginToken,
            TokenType.Ethereum,
            addr
          );
        }
      }
      if (phantomValid && DefaultWallet === TokenType.Solana) {
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
        console.log('phantomValid', addr.toBase58());
        if (account.lastPubkey !== addr.toString()) {
          setAccount({ ...account, info: {} });
        } else {
          await getProfileWithToken(
            account.lastLoginToken,
            TokenType.Solana,
            addr.toString()
          );
        }
      }
    },
    [account, getProfileWithToken]
  );

  const validLogin = useMemo(() => {
    return !!(account.info.token && account.info.pubkey);
  }, [account]);

  log.debug('account', account);

  return (
    <AppContext.Provider
      value={{
        ...DefaultCtxData,
        validLogin,
        phantomValid,
        metaMaskValid,
        metaMask,
        phantom,
        account,
        updateAccount: (newAccount) => {
          setAccount({ ...account, ...newAccount });
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppConfig() {
  const context = useContext(AppContext);
  return { ...context };
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

async function getPhantomAddr() {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) return;
  const pubkey = solanaProvider.publicKey;
  return pubkey.toString();
}

async function getMetaMaskAddr() {
  const ethProvider = await getEthProvider();
  if (!ethProvider) return;
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  return walletAddr;
}

async function signMsgWithPhantom(): Promise<SignMsgResult | undefined> {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) return;
  const pubkey = solanaProvider.publicKey;
  const { signature: signatureBuf } = await solanaProvider.signMessage(
    Buffer.from(SIGN_MSG)
  );
  const signature = bs58.encode(signatureBuf);
  return { walletType: TokenType.Solana, pubkey: pubkey.toString(), signature };
}
async function signMsgWithMetaMask(): Promise<SignMsgResult | undefined> {
  const ethProvider = await getEthProvider();
  if (!ethProvider) return;
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  const signature = await signer.signMessage(SIGN_MSG);
  return { walletType: TokenType.Ethereum, pubkey: walletAddr, signature };
}
