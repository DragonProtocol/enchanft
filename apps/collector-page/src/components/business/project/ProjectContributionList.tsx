/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 18:06:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 18:35:53
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import AvatarDefaultImg from '../../imgs/avatar.png'
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
export type ProjectContributionListProps = {
  items: ContributionItemDataType[]
  hiddenColumns?: ContributionColumns[]
}

const ProjectContributionList: React.FC<ProjectContributionListProps> = ({
  items,
  hiddenColumns = [],
}: ProjectContributionListProps) => {
  const displayRanking = !hiddenColumns.includes(ContributionColumns.ranking)
  const displayAvatar = !hiddenColumns.includes(ContributionColumns.avatar)
  const displayUserName = !hiddenColumns.includes(ContributionColumns.userName)
  const displayPubkey = !hiddenColumns.includes(ContributionColumns.pubkey)
  const displayScore = !hiddenColumns.includes(ContributionColumns.score)
  return (
    <ProjectContributionListWrapper>
      <ContributionListBox>
        {items.map((item, index) => (
          <ContributionItemBox key={index}>
            {displayRanking && <ContributionItemRanking>{item.ranking}</ContributionItemRanking>}
            {displayAvatar && <ContributionItemAvatar src={item.avatar || AvatarDefaultImg} />}
            {displayUserName && <ContributionItemUserName>{item.userName}</ContributionItemUserName>}
            {displayPubkey && <ContributionItemPubkey number={1}>{item.pubkey}</ContributionItemPubkey>}
            {displayScore && <ContributionItemScore>{item.score}</ContributionItemScore>}
          </ContributionItemBox>
        ))}
      </ContributionListBox>
    </ProjectContributionListWrapper>
  )
}
export default ProjectContributionList
const ProjectContributionListWrapper = styled.div`
  width: 100%;
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
const ContributionItemAvatar = styled.img`
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
