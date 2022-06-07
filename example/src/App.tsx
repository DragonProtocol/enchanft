import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

import SynftContract from "@jsrsc/synft-js";
import {
  Provider as SynftProvider,
  useSynftContract,
} from "@jsrsc/synft-js-react";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  const connection = useMemo(
    () => new Connection(endpoint, { commitment: "confirmed" }),
    [endpoint]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <SynftProvider>
            <Demo />
          </SynftProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Demo() {
  const { connection } = useConnection();
  const wallet = useWallet();
  // const [synftContract, setSynftContract] = useState<SynftContract>();

  // useEffect(() => {
  //   const instance = new SynftContract(connection);
  //   setSynftContract(instance);
  // }, [connection]);
  const { synftContract } = useSynftContract();

  const copyNFT = useCallback(async () => {
    const owner = wallet.publicKey;
    console.log(owner);
    if (!owner || !synftContract) return;
    const mint = new PublicKey("4ujSR37Xwqck7goo5Uv8rBokAJXiD7beYktjH59PzN5H");
    const copyNFTInstruction = await synftContract.copyNFTInstruction(
      owner,
      mint,
      {
        name: "45",
        symbol: "synft",
        metadataUri:
          "https://www.arweave.net/10MIAEz-HeHmOjrcy8j8ATrUX78rsTzpiddLn9GLSNo?ext=png",
      }
    );
    const tx = new Transaction().add(copyNFTInstruction);
    const signature = await wallet.sendTransaction(tx, connection);
    const latestBlockHash = await connection.getLatestBlockhash();
    // const result = await connection.confirmTransaction(signature, "processed");
    const result = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    console.log(result);
  }, [wallet, connection, synftContract]);

  return (
    <div>
      Demo <button onClick={copyNFT}>copyNFT</button>
    </div>
  );
}

export default App;
