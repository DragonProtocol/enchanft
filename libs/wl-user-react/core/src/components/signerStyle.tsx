/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-13 19:04:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 15:46:39
 * @Description: file description
 */
import { SignerType } from '../signer/types';
import IconTwitterWhite from './common/icons/IconTwitterWhite';
import IconDiscordWhite from './common/icons/IconDiscordWhite';
import IconMetamask from './common/icons/IconMetamask';
import IconPhantomWhite from './common/icons/IconPhantomWhite';
import IconMartian from './common/icons/IconMartian';

export type SignerStyle = {
  name: string;
  bgColor: string;
  nameColor: string;
  icon: React.ReactNode;
};
export const SignerStyleMap: { [k in SignerType]: SignerStyle } = {
  [SignerType.TWITTER]: {
    name: 'Twitter',
    bgColor: '#4D93F1',
    nameColor: '#FFFFFF',
    icon: <IconTwitterWhite />,
  },
  [SignerType.DISCORD]: {
    name: 'Discord',
    bgColor: '#5368ED',
    nameColor: '#FFFFFF',
    icon: <IconDiscordWhite />,
  },
  [SignerType.METAMASK]: {
    name: 'MetaMask',
    bgColor: '#F6851B',
    nameColor: '#FFFFFF',
    icon: <IconMetamask />,
  },
  [SignerType.PHANTOM]: {
    name: 'Phantom',
    bgColor: '#551FF4',
    nameColor: '#FFFFFF',
    icon: <IconPhantomWhite />,
  },
  [SignerType.MARTIAN]: {
    name: 'Martian',
    bgColor: '#333333',
    nameColor: '#FFFFFF',
    icon: <IconMartian />,
  },
};
