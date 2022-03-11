import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { FC, useMemo } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import GlobalStyle from './GlobalStyle'
import Layout from './components/Layout'
import { store } from './store/store'


require('@solana/wallet-adapter-react-ui/styles.css')

const App: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const endpoint =
    'https://solana-api.syndica.io/access-token/R8uWm5ciuUVXmFaO2RpNooRI4rH41y7B1XIaJogiDNqJLvGwKbO1hgJdgbAckXHG/rpc'

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>
          <Provider store={store}>
            <GlobalStyle />
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
