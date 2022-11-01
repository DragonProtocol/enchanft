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
type MartianProvider = {
  provider: any;
  publicKeyStr: string;
};

export type SignMsgResult = {
  walletType: TokenType;
  pubkey: string;
  signature: string;
  payloadMsg?: string;
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
  martianValid: boolean;
  phantom: PhantomProvider | null;
  metaMask: MetaMaskProvider | null;
  martian: MartianProvider | null;
  account: AppAccount;
  updateAccount: (arg0: any) => void;
  getSolanaProvider: () => void;
  getEthProvider: () => void;
  getPhantomAddr: () => Promise<string | undefined>;
  getMetaMaskAddr: () => Promise<string | undefined>;
  getMartianAddr: () => Promise<string | undefined>;
  signMsgWithPhantom: () => Promise<SignMsgResult | undefined>;
  signMsgWithMetaMask: () => Promise<SignMsgResult | undefined>;
  signMsgWithMartian: () => Promise<SignMsgResult | undefined>;
  validLogin: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isVIP: boolean;
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
  martianValid: false,
  phantom: null,
  metaMask: null,
  martian: null,
  validLogin: false,
  account: DefaultAccount,
  updateAccount: (arg0: any) => {},
  getSolanaProvider,
  getEthProvider,
  getMetaMaskAddr,
  getPhantomAddr,
  getMartianAddr,
  signMsgWithPhantom,
  signMsgWithMetaMask,
  signMsgWithMartian,
  isCreator: false,
  isAdmin: false,
  isVIP: false,
};

export const AppContext = createContext<AppContextData>(DefaultCtxData);

// for init
const DefaultWallet = (localStorage.getItem(DEFAULT_WALLET) as TokenType) || '';

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [martianValid, setMartianValid] = useState(false);
  const [phantomValid, setPhantomValid] = useState(false);
  const [metaMaskValid, setMetaMaskValid] = useState(false);
  const [metaMask, setMetaMask] = useState<MetaMaskProvider | null>(null);
  const [phantom, setPhantom] = useState<PhantomProvider | null>(null);
  const [martian, setMartian] = useState<MartianProvider | null>(null);
  const [account, setAccount] = useState<AppAccount>(DefaultCtxData.account);

  useEffect(() => {
    const cb = () => {
      let phantomValid = false;
      let metaMaskValid = false;
      let martianValid = false;
      if (windowObj.solana && windowObj.solana.isPhantom) {
        phantomValid = true;
      }
      if (windowObj.ethereum) {
        metaMaskValid = true;
      }
      if (windowObj.martian) {
        martianValid = true;
      }
      setPhantomValid(phantomValid);
      setMetaMaskValid(metaMaskValid);
      setMartianValid(martianValid);
      walletCheck(metaMaskValid, phantomValid, martianValid);
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
      martianValid: boolean
    ) => {
      console.log('walletCheck', {
        metamaskValid,
        phantomValid,
        martianValid,
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
      if (martianValid && DefaultWallet === TokenType.Aptos) {
        if (windowObj.martianValidChecked) return;
        windowObj.martianValidChecked = true;
        console.log('getMartianProvider' + Date.now());
        const provider = await getAptosProvider();
        if (!provider) {
          return;
        }
        const addr = await getMartianAddr();
        setMartian({
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
    if (!account.info?.roles) {
      return false;
    }
    return account.info.roles.includes(RoleType.CREATOR) || false;
  }, [account.info?.roles]);

  const isAdmin = useMemo(() => {
    if (!account.info?.roles) {
      return false;
    }
    return account.info.roles.includes('ADMIN') || false;
  }, [account.info]);

  const isVIP = useMemo(() => {
    if (!account.info?.roles) {
      return false;
    }
    return account.info.roles.includes('VIP') || false;
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

  log.debug('account', account);

  return (
    <AppContext.Provider
      value={{
        ...DefaultCtxData,
        validLogin,
        phantomValid,
        metaMaskValid,
        martianValid,
        metaMask,
        phantom,
        martian,
        account,
        isCreator,
        isAdmin,
        isVIP,
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
  if (windowObj.martian) {
    await windowObj.martian.connect();
    const provider = windowObj.martian;
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

async function getMartianAddr() {
  const provider = await getAptosProvider();
  if (!provider) return;
  const { publicKey } = await provider.account();
  return publicKey.slice(2);
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

async function signMsgWithMartian(): Promise<SignMsgResult | undefined> {
  const provider = await getAptosProvider();
  if (!provider) return;
  const walletAddr = await getMartianAddr();
  const resp = await provider.signMessage({
    message: SIGN_MSG,
  });
  console.log('signMsgWithMartian', resp);
  const { signature } = resp;
  return {
    walletType: TokenType.Aptos,
    pubkey: walletAddr,
    signature: signature.slice(2),
    payloadMsg: resp.fullMessage,
  };
}
