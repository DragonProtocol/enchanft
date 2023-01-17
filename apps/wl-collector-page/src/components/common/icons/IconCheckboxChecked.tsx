/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:36:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:18:06
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as CheckboxCheckedIcon } from './svgs/checkbox_checked.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconCheckboxChecked: React.FC<Props> = ({
  size = '1.5rem',
  opacity = 1,
}) => {
  return <CheckboxCheckedIcon width={size} height={size} opacity={opacity} />;
};
export default IconCheckboxChecked;
