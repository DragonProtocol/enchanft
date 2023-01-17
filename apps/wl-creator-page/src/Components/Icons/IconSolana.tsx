/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:19:51
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as SolLogoIcon } from './svgs/solana_sol_logo.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconSolana: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <SolLogoIcon width={size} height={size} opacity={opacity} />
}
export default IconSolana
