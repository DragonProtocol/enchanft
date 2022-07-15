import { Box, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ScrollBox from '../components/common/ScrollBox'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

import TaskDashboard from '../components/business/creator/TaskDashboard'
import WinnerList, { TaskStatus } from '../components/business/creator/WinnerList'
import TaskTitle from '../components/business/creator/TaskTitle'
import Schedule from '../components/business/creator/Schedule'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCreator, getCreatorData } from '../features/creator'

export default function Creator() {
  const dispatch = useAppDispatch()
  const { status, taskData, winnerListData, taskTitleData, scheduleData } = useAppSelector(selectCreator)

  useEffect(() => {
    dispatch(getCreatorData())
  }, [])

  return (
    <CommunityWrapper>
      <ScrollBox>
        <ContentBox>
          <LeftBox>
            <TaskDashboard participants={1234132} winners={431} completionRate={32} />
            <WinnerList taskStatus={TaskStatus.BEGIN} winnersNum={10} />
          </LeftBox>
          <RightBox>
            <TaskTitle />
            <Schedule
              schedules={[
                {
                  title: 'Task submit date',
                  date: '2022-09-01',
                  done: true,
                },
                {
                  title: 'Task start',
                  date: '2022-09-01',
                  done: true,
                },
                {
                  title: 'Task end',
                  date: '2022-09-09',
                  done: false,
                },
              ]}
            />
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
