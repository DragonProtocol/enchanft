/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 18:06:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 16:33:35
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import UserAvatar from '../user/UserAvatar'
import PngIconTrophy from '../../common/icons/PngIconTrophy'
import CrownImg from '../../imgs/crown.svg'
import ButtonBase from '../../common/button/ButtonBase'
export type ContributionItemDataType = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
}
export enum ContributionColumns {
  ranking = 'ranking',
  avatar = 'avatar',
  userName = 'userName',
  pubkey = 'pubkey',
  score = 'score',
}
export enum ContributionListSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

const ContributionListFontSizeMap = {
  [ContributionListSize.small]: {
    title: '16px',
    membersTotal: '12px',
    ranking: '14px',
    avatar: '40px',
    userName: '14px',
    pubkey: '14px',
    score: '14px',
  },
  [ContributionListSize.medium]: {
    title: '24px',
    membersTotal: '14px',
    ranking: '16px',
    avatar: '40px',
    userName: '16px',
    pubkey: '16px',
    score: '16px',
  },
  [ContributionListSize.large]: {
    title: '24px',
    membersTotal: '16px',
    ranking: '16px',
    avatar: '40px',
    userName: '16px',
    pubkey: '16px',
    score: '16px',
  },
}

const ContributionListFontWeightMap = {
  [ContributionListSize.small]: {
    title: '700',
    membersTotal: '400',
    ranking: '700',
    userName: '400',
    pubkey: 'normal',
    score: '700',
  },
  [ContributionListSize.medium]: {
    title: '700',
    membersTotal: '400',
    ranking: '700',
    userName: '400',
    pubkey: 'normal',
    score: '700',
  },
  [ContributionListSize.large]: {
    title: '700',
    membersTotal: '400',
    ranking: '700',
    userName: '700',
    pubkey: '400',
    score: '700',
  },
}

const ContributionListFlexGapMap = {
  [ContributionListSize.small]: '8px',
  [ContributionListSize.medium]: '10px',
  [ContributionListSize.large]: '20px',
}

export type ContributionListProps = {
  items: ContributionItemDataType[]
  hiddenColumns?: ContributionColumns[]
  displayMembersTotal?: boolean
  membersTotal?: number
  displayDownload?: boolean
  loadingDownload?: boolean
  disabledDownload?: boolean
  displayMore?: boolean
  moreText?: string
  onDownload?: () => void
  onMore?: () => void
  size?: ContributionListSize
}

const ContributionList: React.FC<ContributionListProps> = ({
  items,
  hiddenColumns = [],
  displayMembersTotal = true,
  membersTotal = 0,
  displayDownload = false,
  loadingDownload = false,
  disabledDownload = false,
  displayMore,
  moreText = 'View More',
  onDownload,
  onMore,
  size = ContributionListSize.medium,
}: ContributionListProps) => {
  const displayRanking = !hiddenColumns.includes(ContributionColumns.ranking)
  const displayAvatar = !hiddenColumns.includes(ContributionColumns.avatar)
  const displayUserName = !hiddenColumns.includes(ContributionColumns.userName)
  const displayPubkey = !hiddenColumns.includes(ContributionColumns.pubkey)
  const displayScore = !hiddenColumns.includes(ContributionColumns.score)
  const fontSize = ContributionListFontSizeMap[size]
  const fontWeight = ContributionListFontWeightMap[size]
  const flexGap = ContributionListFlexGapMap[size]
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload()
    }
  }, [onDownload])
  const handleMore = useCallback(() => {
    if (onMore) onMore()
  }, [onMore])
  return (
    <ContributionListWrapper>
      <ContributioHeaderBox>
        <PngIconTrophy />
        <ContributionTitle style={{ fontSize: fontSize.title, fontWeight: fontWeight.title }}>
          Contribution Token
        </ContributionTitle>
        {displayMembersTotal && (
          <CotributionMembersTotal style={{ fontSize: fontSize.membersTotal, fontWeight: fontWeight.membersTotal }}>
            {membersTotal} members
          </CotributionMembersTotal>
        )}
        {displayDownload && (
          <DownloadBtn onClick={handleDownload} disabled={disabledDownload}>
            {loadingDownload ? 'Loading...' : 'Download'}
          </DownloadBtn>
        )}
      </ContributioHeaderBox>
      <ContributionListBox>
        {items.map((item, index) => (
          <ContributionItemBox key={index} style={{ gap: flexGap }}>
            {displayRanking && (
              <ContributionItemRanking
                style={{ fontSize: fontSize.ranking, fontWeight: fontWeight.ranking }}
                topThree={item.ranking < 4}
              >
                {item.ranking}
              </ContributionItemRanking>
            )}
            {displayAvatar && (
              <ContributionItemAvatar src={item.avatar} style={{ width: fontSize.avatar, height: fontSize.avatar }} />
            )}
            {displayUserName && (
              <ContributionItemUserName style={{ fontSize: fontSize.userName, fontWeight: fontWeight.userName }}>
                {item.userName}
              </ContributionItemUserName>
            )}
            {displayPubkey && (
              <ContributionItemPubkey style={{ fontSize: fontSize.pubkey, fontWeight: fontWeight.pubkey }}>
                {item.pubkey}
              </ContributionItemPubkey>
            )}
            {displayScore && (
              <ContributionItemScore style={{ fontSize: fontSize.score, fontWeight: fontWeight.score }}>
                {item.score}
              </ContributionItemScore>
            )}
          </ContributionItemBox>
        ))}
      </ContributionListBox>
      {displayMore && <MoreBtn onClick={handleMore}>{moreText}</MoreBtn>}
    </ContributionListWrapper>
  )
}
export default ContributionList
const ContributionListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const ContributioHeaderBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 24px;
`
const ContributionTitle = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
`
const CotributionMembersTotal = styled.div`
  font-size: 14px;
  line-height: 21px;
  text-align: right;
  color: rgba(51, 51, 51, 0.5);
`
const ContributionListBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const ContributionItemBox = styled.div`
  display: flex;
  gap: 20px;
  font-size: 20px;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 10px;
`
const ContributionItemRanking = styled.div<{ topThree?: boolean }>`
  width: 50px;
  height: 24px;
  font-weight: 700;
  text-align: center;
  line-height: 24px;
  ${({ topThree }) =>
    topThree &&
    `
    background-image: url(${CrownImg});
    background-size:100% 100%; 
    background-position: center;
    background-repeat: no-repeat;
    line-height: 30px;
  `}
`
const ContributionItemAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`
const ContributionItemUserName = styled(OverflowEllipsisBox)`
  width: 160px;
  text-align: left;
  text-transform: capitalize;
`
const ContributionItemPubkey = styled(OverflowEllipsisBox)`
  flex: 1;
  min-width: 45%;
  text-align: left;
`
const ContributionItemScore = styled.div`
  width: 86px;
  font-weight: 700;
  text-align: left;
  color: #333333;
`
const MoreBtn = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #3dd606;
  margin-top: 10px;
  cursor: pointer;
`
const DownloadBtn = styled(ButtonBase)`
  width: 132px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f8f8f8;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  font-size: 14px;
  color: #333333;
`
