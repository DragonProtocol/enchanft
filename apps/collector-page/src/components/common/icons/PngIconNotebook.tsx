/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-17 16:50:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 19:45:34
 * @Description: file description
 */
import { HTMLAttributes } from 'react';
import Icon from './pngs/notebook.png';

type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string;
};
const PngIconNotebook: React.FC<Props> = ({
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
export default PngIconNotebook;
