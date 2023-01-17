/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-08 15:17:11
 * @Description: file description
 */
import React from 'react';
import { ReactComponent as WebsiteIcon } from './svgs/website_white.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconWebsiteWhite: React.FC<Props> = ({
  size = '1.5rem',
  opacity = 1,
}) => {
  return <WebsiteIcon width={size} height={size} opacity={opacity} />;
};
export default IconWebsiteWhite;
