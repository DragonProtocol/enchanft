/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 13:55:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 10:50:08
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { getMultiavatarIdByUser } from '../../../utils/multiavatar'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import UserAvatar from '../user/UserAvatar'
export type ContributionItemDataType = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
  userId: number
}

export type CommunityContributionProps = {
  items: ContributionItemDataType[]
}

const CommunityContribution: React.FC<CommunityContributionProps> = ({ items }: CommunityContributionProps) => {
  return (
    <CommunityContributionWrapper>
      <ContributionLeft>
        <ContributionBox>
          <ContributionTitleBox>Contribution Rank</ContributionTitleBox>
          <ContributionListBox>
            {items.map((item, index) => (
              <ContributionItemBox key={index}>
                <ContributionItemRanking>{item.ranking}</ContributionItemRanking>
                <ContributionItemAvatar src={item.avatar} multiavatarId={getMultiavatarIdByUser(item)} />
                <ContributionItemUserName>{item.userName}</ContributionItemUserName>
                <ContributionItemPubkey number={1}>{item.pubkey}</ContributionItemPubkey>
                <ContributionItemScore>{item.score}</ContributionItemScore>
              </ContributionItemBox>
            ))}
          </ContributionListBox>
        </ContributionBox>
      </ContributionLeft>
      <ContributionRight>
        <ContributionBox>
          <ContributionTitleBox>About Contribution</ContributionTitleBox>
          <ContributionAboutBox></ContributionAboutBox>
        </ContributionBox>
      </ContributionRight>
    </CommunityContributionWrapper>
  )
}
export default CommunityContribution
const CommunityContributionWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`
const ContributionLeft = styled.div`
  flex: 1;
`
const ContributionRight = styled.div`
  width: 400px;
`
const ContributionBox = styled.div`
  width: 100%;
  padding: 25px;
  border: 2px solid rgba(0, 0, 0, 1);
  border-radius: 10px;
  box-sizing: border-box;
`
const ContributionTitleBox = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 50px;
`
const ContributionListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`
const ContributionItemBox = styled.div`
  display: flex;
  gap: 20px;
  font-size: 20px;
  align-items: center;
`
const ContributionItemRanking = styled.div`
  width: 10%;
  font-weight: bold;
`
const ContributionItemAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`
const ContributionItemUserName = styled.div`
  width: 20%;
  text-transform: capitalize;
`
const ContributionItemPubkey = styled(OverflowEllipsisBox)`
  flex: 1;
`
const ContributionItemScore = styled.div`
  width: 10%;
`

const ContributionAboutBox = styled.div`
  width: 400px;
`
