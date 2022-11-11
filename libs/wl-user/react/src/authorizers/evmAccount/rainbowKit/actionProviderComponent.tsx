/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:29:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 15:50:05
 * @Description: file description
 */
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  AuthenticationStatus,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  omniWallet,
  imTokenWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useAccount,
  useSignMessage,
  useDisconnect,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccountType,
  BindResult,
  login,
  bindAccount,
  LoginResult,
} from '../../../api';
import { useWlUserReact } from '../../../provider';
import { AuthActionProcessStatus, SIGN_MSG } from '../../authorizer';
const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    // alchemyProvider({ apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
    publicProvider(),
  ]
);
const appInfo = {
  appName: 'Login With Evm Wallets',
};
const { wallets } = getDefaultWallets({
  appName: 'Recommend Wallets',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other Wallets',
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
      omniWallet({ chains }),
      imTokenWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});

export type ActionProviderComponentProps = {
  onLoginProcess: (status: AuthActionProcessStatus) => void;
  onLoginSuccess: (result: LoginResult) => void;
  onLoginError: (error: Error) => void;
  onBindProcess: (status: AuthActionProcessStatus) => void;
  onBindSuccess: (result: BindResult) => void;
  onBindError: (error: Error) => void;
  setLoginAction: (fn: () => void) => void;
  setBindAction: (fn: () => void) => void;
};
enum CurrentActionType {
  NONE = 'NONE',
  LOGIN = 'LOGIN',
  BIND = 'BIND',
}

export function ActionProviderComponent({
  onLoginProcess,
  onLoginSuccess,
  onLoginError,
  onBindProcess,
  onBindSuccess,
  onBindError,
  setLoginAction,
  setBindAction,
}: ActionProviderComponentProps) {
  const currentActionType = useRef<CurrentActionType>(CurrentActionType.NONE);
  const { user, isLogin } = useWlUserReact();

  const setOpenConnectModal = (fn: () => void) => {
    setLoginAction(() => {
      if (fn) {
        currentActionType.current = CurrentActionType.LOGIN;
        fn();
      } else {
        currentActionType.current = CurrentActionType.NONE;
      }
    });
    setBindAction(() => {
      if (fn) {
        currentActionType.current = CurrentActionType.BIND;
        fn();
      } else {
        currentActionType.current = CurrentActionType.NONE;
      }
    });
  };
  const [authStatus, setAuthStatus] =
    useState<AuthenticationStatus>('unauthenticated');
  const onSignStart = useCallback(() => {
    setAuthStatus('loading');
    if (currentActionType.current === CurrentActionType.LOGIN) {
      onLoginProcess(AuthActionProcessStatus.SIGNATURE_PENDING);
    } else if (currentActionType.current === CurrentActionType.BIND) {
      onBindProcess(AuthActionProcessStatus.SIGNATURE_PENDING);
    }
  }, [onLoginProcess, onBindProcess]);
  const onSignSuccess = useCallback(
    (signature: string, message: string, pubkey: string) => {
      if (currentActionType.current === CurrentActionType.LOGIN) {
        onLoginProcess(AuthActionProcessStatus.API_PENDING);
        login({
          type: AccountType.EVM,
          signature: signature,
          payload: message,
          pubkey: pubkey,
        })
          .then((result) => {
            const authenticated = !!result.data.token;
            if (authenticated) {
              setAuthStatus('authenticated');
              onLoginProcess(AuthActionProcessStatus.API_FULFILLED);
              onLoginSuccess(result.data);
            } else {
              onLoginProcess(AuthActionProcessStatus.API_REJECTED);
              onLoginError(new Error('Login Failed'));
            }
          })
          .catch((error) => {
            setAuthStatus('unauthenticated');
            onLoginProcess(AuthActionProcessStatus.API_REJECTED);
            onLoginError(error);
          })
          .finally(() => {
            currentActionType.current = CurrentActionType.NONE;
          });
      } else if (currentActionType.current === CurrentActionType.BIND) {
        onBindProcess(AuthActionProcessStatus.API_PENDING);
        bindAccount(user.token, {
          type: AccountType.EVM,
          signature: signature,
          payload: message,
          pubkey: pubkey,
        })
          .then((result) => {
            const authenticated = !!result.data;
            if (authenticated) {
              onBindProcess(AuthActionProcessStatus.API_FULFILLED);
              onBindSuccess(result.data);
            } else {
              onBindProcess(AuthActionProcessStatus.API_REJECTED);
              onBindError(new Error('Bind Failed'));
            }
          })
          .catch((error) => {
            onBindProcess(AuthActionProcessStatus.API_REJECTED);
            onBindError(error);
          })
          .finally(() => {
            currentActionType.current = CurrentActionType.NONE;
          });
      }
    },
    [
      onLoginProcess,
      onLoginSuccess,
      onLoginError,
      onBindProcess,
      onBindSuccess,
      onBindError,
    ]
  );
  const onSignError = useCallback(
    (error: Error) => {
      setAuthStatus('unauthenticated');
      if (currentActionType.current === CurrentActionType.LOGIN) {
        onLoginError(error);
      } else if (currentActionType.current === CurrentActionType.BIND) {
        onBindError(error);
      }
    },
    [onLoginError, onBindError]
  );
  return (
    <WagmiConfig client={wagmiClient}>
      {!isLogin ? (
        <RainbowKitProvider appInfo={appInfo} chains={chains}>
          <RainbowKitAuth
            setOpenConnectModal={setOpenConnectModal}
            onSignStart={onSignStart}
            onSignSuccess={onSignSuccess}
            onSignError={onSignError}
          />
        </RainbowKitProvider>
      ) : null}
    </WagmiConfig>
  );
}
type RainbowKitAuthProps = {
  setOpenConnectModal: (fn: () => void) => void;
  onSignStart: () => void;
  onSignSuccess: (signature: string, message: string, pubkey: string) => void;
  onSignError: (error: Error) => void;
};
const RainbowKitAuth: React.FC<RainbowKitAuthProps> = ({
  setOpenConnectModal,
  onSignStart,
  onSignSuccess,
  onSignError,
}) => {
  const allowSignMessage = useRef(false);
  const { isLogin } = useWlUserReact();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  useEffect(() => {
    if (isLogin) {
      allowSignMessage.current = false;
    } else {
      disconnect();
    }
  }, [isLogin]);
  const { isConnected, isConnecting, address } = useAccount();
  const { signMessage, isSuccess, isError, isLoading, data, error } =
    useSignMessage({
      message: SIGN_MSG,
    });

  useEffect(() => {
    if ((isConnecting || isLoading) && onSignStart) {
      onSignStart();
    }
  }, [isConnecting, isLoading, onSignStart]);
  useEffect(() => {
    if (allowSignMessage.current && isConnected && signMessage) {
      signMessage();
    }
  }, [isConnected, signMessage]);
  useEffect(() => {
    if (isSuccess && data && address && onSignSuccess) {
      onSignSuccess(data, SIGN_MSG, address);
    }
  }, [isSuccess, data, address, onSignSuccess]);
  useEffect(() => {
    if (isError && error && onSignError) {
      onSignError(error);
    }
  }, [isError, error, onSignError]);
  const openConnectModalFn = useCallback(() => {
    allowSignMessage.current = true;
    openConnectModal();
  }, [openConnectModal]);
  useEffect(
    () => setOpenConnectModal(openConnectModalFn),
    [openConnectModalFn]
  );
  return null;
};
