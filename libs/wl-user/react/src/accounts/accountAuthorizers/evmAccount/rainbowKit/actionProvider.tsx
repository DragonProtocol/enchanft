/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 15:29:49
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-08 19:37:44
 * @Description: file description
 */
import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
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
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SiweMessage } from 'siwe';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AuthorizerActionProviderProps,
  AuthorizerActionType,
} from '../../../account';
const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
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
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export function ActionProvider({
  loginSuccess,
  bindSuccess,
  setDisptch,
}: AuthorizerActionProviderProps) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

  // Fetch user when:
  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await fetch('/api/me');
        const json = await response.json();
        setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
      } catch (_error) {
        setAuthStatus('unauthenticated');
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    // 1. page loads
    fetchStatus();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', fetchStatus);
    return () => window.removeEventListener('focus', fetchStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch('/api/nonce');
        return await response.text();
      },

      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },

      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },

      verify: async ({ message, signature }) => {
        verifyingRef.current = true;

        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
          });

          const authenticated = Boolean(response.ok);

          if (authenticated) {
            setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
          }

          return authenticated;
        } catch (error) {
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        setAuthStatus('unauthenticated');
        await fetch('/api/logout');
      },
    });
  }, []);

  const [openConnectModal, setOpenConnectModal] = useState<() => void>(
    () => {}
  );
  const dispatch = useCallback(
    (actionType: AuthorizerActionType) => {
      switch (actionType) {
        case AuthorizerActionType.LOGIN:
          alert('rainbowKit login');
          break;
        case AuthorizerActionType.BIND:
          alert('rainbowKit bind');
          break;
      }
    },
    [openConnectModal]
  );
  useEffect(() => setDisptch(dispatch), [dispatch]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={authStatus}
      >
        <RainbowKitProvider appInfo={appInfo} chains={chains}>
          <RainbowKitAuthorizerAction
            setOpenConnectModal={setOpenConnectModal}
          />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
function RainbowKitAuthorizerAction({ setOpenConnectModal }) {
  const { openConnectModal } = useConnectModal();
  useEffect(() => setOpenConnectModal(openConnectModal), [openConnectModal]);
  return null;
}
