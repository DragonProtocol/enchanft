/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 00:59:52
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as InputSearchIcon } from './svgs/input_search.svg';

interface Props {
  size?: string;
  opacity?: number;
}
const IconInputSearch: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <InputSearchIcon width={size} height={size} opacity={opacity} />;
};
export default IconInputSearch;
