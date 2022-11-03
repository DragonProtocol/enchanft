/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 18:06:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-31 14:12:35
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import PngIconTrophy from '../../common/icons/PngIconTrophy'
import CrownImg from '../../imgs/crown.svg'
import ButtonBase from '../../common/button/ButtonBase'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { isDesktop } from 'react-device-detect'
import { UserAvatar } from '@ecnft/wl-user-react'
export type ContributionItemDataType = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
  userId: number
}
export enum ContributionColumns {
  ranking = 'ranking',
  avatar = 'avatar',
  userName = 'userName',
  pubkey = 'pubkey',
  score = 'score',
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
  highlightIds?: number[]
  onDownload?: () => void
  onMore?: () => void
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
  highlightIds = [],
  onDownload,
  onMore,
}: ContributionListProps) => {
  const displayRanking = !hiddenColumns.includes(ContributionColumns.ranking)
  const displayAvatar = !hiddenColumns.includes(ContributionColumns.avatar)
  const displayUserName = !hiddenColumns.includes(ContributionColumns.userName)
  const displayPubkey = !hiddenColumns.includes(ContributionColumns.pubkey)
  const displayScore = !hiddenColumns.includes(ContributionColumns.score)
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
        <ContributioHeaderRigt>
          <ContributionTitle>Contribution Scores</ContributionTitle>
          {displayMembersTotal && <CotributionMembersTotal>{membersTotal} members</CotributionMembersTotal>}
          {isDesktop && displayDownload && (
            <DownloadBtn onClick={handleDownload} disabled={disabledDownload}>
              {loadingDownload ? 'Loading...' : 'Download'}
            </DownloadBtn>
          )}
        </ContributioHeaderRigt>
      </ContributioHeaderBox>
      <ContributionListBox>
        {items.map((item, index) => (
          <ContributionItemBox key={index}>
            {displayRanking && (
              <ContributionItemRanking topThree={item.ranking < 4}>{item.ranking}</ContributionItemRanking>
            )}
            {displayAvatar && <ContributionItemAvatar user={{ id: item.userId, avatar: item.avatar }} />}
            {displayUserName && (
              <ContributionItemUserName highlight={highlightIds.includes(item.userId)}>
                {item.userName}
              </ContributionItemUserName>
            )}
            {displayPubkey && (
              <ContributionItemPubkey highlight={highlightIds.includes(item.userId)}>
                {item.pubkey}
              </ContributionItemPubkey>
            )}
            {displayScore && <ContributionItemScore>{item.score}</ContributionItemScore>}
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
`
const ContributioHeaderRigt = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
  }
`
const ContributionTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`
const CotributionMembersTotal = styled.div`
  font-size: 16px;
  line-height: 21px;
  text-align: right;
  color: rgba(51, 51, 51, 0.5);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
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
  font-size: 16px;
  color: #333333;
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
`
const ContributionItemUserName = styled(OverflowEllipsisBox)<{ highlight?: boolean }>`
  width: 160px;
  text-align: left;
  text-transform: capitalize;
  font-weight: 700;
  color: ${(props) => (props.highlight ? '#3DD606' : '#333333')};
`
const ContributionItemPubkey = styled(OverflowEllipsisBox)<{ highlight?: boolean }>`
  flex: 1;
  min-width: 45%;
  text-align: left;
  color: ${(props) => (props.highlight ? '#3DD606' : '#333333')};
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    display: none;
  }
`
const ContributionItemScore = styled.div`
  width: 86px;
  font-weight: 700;
  text-align: left;
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
