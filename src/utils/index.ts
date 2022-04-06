/**
 * Author: your name
 * Date: 2022-03-22 16:25:59
 * LastEditTime: 2022-03-24 12:13:23
 * LastEditors: your name
 * Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * FilePath: /app/src/utils/index.ts
 */
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import log from 'loglevel'

log.info({ env: process.env.NODE_ENV })

// TODO: 上生产接主网后改正
export const isProd = false // process.env.NODE_ENV === 'production'
export const logIsProd = process.env.NODE_ENV === 'production'

// explore 数据源
export const collections = isProd
  ? []
  : ['DaFBQUghKeSuuAjgZWLkZfHzVs5K8ELf1oGXKkkupwDX', 'U7KxNoZ3rNbtG5DgRYQQsjs2dWoSSLLRLjit6VXRyzR']

export function lamportsToSol(lamportsAmount: number) {
  return lamportsAmount / LAMPORTS_PER_SOL
}

export function solToLamports(solAmount: number) {
  return solAmount * LAMPORTS_PER_SOL
}
