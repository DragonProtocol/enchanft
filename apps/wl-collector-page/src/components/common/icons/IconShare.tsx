/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 00:55:02
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as ShareIcon } from './svgs/share.svg';

interface Props {
  size?: string;
  opacity?: number;
}
const IconShare: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <ShareIcon width={size} height={size} opacity={opacity} />;
};

export default IconShare;
