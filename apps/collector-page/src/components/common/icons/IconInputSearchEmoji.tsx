/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-09 17:03:15
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as InputSearchEmojiIcon } from './svgs/input_search_emoji.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconInputSearchEmoji: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <InputSearchEmojiIcon width={size} height={size} opacity={opacity} />
}
export default IconInputSearchEmoji
