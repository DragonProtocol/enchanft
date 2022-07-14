import { Box, Container } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import ScrollBox from '../components/common/ScrollBox'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'

export default function Creator() {
  return (
    <CommunityWrapper>
      <ScrollBox>
        <ContentBox>
          <LeftBox>
            <div className="box dashboard">
              <h3>Task Dashboard</h3>
              <div className="cards">
                <div>
                  <p>
                    <PeopleOutlineIcon />
                    Participants
                  </p>
                  <p className="num">4,132,321</p>
                </div>
                <div>
                  <p>
                    <PeopleOutlineIcon />
                    Participants
                  </p>
                  <p className="num">4,132,321</p>
                </div>
                <div>
                  <p>
                    <PeopleOutlineIcon />
                    Participants
                  </p>
                  <p className="num">4,132,321</p>
                </div>
              </div>
            </div>
            <div className="box winner-list">
              <h3>Winner List</h3>
              <div className="list">
                {new Array(20).fill('').map((item, idx) => {
                  return (
                    <div key={idx}>
                      <span style={{ width: '20px' }}>{idx}</span>
                      <span>
                        <img src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk?ext=jpeg" alt="" />
                      </span>
                      <span>MK·D·Luffy</span>
                      <span>3112ASdPyfQFAvoyatxRdUr..wN3TrWzxiBia6UdqA</span>
                      <span>2021-12-12 21:21</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </LeftBox>
          <RightBox>
            <div className="box task-title">
              <h3>task title</h3>
              <div>
                <p>Whitelist-Oriented Task</p>
                <p>2022/6/22——2022/7/22</p>
                <p>Whitelist-Oriented Task</p>
                <p>
                  <span
                    style={{
                      display: 'inline-block',
                      height: '10px',
                      width: '10px',
                      background: '#000',
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  ></span>
                  Whitelist-Oriented Task
                </p>
                <p>Whitelist-Oriented Task</p>
                <p>Whitelist-Oriented Task</p>
                <p>Whitelist-Oriented Task</p>
              </div>
            </div>
            <div className="box schedule">
              <h3>Schedule</h3>
              <Timeline
                sx={{
                  mx: 0,
                  p: 0,
                }}
              >
                {new Array(7).fill('').map((item, idx) => (
                  <TimelineItem
                    key={idx}
                    sx={{
                      ':before': {
                        content: 'none',
                      },
                    }}
                  >
                    <TimelineSeparator>
                      <TimelineDot
                        variant={idx % 2 === 0 ? 'filled' : 'outlined'}
                        sx={{
                          borderColor: '#222222',
                          backgroundColor: idx % 2 === 0 ? '#222222' : '',
                        }}
                      />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <p style={{ margin: '0px' }}>{idx}</p>
                      <p>fdasfsadf</p>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
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

  .dashboard {
    height: 239px;

    & > .cards {
      display: flex;
      margin-top: 22px;
      justify-content: space-between;
      & > div {
        width: 217px;
        height: 140px;
        border-radius: 10px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
        text-align: center;
        padding: 20px 35px;
        box-sizing: border-box;
        & p {
          height: 29px;
          color: rgba(16, 16, 16, 100);
          font-size: 20px;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        & .num {
          width: 125px;
          height: 40px;
          color: rgba(16, 16, 16, 100);
          font-size: 28px;
          width: initial;
          margin-top: 28px;
          display: block;
        }
      }
    }
  }
  .winner-list {
    margin-top: 25px;

    & .list {
      & > div {
        margin-top: 20px;
        display: flex;

        & img {
          width: 40px;
        }

        & span {
          font-size: 16px;
          display: flex;
          align-items: center;
          margin-right: 15px;
          &:last-child {
            font-size: 14px;
            margin: 0px;
          }
        }
      }
    }
  }
`

const RightBox = styled.div`
  margin-left: 20px;
  .task-title {
    width: 421px;
    height: 370px;
    line-height: 20px;
    border-radius: 10px;
    font-size: 14px;
  }
  .schedule {
    margin-top: 20px;
  }
`
