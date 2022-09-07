import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import { useNavigate } from 'react-router-dom'
import { ScrollBarCss } from '../../../GlobalStyle'
import { Community, Project, RewardData, RewardType } from '../../../types/entities'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import CardItemBox from '../../common/card/CardItemBox'
import { getTaskRewardTypeValue } from '../../../utils/task'

export type RewardItemDataType = {
  id: number
  name: string
  type: RewardType
  raffled: boolean
  data: RewardData
  task: {
    id: number
    image: string
    name: string
  }
  community: {
    id: number
    name: string
  }
  whitelist: {
    id: number
    mintUrl: string
    mintPrice: string
    mintStartTime: number
    mintEndTime: number
    mintMaxNum: number
    totalNum: number
  }
  project: {
    mintUrl: string
  }
}

export type RewardItemViewConfigType = {
  disabledMint?: boolean
  loadingMint?: boolean
}

export type RewardItemDataViewType = {
  data: RewardItemDataType
  viewConfig?: RewardItemViewConfigType
}

export type RewardItemHandlesType = {
  onMint?: (task: RewardItemDataType) => void
}

export type RewardItemProps = RewardItemDataViewType & RewardItemHandlesType

const defaultViewConfig: RewardItemViewConfigType = {
  disabledMint: false,
  loadingMint: false,
}

const RewardItem: React.FC<RewardItemProps> = ({ data, viewConfig, onMint }: RewardItemProps) => {
  const { type, task, community, whitelist, project } = data
  const { mintUrl } = project

  const { disabledMint, loadingMint } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  // mint按钮点击事件
  const handleMint = () => {
    // if (onMint) {
    //   onMint(data)
    // }
    window.open(mintUrl, '_blank', 'noopener,noreferrer')
  }
  const rewardValue = getTaskRewardTypeValue(data)
  return (
    <RewardItemWrapper>
      <ProjectImage src={task.image} />
      <RewardInfoBox>
        <TaskName>{task.name}</TaskName>
        <CommunityName>{community.name}</CommunityName>
        <RewardTypeContentBox>
          <RewardTypeText>{rewardValue}</RewardTypeText>
          {type === RewardType.WHITELIST && mintUrl && (
            <RewardWhitelistMintButton
              data={whitelist}
              onMint={handleMint}
              loadingMint={loadingMint}
              disabledMint={disabledMint}
            />
          )}
        </RewardTypeContentBox>
      </RewardInfoBox>
    </RewardItemWrapper>
  )
}
export default RewardItem

type RewardWhitelistMintButtonProps = {
  data: {
    mintUrl: string
    mintPrice: string
    mintStartTime: number
    mintEndTime: number
    mintMaxNum: number
    totalNum: number
  }
  loadingMint?: boolean
  disabledMint?: boolean
  onMint?: () => void
}
const RewardWhitelistMintButton: React.FC<RewardWhitelistMintButtonProps> = ({
  data,
  loadingMint,
  disabledMint,
  onMint,
}: RewardWhitelistMintButtonProps) => {
  const { mintStartTime, mintEndTime } = data
  // mint 是否关闭
  const mintClosedCheckInterval = useRef<any>(null)
  const [mintClosed, setMintClosed] = useState(false)
  useEffect(() => {
    if (mintClosedCheckInterval.current) {
      clearInterval(mintClosedCheckInterval.current)
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
  }, [mintEndTime])
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
    if (mintClosed) {
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
  }, [mintStartTime, mintClosed])

  // mint按钮显示文本
  let mintBtnText: string | JSX.Element = 'MINT'
  if (mintClosed) {
    mintBtnText = 'Mint Closed'
  } else if (loadingMint) {
    mintBtnText = 'Loading...'
  } else if (mintStartTimeCountdown.distance > 0) {
    let mintStartTimeCountdownText = ''
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
    mintBtnText = (
      <span>
        <span style={{ fontSize: '12px', fontWeight: '400' }}>You can mint in</span>
        <br />
        {mintStartTimeCountdownText}
      </span>
    )
  }

  // mint 按钮状态
  const isDisabledMint = disabledMint || mintClosed || mintStartTimeCountdown.distance > 0
  return (
    <RewardWhitelistMintButtonWrapper>
      {mintClosed ? (
        <MintClosedBox>{'Mint Closed'}</MintClosedBox>
      ) : (
        <MintBtn disabled={isDisabledMint} onClick={onMint}>
          {mintBtnText}
        </MintBtn>
      )}
    </RewardWhitelistMintButtonWrapper>
  )
}

const RewardItemWrapper = styled(CardItemBox)`
  height: 406px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 265px;
  object-fit: cover;
`
const RewardInfoBox = styled.div`
  flex: 1;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  flex-shrink: 0;
`
const CommunityName = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
  flex-shrink: 0;
`
const RewardTypeContentBox = styled.div`
  width: 100%;
  height: 40px;
  padding-top: 8px;
  border-top: 1px dashed rgba(51, 51, 51, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const RewardWhitelistMintButtonWrapper = styled.div``
const RewardTypeText = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  display: flex;
  align-items: center;
  color: #333333;
`
const MintBtn = styled(ButtonBase)`
  width: 139px;
  height: 40px;
  padding: 0px;
  background: #3dd606;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  font-size: 14px;
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
