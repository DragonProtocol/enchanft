/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 13:28:22
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as MetamaskIcon } from './svgs/metamask.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconMetamask: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <MetamaskIcon width={size} height={size} opacity={opacity} />
}
export default IconMetamask
