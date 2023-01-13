/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:29:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 18:32:46
 * @Description: file description
 */
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  useConnectModal,
  darkTheme,
  lightTheme,
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
import { useCallback, useEffect, useRef } from 'react';
import { AccountType, login, bindAccount } from '../../../api';
import {
  AuthorizerActionProcessStatus,
  AuthorizerActionProviderComponentProps,
} from '../../authorizer';
import { SIGN_MSG } from '../../../constants';
import { useWlUserReact } from '../../../hooks';

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
type Props = AuthorizerActionProviderComponentProps;
const ActionProviderComponent: React.FC<Props> = function ({
  onLoginProcess,
  onLoginSuccess,
  onLoginError,
  onBindProcess,
  onBindSuccess,
  onBindError,
  setLoginAction,
  setBindAction,
}: Props) {
  const currentActionType = useRef<CurrentActionType>(CurrentActionType.NONE);
  const { user, theme } = useWlUserReact();

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
          signature,
          payload: message,
          pubkey,
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
          .catch((error: Error) => {
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
          signature,
          payload: message,
          pubkey,
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
          .catch((error: Error) => {
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
      user.token,
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
    [onLoginProcess, onLoginError, onBindProcess, onBindError]
  );
  const rainbowkitTheme = theme === 'dark' ? darkTheme() : lightTheme();
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={appInfo}
        chains={chains}
        theme={rainbowkitTheme}
      >
        <RainbowKitAuth
          setOpenConnectModal={setOpenConnectModal}
          onSignStart={onSignStart}
          onSignSuccess={onSignSuccess}
          onSignError={onSignError}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default ActionProviderComponent;
type RainbowKitAuthProps = {
  setOpenConnectModal: (fn: () => void) => void;
  onSignStart: () => void;
  onSignSuccess: (signature: string, message: string, pubkey: string) => void;
  onSignError: (error: Error) => void;
};
const RainbowKitAuth: React.FC<RainbowKitAuthProps> = function ({
  setOpenConnectModal,
  onSignStart,
  onSignSuccess,
  onSignError,
}: RainbowKitAuthProps) {
  const { isLogin } = useWlUserReact();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting, address } = useAccount();
  const {
    signMessage,
    isSuccess: isSignSuccess,
    isError: isSignError,
    isLoading: isSignLoading,
    data: signData,
    error: signError,
    reset: resetSign,
  } = useSignMessage({
    message: SIGN_MSG,
  });
  const handleReset = useCallback(() => {
    if (resetSign) resetSign();
    if (disconnect) disconnect();
  }, [resetSign, disconnect]);
  useEffect(() => {
    if (isSignLoading) {
      onSignStart();
    } else if (isConnected) {
      if (!isSignSuccess && !isSignError) {
        signMessage();
      } else if (isSignSuccess) {
        if (signData && address && onSignSuccess)
          onSignSuccess(signData, SIGN_MSG, address);
      } else if (isSignError) {
        if (signError && onSignError && handleReset) {
          handleReset();
          onSignError(signError);
        }
      }
    }
  }, [
    isConnected,
    isConnecting,
    isSignLoading,
    isSignSuccess,
    isSignError,
    signError,
    signData,
    address,
    onSignError,
    onSignStart,
    signMessage,
    onSignSuccess,
    handleReset,
  ]);
  useEffect(() => {
    handleReset();
  }, [isLogin, handleReset]);
  useEffect(
    () => openConnectModal && setOpenConnectModal(openConnectModal),
    [openConnectModal, setOpenConnectModal]
  );
  return null;
};
