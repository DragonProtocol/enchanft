/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-13 19:04:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 19:57:56
 * @Description: file description
 */
import { SignerType } from '../signer';
export type SignerButtonStyle = {
  name: string;
  bgColor: string;
  nameColor: string;
  icon: React.ReactNode;
};
export const SignerButtonStyleMap: { [k in SignerType]: SignerButtonStyle } = {
  [SignerType.TWITTER]: {
    name: 'Twitter',
    bgColor: '',
    nameColor: '',
    icon: '',
  },
  [SignerType.DISCORD]: {
    name: 'Discord',
    bgColor: '',
    nameColor: '',
    icon: '',
  },
  [SignerType.METAMASK]: {
    name: 'MetaMask',
    bgColor: '',
    nameColor: '',
    icon: '',
  },
  [SignerType.PHANTOM]: {
    name: 'Phantom',
    bgColor: '',
    nameColor: '',
    icon: '',
  },
  [SignerType.MARTIAN]: {
    name: 'Martian',
    bgColor: '',
    nameColor: '',
    icon: '',
  },
};
