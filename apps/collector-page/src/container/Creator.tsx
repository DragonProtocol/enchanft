import { Box, Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import ScrollBox from '../components/common/ScrollBox'

import TaskDashboard from '../components/business/creator/TaskDashboard'
import WinnerList, { TaskStatus } from '../components/business/creator/WinnerList'
import TaskTitle from '../components/business/creator/TaskTitle'
import Schedule from '../components/business/creator/Schedule'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCreator, getCreatorDashboardData, saveWinnersData, resetData } from '../features/creator'
import { useParams } from 'react-router-dom'
import { downloadWinner } from '../services/api/creator'
import usePermissions from '../hooks/usePermissons'

export default function Creator() {
  const { taskId } = useParams()
  const dispatch = useAppDispatch()
  const { status, participants, winners, whitelistSaved, winnerList, taskInfo, scheduleInfo, pickedWhiteList } =
    useAppSelector(selectCreator)
  const { isCreator } = usePermissions()

  useEffect(() => {
    if (isCreator) dispatch(getCreatorDashboardData({ taskId: Number(taskId) }))
    return () => {
      dispatch(resetData())
    }
  }, [taskId, isCreator])

  const saveWinners = useCallback(
    (list: Array<number>) => {
      if (isCreator) dispatch(saveWinnersData({ taskId: Number(taskId), winners: list }))
    },
    [taskId, isCreator],
  )

  const downloadWinners = useCallback(() => {
    if (!taskId) return
    downloadWinner(taskId)
  }, [taskId])

  if (!isCreator) {
    // TODO UI
    return <CommunityWrapper>Not allowed</CommunityWrapper>
  }

  return (
    <CommunityWrapper>
      <ScrollBox>
        <ContentBox>
          <LeftBox>
            <TaskDashboard
              participants={participants}
              winners={winners}
              completionRate={participants == 0 ? '0.00' : ((winners * 100) / participants).toFixed(2)}
            />
            <WinnerList
              winnerNum={taskInfo?.winnerNum || 0}
              whitelistSaved={whitelistSaved}
              winnerList={winnerList}
              pickedWhiteList={pickedWhiteList}
              schedules={scheduleInfo}
              uploadSelected={(ids: Array<number>) => {
                saveWinners(ids)
              }}
              downloadWinners={downloadWinners}
            />
          </LeftBox>
          <RightBox>
            <TaskTitle info={taskInfo} />
            <Schedule schedules={scheduleInfo} />
          </RightBox>
        </ContentBox>
      </ScrollBox>
    </CommunityWrapper>
  )
}

const CommunityWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const ContentBox = styled.div`
  margin: 20px 0;
  display: flex;

  & h3 {
    margin: 0;
  }
`

const LeftBox = styled.div`
  width: 760px;
`

const RightBox = styled.div`
  margin-left: 20px;
`
