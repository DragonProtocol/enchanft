import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import MainContentBox from '../components/layout/MainContentBox'
import {
  fetchCommunityContributionRanks,
  selectAll as selectAllForProjectContributionranks,
  selecteContributionRanksState,
} from '../features/community/contributionRanksSlice'
import { useNavigate, useParams } from 'react-router-dom'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import CardBox from '../components/common/card/CardBox'
import ContributionList from '../components/business/contribution/ContributionList'
import {
  fetchContributionCommunityInfo,
  selectContributionCommunityInfo,
} from '../features/contribution/communityInfoSlice'
import { fetchUserContributon, selectUserContributon } from '../features/contribution/userContributionSlice'
import { AsyncRequestStatus } from '../types'
import ContributionAbout from '../components/business/contribution/ContributionAbout'
import ContributionMy from '../components/business/contribution/ContributionMy'
import Loading from '../components/common/loading/Loading'

const Contributionranks: React.FC = () => {
  const navigate = useNavigate()
  const { communityId: id } = useParams()
  const communityId = Number(id)
  const dispatch = useAppDispatch()
  const { token, avatar, name } = useAppSelector(selectAccount)

  // 获取社区信息
  const { data: community, status: communityStatus } = useAppSelector(selectContributionCommunityInfo)
  useEffect(() => {
    if (communityId) {
      dispatch(fetchContributionCommunityInfo(communityId))
    }
  }, [communityId])

  // 获取用户在此社区的贡献信息
  const { data: userContribution, status: userContributionStatus } = useAppSelector(selectUserContributon)
  useEffect(() => {
    if (token && communityId) {
      dispatch(fetchUserContributon(communityId))
    }
  }, [communityId, token])

  // 获取社区贡献等级排行
  const contributionranks = useAppSelector(selectAllForProjectContributionranks)
  const { status: contributionranksStatus } = useAppSelector(selecteContributionRanksState)
  const fetchContributionranksIntervalRef = useRef<any>(null)
  const dispatchContributionRanks = () => communityId && dispatch(fetchCommunityContributionRanks(communityId))
  useEffect(() => {
    if (communityId) {
      dispatchContributionRanks()
      fetchContributionranksIntervalRef.current = setInterval(() => {
        dispatchContributionRanks()
      }, 60 * 1000)
    } else {
      clearInterval(fetchContributionranksIntervalRef.current)
    }
    return () => {
      clearInterval(fetchContributionranksIntervalRef.current)
    }
  }, [communityId])

  // 展示数据
  const contributionranksLoading = contributionranksStatus === AsyncRequestStatus.PENDING
  const userContributionInfo = {
    avatar: avatar,
    userName: name,
    score: userContribution || 0,
  }
  // TODO 没有twitter名称字段
  const communityInfo = {
    name: community?.name || '',
    twitter: community?.twitter || '',
    icon: community?.icon || '',
    twitterName: '',
  }
  return (
    <ContributionWrapper>
      <MainContentBox>
        <ContributionHeader>
          <ButtonNavigation onClick={() => navigate(-1)}>
            <IconCaretLeft />
          </ButtonNavigation>
          <ContributionTitle>{communityInfo.name} Contribution</ContributionTitle>
        </ContributionHeader>

        <ContributionMainBox>
          <ContributionListBox>
            {contributionranksLoading ? (
              <ContributionLoading>
                <Loading />
              </ContributionLoading>
            ) : (
              <ContributionList items={contributionranks} displayMembersTotal={false} displayMore={false} />
            )}
          </ContributionListBox>
          <ContributionRigtBox>
            {token && (
              <ContributionMyBox>
                <ContributionMy data={userContributionInfo} />
              </ContributionMyBox>
            )}

            <ContributionAboutBox>
              <ContributionAbout data={communityInfo} />
            </ContributionAboutBox>
          </ContributionRigtBox>
        </ContributionMainBox>
      </MainContentBox>
    </ContributionWrapper>
  )
}
export default Contributionranks
const ContributionWrapper = styled.div`
  width: 100%;
`
const ContributionLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ContributionHeader = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`
const ContributionTitle = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
`
const ContributionMainBox = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  gap: 20px;
`
const ContributionListBox = styled(CardBox)`
  width: 760px;
`
const ContributionRigtBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`
const ContributionMyBox = styled(CardBox)`
  width: 100%;
`
const ContributionAboutBox = styled(CardBox)`
  width: 100%;
  background: #fffbdb;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
