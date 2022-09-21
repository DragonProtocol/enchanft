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
  LAST_LOGIN_ROLES,
  LAST_LOGIN_TOKEN,
  LAST_LOGIN_TYPE,
  SIGN_MSG,
  TokenType,
} from './utils/token';
import bs58 from 'bs58';
import { AccountLink, ChainType, getProfile, linkSocial } from './api';
import log from 'loglevel';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

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
type PetraProvider = {
  provider: any;
  publicKeyStr: string;
};

export type SignMsgResult = {
  walletType: TokenType;
  pubkey: string;
  signature: string;
};

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
}

type AppAccountInfo = {
  walletType: string;
  email?: string;
  pubkey: string;
  token: string;
  id: 0;
  name: string;
  avatar: string;
  accounts: AccountLink[];
  roles: string[];
  resourcePermissions: {
    resourceIds: number[];
    resourceType: 'PROJECT';
  }[];
};
type AppAccount = {
  lastLoginToken: string;
  lastPubkey: string;
  lastLoginType: string;
  lastLoginInfo: {
    avatar: string;
    name: string;
  };
  info: AppAccountInfo | null;
};
export interface AppContextData {
  phantomValid: boolean;
  metaMaskValid: boolean;
  phantom: PhantomProvider | null;
  metaMask: MetaMaskProvider | null;
  account: AppAccount;
  updateAccount: (arg0: any) => void;
  getSolanaProvider: () => void;
  getEthProvider: () => void;
  getPhantomAddr: () => Promise<string | undefined>;
  getMetaMaskAddr: () => Promise<string | undefined>;
  signMsgWithPhantom: () => Promise<SignMsgResult | undefined>;
  signMsgWithMetaMask: () => Promise<SignMsgResult | undefined>;
  validLogin: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

const DefaultAccount: AppAccount = {
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
    roles: JSON.parse(localStorage.getItem(LAST_LOGIN_ROLES) || 'null') || [],
    resourcePermissions: [],
  },
};

const DefaultCtxData: AppContextData = {
  phantomValid: false,
  metaMaskValid: false,
  phantom: null,
  metaMask: null,
  validLogin: false,
  account: DefaultAccount,
  updateAccount: (arg0: any) => {},
  getSolanaProvider,
  getEthProvider,
  getMetaMaskAddr,
  getPhantomAddr,
  signMsgWithPhantom,
  signMsgWithMetaMask,
  isCreator: false,
  isAdmin: false,
};

export const AppContext = createContext<AppContextData>(DefaultCtxData);

