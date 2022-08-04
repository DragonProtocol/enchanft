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
    <WhitelistItemWrapper onClick={() => navigate(`/${project.slug}/${taskId}`)}>
      <ProjectImage src={project.image} />
      <WhitelistInfoBox>
        <ProjectName>{project.name}</ProjectName>
        <CommunityName>{community.name}</CommunityName>
        {displayMint && (
          <MintBtn disabled={isDisabledMint} onClick={onMintClick}>
            {mintStartTimeCountdownText}
          </MintBtn>
        )}
        {mintClosed && <MintClosedBox>{'Mint Closed'}</MintClosedBox>}
      </WhitelistInfoBox>
    </WhitelistItemWrapper>
  )
}
export default WhitelistItem
const WhitelistItemWrapper = styled.div`
  width: 100%;
  height: 406px;
  background: #ffffff;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 265px;
  object-fit: cover;
`
const WhitelistInfoBox = styled.div`
  flex: 1;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const CommunityName = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
`
const MintBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  background: #3dd606;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;

  color: #ffffff;
`
const MintClosedBox = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 34, 34, 0.1);
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #ff2222;
`
