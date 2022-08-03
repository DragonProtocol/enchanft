/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-03 16:05:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 18:17:21
 * @Description: file description
 */
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type TimeCountdownProps = HTMLAttributes<HTMLDivElement> & {
  timestamp: number
}
const TimeCountdown: React.FC<TimeCountdownProps> = ({ timestamp, ...otherProps }: TimeCountdownProps) => {
  const [countdownData, setCountdownData] = useState({
    distance: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  })
  const countdownDataIntervalRef = useRef<any>(null)
  useEffect(() => {
    if (countdownDataIntervalRef.current && countdownData.distance <= 0) {
      clearInterval(countdownDataIntervalRef.current)
    }
    countdownDataIntervalRef.current = setInterval(() => {
      const distance = timestamp - Date.now()
      const distanceDay = Math.floor(distance / (1000 * 60 * 60 * 24))
      const distanceHour = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const distanceMinute = Math.floor((distance / (1000 * 60)) % 60)
      const distanceSecond = Math.floor((distance / 1000) % 60)
      setCountdownData({
        distance: distance,
        day: distanceDay,
        hour: distanceHour,
        minute: distanceMinute,
        second: distanceSecond,
      })
    }, 1000)
    return () => {
      clearInterval(countdownDataIntervalRef.current)
    }
  }, [timestamp])
  // 时间补0
  const timeZero = (time: number) => {
    if (time < 0) {
      return time
    }
    return time < 10 ? `0${time}` : time
  }
  const showDay = timeZero(countdownData.day)
  const showHour = timeZero(countdownData.hour)
  const showMinute = timeZero(countdownData.minute)
  const showSecond = timeZero(countdownData.second)
  return (
    <TimeCountdownWrapper {...otherProps}>
      <CountdownItem>{showDay}</CountdownItem>
      <CountdownItem>{showHour}</CountdownItem>
      <CountdownItem>{showMinute}</CountdownItem>
      <CountdownItem>{showSecond}</CountdownItem>
    </TimeCountdownWrapper>
  )
}
export default TimeCountdown
const TimeCountdownWrapper = styled.div`
  display: flex;
  gap: 10px;
`
const CountdownItem = styled.div`
  width: 24px;
  height: 24px;
  background: #333333;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`
