/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:09:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-01 18:11:41
 * @Description: solana 相关工具方法
 */
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'

export function lamportsToSol(lamportsAmount: number) {
  return lamportsAmount / LAMPORTS_PER_SOL
}

export function solToLamports(solAmount: number) {
  return solAmount * LAMPORTS_PER_SOL
}

export async function sendWalletTrans(tx: Transaction, connection: Connection, wallet: WalletContextState) {
  const signature = await wallet.sendTransaction(tx, connection)
  const result = await connection.confirmTransaction(signature, 'processed')
  // const latestBlockHash = await connection.getLatestBlockhash()
  // const result = await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature,
  // })
  console.log(result)
}

export function sortPubKey(key: string) {
  return key.slice(0, 4) + '..' + key.slice(-4)
}
