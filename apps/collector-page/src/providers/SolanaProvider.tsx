/*
 * @Author:
 * @Date: 2022-07-01 16:32:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-05 12:10:20
 * @Description: solana provider
 */
import React, { FC, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { IS_PROD } from 'constants/solana'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

type SolanaProviderProps = {
  children: any
}
const SolanaProvider: FC<SolanaProviderProps> = ({ children }: SolanaProviderProps) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = IS_PROD ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const apiUrl = useMemo(() => clusterApiUrl(network), [network])
  const endpoint = IS_PROD
    ? 'https://solana-api.syndica.io/access-token/R8uWm5ciuUVXmFaO2RpNooRI4rH41y7B1XIaJogiDNqJLvGwKbO1hgJdgbAckXHG/rpc'
    : apiUrl

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
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
export default SolanaProvider
