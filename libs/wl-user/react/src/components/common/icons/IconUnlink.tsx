/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 16:26:28
 * @Description: file description
 */
import { ReactComponent as UnlinkIcon } from './svgs/unlink.svg';

interface Props {
  size?: string;
  opacity?: number;
}
function IconUnlink({ size = '1.5rem', opacity = 1 }: Props) {
  return <UnlinkIcon width={size} height={size} opacity={opacity} />;
}
export default IconUnlink;
