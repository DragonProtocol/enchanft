import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import { useNavigate } from 'react-router-dom'
import { ScrollBarCss } from '../../../GlobalStyle'
import { Community, Project } from '../../../types/api'

export type WhitelistItemDataType = {
  id: number
  mintUrl: string
  mintPrice: string
  mintStartTime: number
  mintEndTime: number
  mintMaxNum: number
  totalNum: number
  projectId: number
  taskId: number
  project: Project
  community: Community
}

export type WhitelistItemViewConfigType = {
  displayMint?: boolean
  disabledMint?: boolean
  loadingMint?: boolean
}

export type WhitelistItemDataViewType = {
  data: WhitelistItemDataType
  viewConfig?: WhitelistItemViewConfigType
}

export type WhitelistItemHandlesType = {
  onMint?: (task: WhitelistItemDataType) => void
}

export type WhitelistItemProps = WhitelistItemDataViewType & WhitelistItemHandlesType

const defaultViewConfig: WhitelistItemViewConfigType = {
  displayMint: false,
  disabledMint: false,
  loadingMint: false,
}

const WhitelistItem: React.FC<WhitelistItemProps> = ({ data, viewConfig, onMint }: WhitelistItemProps) => {
  const navigate = useNavigate()
  const {
    id,
    mintUrl,
    mintPrice,
    mintStartTime,
    mintEndTime,
    mintMaxNum,
    totalNum,
    projectId,
    taskId,
    project,
    community,
  } = data
  const { disabledMint, displayMint, loadingMint } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  // mint 是否关闭
  const mintClosedCheckInterval = useRef<any>(null)
  const [mintClosed, setMintClosed] = useState(false)
  useEffect(() => {
    if (!displayMint) {
      if (mintClosedCheckInterval.current) {
        clearInterval(mintClosedCheckInterval.current)
      }
      return
    }
    mintClosedCheckInterval.current = setInterval(() => {
      const now = new Date().getTime()
      if (now > mintEndTime) {
        setMintClosed(true)
        clearInterval(mintClosedCheckInterval.current)
      }
    }, 1000)
    return () => {
      clearInterval(mintStartTimeCountdownIntervalRef.current)
    }
  }, [mintEndTime, displayMint])
  // mint倒计时
  const [mintStartTimeCountdown, setMintStartTimeCountdown] = useState({
    distance: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  })
  const mintStartTimeCountdownIntervalRef = useRef<any>(null)
  useEffect(() => {
    if (!displayMint || mintClosed) {
      if (mintStartTimeCountdownIntervalRef.current) {
        clearInterval(mintStartTimeCountdownIntervalRef.current)
      }
      return
    }
    mintStartTimeCountdownIntervalRef.current = setInterval(() => {
      const distance = mintStartTime - Date.now()
      const distanceDay = Math.floor(distance / (1000 * 60 * 60 * 24))
      const distanceHour = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const distanceMinute = Math.floor((distance / (1000 * 60)) % 60)
      const distanceSecond = Math.floor((distance / 1000) % 60)
      setMintStartTimeCountdown({
        distance: distance,
        day: distanceDay,
        hour: distanceHour,
        minute: distanceMinute,
        second: distanceSecond,
      })
    }, 1000)
    return () => {
      clearInterval(mintStartTimeCountdownIntervalRef.current)
    }
  }, [mintStartTime, displayMint, mintClosed])

  // mint按钮显示文本
  let mintStartTimeCountdownText = 'MINT'
  if (displayMint) {
    if (mintClosed) {
      mintStartTimeCountdownText = 'Mint Closed'
    } else if (loadingMint) {
      mintStartTimeCountdownText = 'Loading...'
    } else if (mintStartTimeCountdown.distance > 0) {
      mintStartTimeCountdownText = 'You can mint in'
      if (mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.day}d`
      }
      if (mintStartTimeCountdown.hour > 0 || mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.hour}h`
      }
      if (mintStartTimeCountdown.minute > 0 || mintStartTimeCountdown.hour > 0 || mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.minute}m`
      }
      if (
        mintStartTimeCountdown.second > 0 ||
        mintStartTimeCountdown.minute > 0 ||
        mintStartTimeCountdown.hour > 0 ||
        mintStartTimeCountdown.day > 0
      ) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.second}s`
      }
    }
  }

  // mint 按钮状态
  const isDisabledMint = disabledMint || mintClosed || mintStartTimeCountdown.distance > 0
  // mint按钮点击事件
  const onMintClick = () => {
    // if (onMint) {
    //   onMint(data)
    // }
    window.open(mintUrl, '_blank', 'noopener,noreferrer')
  }
  return (
    <WhitelistItemWrapper onClick={() => navigate(`/community/${id}`)}>
      <ProjectImage src={project.image} />
      <WhitelistInfoBox>
        <WhitelistInfoTopBox>
          <ProjectName>{project.name}</ProjectName>
          <CommunityName>{community.name}</CommunityName>
        </WhitelistInfoTopBox>
        {displayMint && (
          <MintBtn disabled={isDisabledMint} onClick={onMintClick}>
            {mintStartTimeCountdownText}
          </MintBtn>
        )}
      </WhitelistInfoBox>
    </WhitelistItemWrapper>
  )
}
export default WhitelistItem
const WhitelistItemWrapper = styled.div`
  width: 100%;
  height: 330px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 100);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 206px;
`
const WhitelistInfoBox = styled.div`
  flex: 1;
  padding-top: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
const WhitelistInfoTopBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
const ProjectName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const CommunityName = styled.div`
  font-size: 20px;
`
const MintBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(16, 16, 16, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
  margin-top: 10px;
`
