/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 10:14:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-22 11:01:51
 * @Description: file description
 */
export enum ChainIds {
  eth = 1,
  solana = -1,
}
export type Chain = {
  chainId: ChainIds
  name: string
  unit: string
}
export const chainMap: { [key in ChainIds]: Chain } = {
  [ChainIds.eth]: {
    chainId: ChainIds.eth,
    name: 'Ethereum',
    unit: 'ETH',
  },
  [ChainIds.solana]: {
    chainId: ChainIds.solana,
    name: 'Solana',
    unit: 'SOL',
  },
}
