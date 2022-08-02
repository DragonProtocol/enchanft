/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 18:06:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-01 14:22:13
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import UserAvatar from '../user/UserAvatar'
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
    title: '18px',
    membersTotal: '14px',
    ranking: '16px',
    avatar: '48px',
    userName: '16px',
    pubkey: '16px',
    score: '16px',
  },
  [ContributionListSize.large]: {
    title: '20px',
    membersTotal: '16px',
    ranking: '18px',
    avatar: '56px',
    userName: '18px',
    pubkey: '18px',
    score: '18px',
  },
}
export type ContributionListProps = {
  items: ContributionItemDataType[]
  hiddenColumns?: ContributionColumns[]
  displayMembersTotal?: boolean
  membersTotal?: number
  displayMore?: boolean
  moreText?: string
  onMore?: () => void
  size?: ContributionListSize
}

const ContributionList: React.FC<ContributionListProps> = ({
  items,
  hiddenColumns = [],
  displayMembersTotal = true,
  membersTotal = 0,
  displayMore,
  moreText = 'View More',
  onMore,
  size = ContributionListSize.medium,
}: ContributionListProps) => {
  const displayRanking = !hiddenColumns.includes(ContributionColumns.ranking)
  const displayAvatar = !hiddenColumns.includes(ContributionColumns.avatar)
  const displayUserName = !hiddenColumns.includes(ContributionColumns.userName)
  const displayPubkey = !hiddenColumns.includes(ContributionColumns.pubkey)
  const displayScore = !hiddenColumns.includes(ContributionColumns.score)
  const fontSize = ContributionListFontSizeMap[size]
  const handleMore = useCallback(() => {
    if (onMore) onMore()
  }, [onMore])
  return (
    <ContributionListWrapper>
      <ContributioHeaderBox>
        <ContributionTitle style={{ fontSize: fontSize.title }}>Contribution Rank</ContributionTitle>
        {displayMembersTotal && (
          <CotributionMembersTotal style={{ fontSize: fontSize.membersTotal }}>
            {membersTotal} members
          </CotributionMembersTotal>
        )}
      </ContributioHeaderBox>
      <ContributionListBox>
        {items.map((item, index) => (
          <ContributionItemBox key={index}>
            {displayRanking && (
              <ContributionItemRanking style={{ fontSize: fontSize.ranking }}>{item.ranking}</ContributionItemRanking>
            )}
            {displayAvatar && (
              <ContributionItemAvatar src={item.avatar} style={{ width: fontSize.avatar, height: fontSize.avatar }} />
            )}
            {displayUserName && (
              <ContributionItemUserName style={{ fontSize: fontSize.userName }}>
                {item.userName}
              </ContributionItemUserName>
            )}
            {displayPubkey && (
              <ContributionItemPubkey style={{ fontSize: fontSize.pubkey }}>{item.pubkey}</ContributionItemPubkey>
            )}
            {displayScore && (
              <ContributionItemScore style={{ fontSize: fontSize.score }}>{item.score}</ContributionItemScore>
            )}
          </ContributionItemBox>
        ))}
        {displayMore && <MoreBtn onClick={handleMore}>{moreText}</MoreBtn>}
      </ContributionListBox>
    </ContributionListWrapper>
  )
}
export default ContributionList
const ContributionListWrapper = styled.div`
  width: 100%;
`
const ContributioHeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 8px;
`
const ContributionTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
`
const CotributionMembersTotal = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.5);
`
const ContributionListBox = styled.div`
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
const ContributionItemRanking = styled.div`
  width: 10%;
  font-weight: bold;
`
const ContributionItemAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`
const ContributionItemUserName = styled(OverflowEllipsisBox)`
  width: 20%;
  text-transform: capitalize;
`
const ContributionItemPubkey = styled(OverflowEllipsisBox)`
  flex: 1;
`
const ContributionItemScore = styled.div`
  width: 10%;
`
const MoreBtn = styled.div`
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #3dd606;
  cursor: pointer;
`
