import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const getTakeTaskRefLink = (referrerId:number,type:RefType,taskID:number):string =>{
  return generateRefLink(referrerId,type,{taskID:taskID})
}

const generateRefLink = (referrerId:number,type:RefType,data:RefData):string =>{
  const refCode = enRefCode({referrerId:referrerId, type:type, data:data})
  return REF_LINK_PREFIX+refCode
}

export default function Ref() {
  const { refCode } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if (!refCode) return
    // console.log('ref code: ', refCode, window.atob(refCode))
    const refInfo: RefInfo = deRefCode(refCode)
    console.log('ref info: ', refInfo)
    saveRefInfo(refInfo)
    switch (refInfo.type) {
      case RefType.TAKE_TASK:
        navigate('/task/' + (refInfo.data as TakeTaskData).taskID)
        break;
    }
  }, [refCode])

  return (
    <div>you accept invite to { } from user { }</div>
  )
}


const enRefCode = (info: RefInfo) => {
  return btoa(window.atob(JSON.stringify(info)))
}

const deRefCode = (refCode: string) => {
  return JSON.parse(window.atob(refCode))
}

const saveRefInfo = (info: RefInfo) => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + info.type
  switch (info.type) {
    case RefType.TAKE_TASK:
      infoKey = infoKey + ':' + (info.data as TakeTaskData).taskID
      break;
    case RefType.TAKE_TASK:
      infoKey = infoKey + ':' + (info.data as NotifacationRefData).communityID
      break;
  }
  localStorage.setItem(infoKey, JSON.stringify(info))
}

const loadRefInfo = (type: RefType, filter: string): RefInfo | null => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + type
  switch (type) {
    case RefType.TAKE_TASK:
      infoKey = infoKey + ':' + filter
      break;
  }
  const info = localStorage.getItem(infoKey)
  return info ? JSON.parse(info) : null
}

const removeRefInfo = (type: RefType, filter: string) => {
  let infoKey: string = LOCAL_STORAGE_KEY_PREFIX + type
  switch (type) {
    case RefType.TAKE_TASK:
      infoKey = infoKey + ':' + filter
      break;
  }
  return localStorage.removeItem(infoKey)
}

export interface RefInfo {
  referrerId: number,
  type: RefType,
  data: RefData
}

export enum RefType {
  TAKE_TASK = 'TAKE_TASK',
  TURN_ON_NOTIFICATION = 'TURN_ON_NOTIFICATION', //NOT planed yet
}

const EXAMPLE_REF_INFO: RefInfo = {
  referrerId: 2,
  type: RefType.TAKE_TASK,
  data: { taskID: 1 }
}

export type RefData = TakeTaskData | NotifacationRefData;

export interface TakeTaskData {
  taskID: number
}
export interface NotifacationRefData {
  communityID: number;
}

const LOCAL_STORAGE_KEY_PREFIX = 'ref:'
const REF_LINK_PREFIX = '/ref/'