/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-02 10:41:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-02 11:47:32
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ButtonBase, { ButtonPrimary, ButtonProps } from '../../common/button/ButtonBase'

export type TaskMintButtonProps = ButtonProps & {
  startTimestamp: number
}

const TaskMintButton: React.FC<TaskMintButtonProps> = ({
  startTimestamp,
  disabled,
  ...btnOtherProps
}: TaskMintButtonProps) => {
  const [mintTimeCountdown, setMintTimeCountdown] = useState({
    distance: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  })
  const mintTimeCountdownIntervalRef = useRef<any>(null)
  useEffect(() => {
    mintTimeCountdownIntervalRef.current = setInterval(() => {
      const distance = startTimestamp - Date.now()
      const distanceDay = Math.floor(distance / (1000 * 60 * 60 * 24))
      const distanceHour = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const distanceMinute = Math.floor((distance / (1000 * 60)) % 60)
      const distanceSecond = Math.floor((distance / 1000) % 60)
      setMintTimeCountdown({
        distance: distance,
        day: distanceDay,
        hour: distanceHour,
        minute: distanceMinute,
        second: distanceSecond,
      })
      if (distance === 0) clearInterval(mintTimeCountdownIntervalRef.current)
    }, 1000)
    return () => {
      clearInterval(mintTimeCountdownIntervalRef.current)
    }
  }, [startTimestamp])

  let mintText = 'MINT'
  if (mintTimeCountdown.distance > 0) {
    mintText = 'You can mint in'
    if (mintTimeCountdown.day > 0) {
      mintText += ` ${mintTimeCountdown.day}d`
    }
    if (mintTimeCountdown.hour > 0 || mintTimeCountdown.day > 0) {
      mintText += ` ${mintTimeCountdown.hour}h`
    }
    if (mintTimeCountdown.minute > 0 || mintTimeCountdown.hour > 0 || mintTimeCountdown.day > 0) {
      mintText += ` ${mintTimeCountdown.minute}m`
    }
    if (
      mintTimeCountdown.second > 0 ||
      mintTimeCountdown.minute > 0 ||
      mintTimeCountdown.hour > 0 ||
      mintTimeCountdown.day > 0
    ) {
      mintText += ` ${mintTimeCountdown.second}s`
    }
  }
  const isDisabledMint = disabled || mintTimeCountdown.distance > 0
  return (
    <TaskMintButtonWrapper disabled={isDisabledMint} {...btnOtherProps}>
      {mintText}
    </TaskMintButtonWrapper>
  )
}
export default TaskMintButton
const TaskMintButtonWrapper = styled(ButtonBase)`
  width: 100%;
  background-color: #e07031;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #ffffff;
`
