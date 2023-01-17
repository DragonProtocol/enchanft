/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 14:43:43
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as CloseIcon } from './svgs/close.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconClose: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CloseIcon width={size} height={size} opacity={opacity} />;
};

export default IconClose;
