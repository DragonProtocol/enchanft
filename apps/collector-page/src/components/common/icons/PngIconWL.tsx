/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-28 01:05:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 19:45:54
 * @Description: file description
 */
import { HTMLAttributes } from 'react';
import Icon from './pngs/wl.png';

type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string;
};
const PngIcon: React.FC<Props> = ({
  size = '1.5rem',
  style,
  ...imgProps
}: Props) => {
  const props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  };
  return <img src={Icon} {...props} />;
};
export default PngIcon;