// for init
const DefaultWallet = (localStorage.getItem(DEFAULT_WALLET) as TokenType) || '';

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [petraValid, setPetraValid] = useState(false);
  const [phantomValid, setPhantomValid] = useState(false);
  const [metaMaskValid, setMetaMaskValid] = useState(false);
  const [metaMask, setMetaMask] = useState<MetaMaskProvider | null>(null);
  const [phantom, setPhantom] = useState<PhantomProvider | null>(null);
  const [petra, setPetra] = useState<PetraProvider | null>(null);
  const [account, setAccount] = useState<AppAccount>(DefaultCtxData.account);

  useEffect(() => {
    const cb = () => {
      let phantomValid = false;
      let metaMaskValid = false;
      let petraValid = false;
      if (windowObj.solana && windowObj.solana.isPhantom) {
        phantomValid = true;
      }
      if (windowObj.ethereum) {
        metaMaskValid = true;
      }
      if (windowObj.aptos) {
        petraValid = true;
      }
      setPhantomValid(phantomValid);
      setMetaMaskValid(metaMaskValid);
      setPetraValid(petraValid);
      walletCheck(metaMaskValid, phantomValid, petraValid);
    };
    window.addEventListener('load', cb);
    return () => {
      window.removeEventListener('load', cb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfileWithToken = useCallback(
    async (token: string, walletType: TokenType, pubkey: string) => {
      try {
        const resp = await getProfile(token);
        const { data } = resp.data;
        setAccount({
          ...account,
          info: {
            walletType: walletType,
            pubkey: pubkey,
            ...data,
            token,
          } as AppAccountInfo,
        });
      } catch (error) {
        // const err: AxiosError = error as any;
        // if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        // } else {
        //   toast.error('Please log in again!');
        // }
        setAccount({ ...account, info: null });
      }
    },
    [account]
  );

  const walletCheck = useCallback(
    async (
      metamaskValid: boolean,
      phantomValid: boolean,
      petraValid: boolean
    ) => {
      console.log('walletCheck', {
        metamaskValid,
        phantomValid,
        petraValid,
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
          setAccount({ ...account, info: null });
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
          setAccount({ ...account, info: null });
        } else {
          await getProfileWithToken(
            account.lastLoginToken,
            TokenType.Solana,
            addr.toString()
          );
        }
      }
      if (petraValid && DefaultWallet === TokenType.Aptos) {
        if (windowObj.petraValidChecked) return;
        windowObj.petraValidChecked = true;
        console.log('getAptosProvider' + Date.now());
        const provider = await getAptosProvider();
        if (!provider) {
          return;
        }
        const addr = await getAptosAddr();
        setPetra({
          provider: provider,
          publicKeyStr: addr,
        });
        console.log('aptosValid', addr);
        if (account.lastPubkey !== addr.toString()) {
          setAccount({ ...account, info: null });
        } else {
          await getProfileWithToken(
            account.lastLoginToken,
            TokenType.Aptos,
            addr.toString()
          );
        }
      }
    },
    [account, getProfileWithToken]
  );

  const validLogin = useMemo(() => {
    return !!(account.info?.token && account.info.pubkey);
  }, [account.info?.token, account.info?.pubkey]);

  const isCreator = useMemo(() => {
    return account.info?.roles?.includes(RoleType.CREATOR) || false;
  }, [account.info?.roles]);

  const isAdmin = useMemo(() => {
    return account.info?.roles.includes('ADMIN') || false;
  }, [account.info]);

  const linkUser = useCallback(
    async (accountInfo: any) => {
      if (!account.info?.token) return;
      const code = accountInfo.code;
      const type = accountInfo.type || 'TWITTER';
      if (code && type) {
        const resp = await linkSocial({ code, type }, account.info.token);
        setAccount({
          ...account,
          info: {
            ...account.info,
            accounts: resp.data || [],
          },
        });
      } else {
        toast.error('account bind failed!');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account.info?.token]
  );

  useEffect(() => {
    localStorage.setItem(
      'social_auth',
      JSON.stringify({ code: null, type: null })
    );
    const handleStorageChange = (e: StorageEvent) => {
      const { newValue, key, url } = e;
      if ('social_auth' === key) {
        console.log('social_auth change url', url);
        // if ("social_auth" === key && url.includes("https://launch.enchanft.xyz/#/callback")) {
        const { code, type } = JSON.parse(newValue || '');
        if (code && type) {
          linkUser({ code, type });
          localStorage.setItem(
            'social_auth',
            JSON.stringify({ code: null, type: null })
          );
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [linkUser]);

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
        isCreator,
        isAdmin,
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

async function getAptosProvider() {
  if (windowObj.aptos) {
    const provider = await windowObj.aptos.connect();
    return provider;
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

async function getAptosAddr() {
  const provider = await getAptosProvider();
  if (!provider) return;
  const { publicKey } = await provider.account();
  return publicKey;
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

async function signMsgWithAptos(): Promise<SignMsgResult | undefined> {
  const provider = await getAptosProvider();
  if (!provider) return;
  const walletAddr = await getAptosAddr();
  const { signature } = await provider.signMessage({
    SIGN_MSG,
  });
  return { walletType: TokenType.Ethereum, pubkey: walletAddr, signature };
}
