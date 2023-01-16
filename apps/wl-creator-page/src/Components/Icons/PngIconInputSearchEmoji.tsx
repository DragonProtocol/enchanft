/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 16:46:30
 * @Description: file description
 */
import { HTMLAttributes } from 'react'
import Icon from './pngs/input_search_emoji.png'
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string
}
const PngIconInputSearchEmoji: React.FC<Props> = ({ size = '1.5rem', style, ...imgProps }) => {
  const _props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  }
  return <img src={Icon} {..._props} />
}
export default PngIconInputSearchEmoji
