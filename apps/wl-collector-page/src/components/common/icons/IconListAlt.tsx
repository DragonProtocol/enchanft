/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 01:00:15
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as ListAltIcon } from './svgs/list_alt.svg';

interface Props {
  size?: string;
  opacity?: number;
}
const IconListAlt: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <ListAltIcon width={size} height={size} opacity={opacity} />;
};
export default IconListAlt;
