/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 01:18:39
 * @Description: file description
 */
import { HTMLAttributes } from 'react';
import Icon from './pngs/forbidden.png';
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string;
};
const PngIconForbidden: React.FC<Props> = ({
  size = '1.5rem',
  style,
  ...imgProps
}: Props) => {
  const props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  };
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={Icon} {...props} />;
};
export default PngIconForbidden;
