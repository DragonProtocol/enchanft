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

export default function Creator() {
  const { taskId } = useParams()
  const dispatch = useAppDispatch()
  const { status, participants, winners, whitelistSaved, winnerList, taskInfo, scheduleInfo } =
    useAppSelector(selectCreator)

  useEffect(() => {
    dispatch(getCreatorDashboardData({ taskId: Number(taskId) }))
    return () => {
      dispatch(resetData())
    }
  }, [taskId])

  const saveWinners = useCallback(
    (list: Array<number>) => {
      dispatch(saveWinnersData({ taskId: Number(taskId), winners: list }))
    },
    [taskId],
  )

  const downloadWinners = useCallback(() => {
    if (!taskId) return
    downloadWinner(taskId)
  }, [taskId])

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
              winnerNum={taskInfo?.whitelistTotalNum || 0}
              whitelistSaved={whitelistSaved}
              winnerList={winnerList}
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
  margin: 20px 132px;
  display: flex;

  & div.box {
    border: 2px solid rgba(0, 0, 0, 1);
    border-radius: 10px;
    line-height: 20px;
    padding: 16px 25px;
    box-sizing: border-box;
  }

  & h3 {
    margin: 0;
    font-size: 18px;
  }
`

const LeftBox = styled.div`
  width: 736px;
`

const RightBox = styled.div`
  margin-left: 20px;
`
