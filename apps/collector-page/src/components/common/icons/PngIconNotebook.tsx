/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-17 16:50:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 16:48:48
 * @Description: file description
 */
import { HTMLAttributes } from 'react'
import Icon from './pngs/notebook.png'
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string
}
const PngIconNotebook: React.FC<Props> = ({ size = '1.5rem', style, ...imgProps }) => {
  const _props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  }
  return <img src={Icon} {..._props} />
}
export default PngIconNotebook
