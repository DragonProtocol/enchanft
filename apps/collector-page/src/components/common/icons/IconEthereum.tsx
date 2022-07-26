/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 13:34:24
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-22 15:57:45
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as EthLogoIcon } from './svgs/ethereum_eth_logo.svg'
interface Props {
  size?: string
}
export const IconEthereum: React.FC = ({ size = '1.5rem' }: Props) => {
  return <EthLogoIcon width={size} height={size} />
}
