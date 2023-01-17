/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:16:35
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as DiscordIcon } from './svgs/discord.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconDiscord: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <DiscordIcon width={size} height={size} opacity={opacity} />
}

export default IconDiscord
