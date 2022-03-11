import React, { FC, useMemo } from 'react'
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
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import log from 'loglevel'

import GlobalStyle from './GlobalStyle'
import Layout from './components/Layout'

import { isProd } from './utils'
import { store } from './store/store'

require('@solana/wallet-adapter-react-ui/styles.css')

log.setLevel(isProd ? 'info' : 'trace')
log.info({ isProd })

const App: FC = () => {
  const network = isProd ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const endpoint = isProd
    ? 'https://solana-api.syndica.io/access-token/R8uWm5ciuUVXmFaO2RpNooRI4rH41y7B1XIaJogiDNqJLvGwKbO1hgJdgbAckXHG/rpc'
    : useMemo(() => clusterApiUrl(network), [network])

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
