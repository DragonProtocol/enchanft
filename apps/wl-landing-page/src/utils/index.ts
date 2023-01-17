import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import log from 'loglevel';

log.info({ env: process.env.NODE_ENV });

// TODO: 上生产接主网后改正
export const isProd = false; // process.env.NODE_ENV === 'production'
export const logIsProd = process.env.NODE_ENV === 'production';

// explore 数据源
export const collections = isProd
  ? []
  : [
      'DaFBQUghKeSuuAjgZWLkZfHzVs5K8ELf1oGXKkkupwDX',
      'U7KxNoZ3rNbtG5DgRYQQsjs2dWoSSLLRLjit6VXRyzR',
    ];

export function lamportsToSol(lamportsAmount: number) {
  return lamportsAmount / LAMPORTS_PER_SOL;
}

export function solToLamports(solAmount: number) {
  return solAmount * LAMPORTS_PER_SOL;
}

export async function sendWalletTrans(
  tx: Transaction,
  connection: Connection,
  wallet: WalletContextState
) {
  const signature = await wallet.sendTransaction(tx, connection);
  const result = await connection.confirmTransaction(signature, 'processed');
  // const latestBlockHash = await connection.getLatestBlockhash()
  // const result = await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature,
  // })
  console.log(result);
}

export * from './metadata';
