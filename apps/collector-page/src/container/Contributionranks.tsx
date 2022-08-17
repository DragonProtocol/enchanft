import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import CardBox from '../components/common/card/CardBox'
import ContributionList, { ContributionListSize } from '../components/business/contribution/ContributionList'
import {
  fetchContributionCommunityInfo,
  selectContributionCommunityInfo,
} from '../features/contribution/communityInfoSlice'
import {
  follow as followCommunity,
  selectfollow as selectfollowCommunity,
} from '../features/user/communityHandlesSlice'
import { fetchUserContributon, selectUserContributon } from '../features/contribution/userContributionSlice'
import { AsyncRequestStatus } from '../types'
import ContributionAbout from '../components/business/contribution/ContributionAbout'
import ContributionMy, { ContributionMyDataViewType } from '../components/business/contribution/ContributionMy'
import Loading from '../components/common/loading/Loading'
import usePermissions from '../hooks/usePermissons'

const Contributionranks: React.FC = () => {
  const navigate = useNavigate()
  const { projectSlug } = useParams()
  const dispatch = useAppDispatch()
  const { token, avatar, name } = useAppSelector(selectAccount)

  // 用户的contribution操作权限
  const { checkContributionAllowed } = usePermissions()

  // 获取社区信息
  const { data: community, status: communityStatus } = useAppSelector(selectContributionCommunityInfo)
  useEffect(() => {
    if (projectSlug) {
      dispatch(fetchContributionCommunityInfo(projectSlug))
    }
  }, [projectSlug])
  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)
  const isFollowedCommunity =
    !!community?.id && userFollowedProjectIds.map((item) => String(item)).includes(String(community.id))
  // 关注社区
  const { status: followCommunityStatus } = useAppSelector(selectfollowCommunity)
  const handleFollowCommunity = () => {
    if (community?.id) {
      dispatch(followCommunity({ id: community.id }))
    }
  }

  // 获取用户在此社区的贡献值
  const { data: userContribution, status: userContributionStatus } = useAppSelector(selectUserContributon)
  useEffect(() => {
    if (token && projectSlug && isFollowedCommunity) {
      dispatch(fetchUserContributon(projectSlug))
    }
  }, [projectSlug, token, isFollowedCommunity])

  // 获取社区贡献等级排行
  const contributionranks = useAppSelector(selectAllForProjectContributionranks)
  const { status: contributionranksStatus } = useAppSelector(selecteContributionRanksState)
  const fetchContributionranksIntervalRef = useRef<any>(null)
  const dispatchContributionRanks = () => projectSlug && dispatch(fetchCommunityContributionRanks(projectSlug))
  useEffect(() => {
    if (projectSlug) {
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
  }, [projectSlug])

  // 展示数据
  const contributionranksLoading = contributionranksStatus === AsyncRequestStatus.PENDING
  const userContributionInfo: ContributionMyDataViewType = {
    data: {
      avatar: avatar,
      userName: name,
      score: userContribution || 0,
    },
    viewConfig: {
      displayFollowCommunity: !isFollowedCommunity,
      loadingFollowCommunity: followCommunityStatus === AsyncRequestStatus.PENDING,
      disabledFollowCommunity: followCommunityStatus === AsyncRequestStatus.PENDING,
    },
  }
  // TODO 没有twitter名称字段
  const communityInfo = {
    name: community?.name || '',
    icon: community?.icon || '',
    twitter: community?.twitter || '',
    twitterId: community?.twitterId || '',
    discord: community?.discord || '',
    discordInviteUrl: community?.discordInviteUrl || '',
    discordName: '',
  }

  // 下载
  const displayDownload = !!community?.id && checkContributionAllowed(community.id)
  const handleDownload = useCallback(() => {
    if (community?.id) {
      // TODO 下载api
    }
  }, [])
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
              <ContributionList
                size={ContributionListSize.large}
                items={contributionranks}
                membersTotal={contributionranks.length}
                displayMore={false}
                displayDownload={displayDownload}
                onDownload={handleDownload}
              />
            )}
          </ContributionListBox>
          <ContributionRigtBox>
            {token && (
              <ContributionMyBox>
                <ContributionMy
                  data={userContributionInfo.data}
                  viewConfig={userContributionInfo.viewConfig}
                  onFollowCommunity={handleFollowCommunity}
                />
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
  margin-top: 20px;
  display: flex;
  gap: 20px;
`
const ContributionListBox = styled(CardBox)`
  width: 760px;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ContributionRigtBox = styled.div`
  flex: 1;
`
const ContributionMyBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
`
const ContributionAboutBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  background: #fffbdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
