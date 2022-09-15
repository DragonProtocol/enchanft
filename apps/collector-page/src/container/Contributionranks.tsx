import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
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
import ContributionList from '../components/business/contribution/ContributionList'
import {
  fetchContributionCommunityInfo,
  selectContributionCommunityInfo,
} from '../features/contribution/communityInfoSlice'
import {
  downloadContributionTokens,
  follow as followCommunity,
  selectUserCommunityHandlesState,
} from '../features/user/communityHandlesSlice'
import { fetchUserContributon, selectUserContributon } from '../features/contribution/userContributionSlice'
import { AsyncRequestStatus } from '../types'
import ContributionAbout from '../components/business/contribution/ContributionAbout'
import ContributionMy, { ContributionMyDataViewType } from '../components/business/contribution/ContributionMy'
import Loading from '../components/common/loading/Loading'
import usePermissions from '../hooks/usePermissons'
import { downloadContributions } from '../services/api/community'
import useCommunityCheckin from '../hooks/useCommunityCheckin'
import useContributionranks from '../hooks/useContributionranks'
import CommunityCheckedinClaimModal from '../components/business/community/CommunityCheckedinClaimModal'
import useAccountOperationForChain, { AccountOperationType } from '../hooks/useAccountOperationForChain'
import { CheckinStatusType } from '../components/business/community/CommunityCheckinButton'
import { MOBILE_BREAK_POINT } from '../constants'
import { isDesktop, isMobile } from 'react-device-detect'

const Contributionranks: React.FC = () => {
  const navigate = useNavigate()
  const { projectSlug } = useParams()
  const dispatch = useAppDispatch()
  const { avatar, name, isLogin } = useAppSelector(selectAccount)
  const { follow: followCommunityState, downloadContributionTokens: downloadContributionTokensState } = useAppSelector(
    selectUserCommunityHandlesState,
  )
  // 用户的contribution操作权限
  const { checkContributionAllowed } = usePermissions()

  // 获取社区信息
  const { data: community, status: communityStatus } = useAppSelector(selectContributionCommunityInfo)
  useEffect(() => {
    if (projectSlug) {
      dispatch(fetchContributionCommunityInfo(projectSlug))
    }
  }, [projectSlug])

  // 按钮执行前要对账户进行的操作
  const { accountOperationType, accountOperationDesc, handleAccountOperation } = useAccountOperationForChain(
    community?.chainId,
  )

  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)
  const isFollowedCommunity =
    !!community?.id && userFollowedProjectIds.map((item) => String(item)).includes(String(community.id))
  // 关注社区
  const { status: followCommunityStatus } = followCommunityState
  const handleFollowCommunity = () => {
    if (community?.id) {
      dispatch(followCommunity({ id: community.id }))
    }
  }

  // 获取用户在此社区的贡献值
  const { data: userContribution, status: userContributionStatus } = useAppSelector(selectUserContributon)
  useEffect(() => {
    if (isLogin && projectSlug && isFollowedCommunity) {
      dispatch(fetchUserContributon(projectSlug))
    }
  }, [projectSlug, isLogin, isFollowedCommunity])

  // 获取社区贡献等级排行
  const { contributionranks, contributionranksState } = useContributionranks(projectSlug)

  // download contribution tokens
  const { status: downloadContributionTokensStatus } = downloadContributionTokensState
  const displayDownload = !!community?.id && checkContributionAllowed(community.id)
  const loadingDownload = downloadContributionTokensStatus === AsyncRequestStatus.PENDING
  const disabledDownload = loadingDownload
  const handleDownload = useCallback(() => {
    if (community?.id) {
      dispatch(downloadContributionTokens(community.id))
    }
  }, [community])

  // 社区签到
  const { isVerifiedCheckin, isCheckedin, handleCheckin, checkinState, checkinData, openClaimModal } =
    useCommunityCheckin(community?.id, projectSlug)

  let checkinStatusType = CheckinStatusType.UNKNOWN
  // let checkinBtnText = ''
  //  账户未绑定
  if (accountOperationType !== AccountOperationType.COMPLETED) {
    checkinStatusType = CheckinStatusType.ACCOUNT_OPERATION
    // checkinBtnText = accountOperationDesc
  } else {
    if (isCheckedin) {
      checkinStatusType = CheckinStatusType.CHECKEDIN
    } else if (checkinState.status === AsyncRequestStatus.PENDING) {
      checkinStatusType = CheckinStatusType.CHECKING
    } else {
      checkinStatusType = CheckinStatusType.CHECKIN
    }
  }
  // 展示数据

  const contributionranksLoading = contributionranksState.status === AsyncRequestStatus.PENDING
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
    twitterId: community?.twitterId || '',
    twitterName: community?.twitterName || '',
    discordId: community?.discordId || '',
    discordInviteUrl: community?.discordInviteUrl || '',
    discordName: '',
  }

  const renderContributionList = () => {
    return (
      <ContributionListBox>
        {contributionranksLoading ? (
          <ContributionLoading>
            <Loading />
          </ContributionLoading>
        ) : (
          <ContributionList
            items={contributionranks}
            membersTotal={contributionranks.length}
            displayMore={false}
            displayDownload={displayDownload}
            loadingDownload={loadingDownload}
            disabledDownload={disabledDownload}
            onDownload={handleDownload}
          />
        )}
      </ContributionListBox>
    )
  }
  return (
    <ContributionWrapper>
      <ContributionHeader>
        <GoBackBtn onClick={() => navigate(-1)}>
          <IconCaretLeft />
        </GoBackBtn>
        <ContributionTitle>{communityInfo.name} Contribution</ContributionTitle>
      </ContributionHeader>

      <ContributionMainBox>
        {!isMobile && renderContributionList()}
        <ContributionRigtBox>
          {isLogin && (
            <ContributionMyBox>
              <ContributionMy
                data={userContributionInfo.data}
                viewConfig={userContributionInfo.viewConfig}
                onFollowCommunity={handleFollowCommunity}
              />
            </ContributionMyBox>
          )}
          {isMobile && renderContributionList()}
          <ContributionAboutBox>
            <ContributionAbout
              data={communityInfo}
              viewConfig={{
                checkinStatusType,
                // checkinBtnText,
              }}
              onCheckin={handleCheckin}
              onAccountOperation={handleAccountOperation}
            />
          </ContributionAboutBox>
        </ContributionRigtBox>
      </ContributionMainBox>

      <CommunityCheckedinClaimModal open={openClaimModal} data={checkinData} />
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 10px;
  }
`
const GoBackBtn = styled(ButtonNavigation)`
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 40px;
    height: 40px;
    border-radius: 16px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`
const ContributionTitle = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`
const ContributionMainBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
`
const ContributionListBox = styled(CardBox)`
  flex: 1;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ContributionRigtBox = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`
const ContributionMyBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ContributionAboutBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  background: #fffbdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
