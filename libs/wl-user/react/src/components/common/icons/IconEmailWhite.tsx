/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 18:27:14
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as EmailWhiteIcon } from './svgs/email_white.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconEmailWhite: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <EmailWhiteIcon width={size} height={size} opacity={opacity} />
}
export default IconEmailWhite
