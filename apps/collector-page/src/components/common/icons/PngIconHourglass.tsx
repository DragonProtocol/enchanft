/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-02 15:42:18
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-02 15:42:53
 * @Description: file description
 */
import { HTMLAttributes } from 'react'
import Icon from './pngs/hourglass.png'
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string
}
const PngIcon: React.FC<Props> = ({ size = '1.5rem', style, ...imgProps }) => {
  const _props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  }
  return <img src={Icon} {..._props} />
}
export default PngIcon
