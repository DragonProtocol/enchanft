import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'



export default function Ref() {
  const { refCode } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if (!refCode) return
    // console.log('ref code: ', refCode, window.atob(refCode))
    const refInfo: RefInfo = JSON.parse(window.atob(refCode))
    console.log('ref info: ', refInfo)
    saveRefInfo(refInfo)
    switch (refInfo.type) {
      case REF_TYPE.TAKE_TASK:
        navigate('/task/' + refInfo.data.taskID)
        break;
    }
  }, [refCode])

  return (
    <div>you accept invite to { } from user { }</div>
  )
}

export const saveRefInfo = (info: RefInfo) => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + info.type
  switch (info.type) {
    case REF_TYPE.TAKE_TASK:
      infoKey = infoKey + ':' + info.data.taskID
      break;
  }
  localStorage.setItem(infoKey, JSON.stringify(info))
}

export const loadRefInfo = (type: REF_TYPE, filter: string): RefInfo | null => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + type
  switch (type) {
    case REF_TYPE.TAKE_TASK:
      infoKey = infoKey + ':' + filter
      break;
  }
  const info = localStorage.getItem(infoKey)
  return info ? JSON.parse(info) : null
}

export const removeRefInfo = (type: REF_TYPE, filter: string) => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + type
  switch (type) {
    case REF_TYPE.TAKE_TASK:
      infoKey = infoKey + ':' + filter
      break;
  }
  return localStorage.removeItem(infoKey)
}

export interface RefInfo {
  referrerId: number,
  type: REF_TYPE,
  data: TakeTaskData
}

export enum REF_TYPE {
  TAKE_TASK = 'takeTask',
  TURN_ON_NOTIFICATION = 'turnOnNotification',
}

const EXAMPLE_REF_INFO: RefInfo = {
  referrerId: 2,
  type: REF_TYPE.TAKE_TASK,
  data: { taskID: 1 }
}

export interface TakeTaskData {
  taskID: number
}

const LOCAL_STORAGE_KEY_PREFIX = 'ref:'