/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 13:33:17
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as PhantomWhiteIcon } from './svgs/phantom_white.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconPhantomWhite: React.FC<Props> = ({
  size = '1.5rem',
  opacity = 1,
}) => {
  return <PhantomWhiteIcon width={size} height={size} opacity={opacity} />;
};
export default IconPhantomWhite;
