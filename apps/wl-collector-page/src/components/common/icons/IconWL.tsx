/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-01 17:07:33
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as Icon } from './svgs/wl.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconWL: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <Icon width={size} height={size} opacity={opacity} />;
};

export default IconWL;
