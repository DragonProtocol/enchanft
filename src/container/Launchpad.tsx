/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-24 12:56:30
 * @FilePath: \synft-app\src\container\LaunchpadEnchaNFT.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import UnderwayList, { LaunchpadUnderwayItemDataType } from '../components/launchpad/UnderwayList'
import UpcomingList from '../components/launchpad/UpcomingList'
import { fetchUnderwayProjects, selectAll as selectAllForUnderway } from '../features/launchpad/underwaySlice'
import { fetchUpcomingProjects, selectAll as selectAllForUpcoming } from '../features/launchpad/upcomingSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

function Launchpad() {
  const dispatch = useAppDispatch()

  const underwayList = useAppSelector(selectAllForUnderway)
  const upcomingList = useAppSelector(selectAllForUpcoming)
  useEffect(() => {
    dispatch(fetchUnderwayProjects({}))
    dispatch(fetchUpcomingProjects({}))
  }, [])
  return (
    <LaunchpadWrapper>
      <UnderwayList data={underwayList} />
      <UpcomingList data={upcomingList} />
    </LaunchpadWrapper>
  )
}

export default Launchpad

const LaunchpadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`
