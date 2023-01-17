/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 18:23:57
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as DiscordWhiteIcon } from './svgs/discord_white.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconDiscordWhite: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <DiscordWhiteIcon width={size} height={size} opacity={opacity} />
}

export default IconDiscordWhite
