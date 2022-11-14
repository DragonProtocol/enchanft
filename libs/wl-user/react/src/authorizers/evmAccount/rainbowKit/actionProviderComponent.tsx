/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:29:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-13 12:39:11
 * @Description: file description
 */
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
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
import { AccountType, login, bindAccount } from '../../../api';
import { useWlUserReact } from '../../../provider';
import {
  AuthorizerActionProcessStatus,
  AuthorizerActionProviderComponentProps,
} from '../../authorizer';
import { SIGN_MSG } from '../../../constants';
const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [publicProvider()]
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
      // ledgerWallet({ chains }),
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
}: AuthorizerActionProviderComponentProps) {
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
  const onSignStart = useCallback(() => {
    if (currentActionType.current === CurrentActionType.LOGIN) {
      onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    } else if (currentActionType.current === CurrentActionType.BIND) {
      onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    }
  }, [onLoginProcess, onBindProcess]);
  const onSignSuccess = useCallback(
    (signature: string, message: string, pubkey: string) => {
      if (currentActionType.current === CurrentActionType.LOGIN) {
        onLoginProcess(AuthorizerActionProcessStatus.API_PENDING);
        login({
          type: AccountType.EVM,
          signature: signature,
          payload: message,
          pubkey: pubkey,
        })
          .then((result) => {
            const authenticated = !!result.data.token;
            if (authenticated) {
              onLoginProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onLoginSuccess(result.data);
            } else {
              onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onLoginError(new Error('Login Failed'));
            }
          })
          .catch((error) => {
            onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
            onLoginError(error);
          })
          .finally(() => {
            currentActionType.current = CurrentActionType.NONE;
          });
      } else if (currentActionType.current === CurrentActionType.BIND) {
        onBindProcess(AuthorizerActionProcessStatus.API_PENDING);
        bindAccount(user.token, {
          type: AccountType.EVM,
          signature: signature,
          payload: message,
          pubkey: pubkey,
        })
          .then((result) => {
            const authenticated = !!result.data;
            if (authenticated) {
              onBindProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onBindSuccess(result.data);
            } else {
              onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
              onBindError(new Error('Bind Failed'));
            }
          })
          .catch((error) => {
            onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
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
      if (currentActionType.current === CurrentActionType.LOGIN) {
        onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
        onLoginError(error);
      } else if (currentActionType.current === CurrentActionType.BIND) {
        onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
        onBindError(error);
      }
    },
    [onLoginError, onBindError]
  );
  const [renderRainbowKitProvider, setRenderRainbowKitProvider] =
    useState(false);
  useEffect(() => {
    setRenderRainbowKitProvider(!isLogin);
  }, [isLogin]);
  return (
    <WagmiConfig client={wagmiClient}>
      {renderRainbowKitProvider ? (
        <RainbowKitProvider appInfo={appInfo} chains={chains}>
          <RainbowKitAuth
            setRenderRainbowKitProvider={setRenderRainbowKitProvider}
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
  setRenderRainbowKitProvider: (bool: boolean) => void;
  setOpenConnectModal: (fn: () => void) => void;
  onSignStart: () => void;
  onSignSuccess: (signature: string, message: string, pubkey: string) => void;
  onSignError: (error: Error) => void;
};
const RainbowKitAuth: React.FC<RainbowKitAuthProps> = ({
  setRenderRainbowKitProvider,
  setOpenConnectModal,
  onSignStart,
  onSignSuccess,
  onSignError,
}) => {
  const allowSignMessage = useRef(false);
  const { isLogin } = useWlUserReact();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const closeConnectModal = useCallback(() => {
    disconnect();
    setRenderRainbowKitProvider(false);
    setTimeout(() => {
      setRenderRainbowKitProvider(true);
    }, 50);
  }, [disconnect, setRenderRainbowKitProvider]);
  useEffect(() => {
    if (isLogin) {
      allowSignMessage.current = false;
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
      closeConnectModal();
      onSignError(error);
    }
  }, [isError, error, onSignError, setRenderRainbowKitProvider]);
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
