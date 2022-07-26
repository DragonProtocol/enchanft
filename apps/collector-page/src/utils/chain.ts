/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-26 13:14:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 13:30:11
 * @Description: file description
 */

export enum ChainType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  UNKNOWN = 'UNKNOWN',
}
export enum ChainIds {
  eth = 1,
  solana = -1,
}
export type Chain = {
  chainId: ChainIds
  name: string
  unit: string
  type: ChainType
}
export const chainMap: { [key in ChainIds]: Chain } = {
  [ChainIds.eth]: {
    chainId: ChainIds.eth,
    name: 'Ethereum',
    unit: 'ETH',
    type: ChainType.EVM,
  },
  [ChainIds.solana]: {
    chainId: ChainIds.solana,
    name: 'Solana',
    unit: 'SOL',
    type: ChainType.SOLANA,
  },
}

export const getChainInfo = (chainId: number): Chain => {
  return chainMap[chainId]
}
export const getChainType = (chainId: number): ChainType => {
  return chainMap[chainId]?.type || ChainType.UNKNOWN
}
