/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-04 14:09:50
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as AlarmClockIcon } from './svgs/alarm_clock.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconAlarmClock: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <AlarmClockIcon width={size} height={size} opacity={opacity} />
}
export default IconAlarmClock
