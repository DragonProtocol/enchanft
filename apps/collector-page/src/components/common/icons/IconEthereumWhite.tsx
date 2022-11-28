/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 13:34:24
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 00:53:34
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as EthLogoIcon } from './svgs/ethereum_eth_logo_white.svg';

interface Props {
  size?: string;
  opacity?: number;
}
const IconEthereumWhite: React.FC = ({
  size = '1.5rem',
  opacity = 1,
}: Props) => {
  return <EthLogoIcon width={size} height={size} opacity={opacity} />;
};
export default IconEthereumWhite;
