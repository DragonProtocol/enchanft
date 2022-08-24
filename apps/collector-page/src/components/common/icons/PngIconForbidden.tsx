/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 17:15:19
 * @Description: file description
 */
import { HTMLAttributes } from 'react'
import Icon from './pngs/forbidden.png'
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string
}
const PngIconForbidden: React.FC<Props> = ({ size = '1.5rem', style, ...imgProps }) => {
  const _props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  }
  return <img src={Icon} {..._props} />
}
export default PngIconForbidden
