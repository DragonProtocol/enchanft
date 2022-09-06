import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { ConnectModal, selectAccount, setConnectModal, setConnectWalletModalShow } from '../features/user/accountSlice'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ProjectDetailEntity,
  fetchProjectDetail,
  selectProjectDetail,
  resetProjectDetailState,
} from '../features/project/projectDetailSlice'
import {
  fetchCommunityContributionRanks,
  selectAll as selectAllForCommunityContributionranks,
} from '../features/community/contributionRanksSlice'
import ProjectBasicInfo, {
  ProjectDetailBasicInfoDataViewType,
} from '../components/business/project/ProjectDetailBasicInfo'
import { AsyncRequestStatus } from '../types'
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'
import { follow as followCommunity, selectUserCommunityHandlesState } from '../features/user/communityHandlesSlice'
import CardBox from '../components/common/card/CardBox'
import ProjectDetailCommunity, {
  ProjectDetailCommunityDataViewType,
} from '../components/business/project/ProjectDetailCommunity'
import ProjectDetailBasicInfo from '../components/business/project/ProjectDetailBasicInfo'
import ExploreTaskList, { ExploreTaskListItemsType } from '../components/business/task/ExploreTaskList'
import ProjectTeamMemberList, {
  ProjectTeamMemberListItemsType,
} from '../components/business/project/ProjectTeamMemberList'
import ContributionList, {
  ContributionColumns,
  ContributionListSize,
} from '../components/business/contribution/ContributionList'
import RichTextBox from '../components/common/text/RichTextBox'
import ProjectRoadmap from '../components/business/project/ProjectRoadmap'
import usePermissions from '../hooks/usePermissons'
import Loading from '../components/common/loading/Loading'
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox'
import PngIconNotebook from '../components/common/icons/PngIconNotebook'
import { ChainType, getChainType } from '../utils/chain'
import { ButtonPrimary } from '../components/common/button/ButtonBase'
import { selectIds as selectIdsByUserCheckinCommunity } from '../features/user/checkinCommunitiesSlice'
import useCommunityCheckin from '../hooks/useCommunityCheckin'
import useContributionranks from '../hooks/useContributionranks'
import CommunityCheckedinClaimModal from '../components/business/community/CommunityCheckedinClaimModal'
import useAccountOperationForChain, { AccountOperationType } from '../hooks/useAccountOperationForChain'
import { FollowStatusType } from '../components/business/community/CommunityFollowButton'
export enum ProjectParamsVisibleType {
  CONTRIBUTION = 'contribution',
}
export enum ProjectInfoTabsValue {
  TEAM = 'team',
  ROADMAP = 'roadmap',
  REVIEWS = 'reviews',
}
// 处理社区基本信息
const formatStoreDataToComponentDataByCommunityBasicInfo = (
  data: ProjectDetailEntity,
  followedCommunityIds: Array<string | number>,
  followCommunityStatus: AsyncRequestStatus,
  accountOperationType: AccountOperationType,
  accountOperationDesc: string,
): ProjectDetailCommunityDataViewType => {
  const { community } = data
  const viewConfig = {}
  let followStatusType = FollowStatusType.UNKNOWN
  //  账户未绑定
  if (accountOperationType !== AccountOperationType.COMPLETED) {
    followStatusType = FollowStatusType.ACCOUNT_OPERATION
    Object.assign(viewConfig, { followBtnText: accountOperationDesc })
  } else {
    const isFollowed = followedCommunityIds.map((item) => String(item)).includes(String(community.id))
    if (isFollowed) {
      followStatusType = FollowStatusType.FOLLOWED
    } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      followStatusType = FollowStatusType.FOLLOWING
    } else {
      followStatusType = FollowStatusType.FOLLOW
    }
  }
  Object.assign(viewConfig, { followStatusType })
  return {
    data: community,
    viewConfig,
  }
}
// project basic info
const formatStoreDataToComponentDataByProjectBasicInfo = (
  data: ProjectDetailEntity,
): ProjectDetailBasicInfoDataViewType => {
  const displayMintInfo = true
  const displayTasks = true
  return {
    data: data,
    viewConfig: {
      displayMintInfo: displayMintInfo,
      displayTasks: displayTasks,
    },
  }
}
// project tasks
const formatStoreDataToComponentDataByTasks = (data: ProjectDetailEntity): ExploreTaskListItemsType => {
  return data.tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnerNum = task.whitelistTotalNum
    return {
      data: { ...task, project: { ...data } },
    }
  })
}
// project teamMembers
const formatStoreDataToComponentDataByTeamMembers = (data: ProjectDetailEntity): ProjectTeamMemberListItemsType => {
  return data.teamMembers.map((member) => ({
    data: member,
    viewConfig: {},
  }))
}

const Project: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, accounts, isLogin } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)

  const { projectSlug } = useParams()
  const { data, status, errorMsg } = useAppSelector(selectProjectDetail)
  const dispatchFetchDetail = useCallback(() => projectSlug && dispatch(fetchProjectDetail(projectSlug)), [projectSlug])
  const [loadingView, setLoadingView] = useState(true)
  const { isCreator, checkProjectAllowed } = usePermissions()
  const { follow: followCommunityState } = useAppSelector(selectUserCommunityHandlesState)

  // 进入loading状态
  useEffect(() => {
    setLoadingView(true)
  }, [projectSlug])
  // projectSlug、 token 变化，重新请求详情数据
  useEffect(() => {
    dispatchFetchDetail()
    return () => {
      dispatch(resetProjectDetailState())
    }
  }, [projectSlug, token])
  // 确保终止loading状态
  useEffect(() => {
    if (loadingView && ![AsyncRequestStatus.IDLE, AsyncRequestStatus.PENDING].includes(status)) {
      setLoadingView(false)
    }
  }, [loadingView, status])

  // 按钮执行前要对账户进行的操作
  const { accountOperationType, accountOperationDesc, handleAccountOperation } = useAccountOperationForChain(
    data?.chainId,
  )
  // 获取社区贡献等级
  const { contributionranks } = useContributionranks(projectSlug)

  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

  // 社区签到
  const { isVerifiedCheckin, isCheckedin, handleCheckin, checkinState, checkinData, openClaimModal } =
    useCommunityCheckin(data?.communityId, projectSlug)

  // tabs
  // const ProjectInfoTabs = [
  //   {
  //     label: 'Meet the Team',
  //     value: ProjectInfoTabsValue.TEAM,
  //   },
  //   {
  //     label: 'Roadmap',
  //     value: ProjectInfoTabsValue.ROADMAP,
  //   },
  //   // {
  //   //   label: 'Reviews',
  //   //   value: ProjectInfoTabsValue.REVIEWS,
  //   // },
  // ]
  // const [activeTab, setActiveTab] = useState(ProjectInfoTabsValue.TEAM)

  if (loadingView)
    return (
      <MainInnerStatusBox>
        <Loading />{' '}
      </MainInnerStatusBox>
    )

  if (!data) {
    return <MainInnerStatusBox>Can't find project {projectSlug}</MainInnerStatusBox>
  }

  // 关注社区
  const { communityId } = data
  const { status: followCommunityStatus } = followCommunityState
  const handleFollow = () => {
    if (communityId) {
      dispatch(followCommunity({ id: Number(communityId) }))
    }
  }

  const communityDataView = formatStoreDataToComponentDataByCommunityBasicInfo(
    data,
    userFollowedProjectIds,
    followCommunityStatus,
    accountOperationType,
    accountOperationDesc,
  )

  const projectBasicInfoDataView = formatStoreDataToComponentDataByProjectBasicInfo(data)
  const showContributionranks = contributionranks.slice(0, 5)
  const contributionMembersTotal = contributionranks.length
  // const teamMembers = formatStoreDataToComponentDataByTeamMembers(data, token)
  const tasks = formatStoreDataToComponentDataByTasks(data)

  // const ProjectInfoTabComponents = {
  //   [ProjectInfoTabsValue.TEAM]: <ProjectTeamMemberList items={teamMembers} />,
  //   [ProjectInfoTabsValue.ROADMAP]: <ProjectRoadmap items={data.roadmap} />,
  //   // [ProjectInfoTabsValue.REVIEWS]: <span>Not yet developed</span>,
  // }

  //进入ranks页面，如果符合条件就自动关注
  const startContribute = () => {
    navigate(`/${projectSlug}/rank`)
    if (communityDataView.viewConfig?.followStatusType === FollowStatusType.FOLLOW) handleFollow()
  }

  // 社区签到
  const displayCheckin = isLogin && !isCheckedin && isVerifiedCheckin
  const loadingCheckin = checkinState.status === AsyncRequestStatus.PENDING
  const disabledCheckin = loadingCheckin || isCheckedin
  return (
    <ProjectWrapper>
      <ProjectLeftBox>
        <ProjectLeftBodyBox>
          <ProjectImage src={data.image} />
          <ProjectBasicInfoBox>
            <ProjectName>{data.name}</ProjectName>
            <ProjectDetailCommunity
              data={communityDataView.data}
              viewConfig={communityDataView.viewConfig}
              onFollow={handleFollow}
              onAccountOperation={handleAccountOperation}
            />
            <ProjectDetailBasicInfo
              data={projectBasicInfoDataView.data}
              viewConfig={projectBasicInfoDataView.viewConfig}
            />
          </ProjectBasicInfoBox>
        </ProjectLeftBodyBox>
      </ProjectLeftBox>

      <ProjectRightBox>
        <ContributionListBox>
          <ContributionList
            items={showContributionranks}
            membersTotal={contributionMembersTotal}
            displayMore={true}
            moreText="Join and start contributing"
            onMore={startContribute}
          />
        </ContributionListBox>
        <ProjectEventsBox>
          <ProjectLabelBox>
            <PngIconNotebook />
            <ProjectLabel>Events</ProjectLabel>
          </ProjectLabelBox>
          <ExploreTaskListBox>
            <ExploreTaskList
              items={tasks}
              displayCreateTask={isCreator && checkProjectAllowed(Number(data.id))}
              maxColumns={3}
              onCreateTask={() => {
                navigate(
                  `/${projectSlug}/task/create/${data.id}?projectName=${encodeURIComponent(data.name)}&discordId=${
                    data.community.discordId || ''
                  }&communityName=${data.community.name}&communityTwitter=${data.community.twitter}`,
                )
              }}
            />
          </ExploreTaskListBox>
        </ProjectEventsBox>

        {/* <ProjectOtherInfoBox>
            <ProjectOtherInfoLeftBox>
              <ProjectLabelBox>
                <ProjectLabel>Story</ProjectLabel>
              </ProjectLabelBox>

              <ProjectStoryContent value={data.story} />
            </ProjectOtherInfoLeftBox>
            <ProjectOtherInfoRightBox>
              <ProjectOtherInfoRightTabs>
                {ProjectInfoTabs.map((tab) => (
                  <ProjectOtherInfoRightTab
                    key={tab.value}
                    isActive={tab.value === activeTab}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </ProjectOtherInfoRightTab>
                ))}
              </ProjectOtherInfoRightTabs>
              {(activeTab === ProjectInfoTabsValue.TEAM && <ProjectTeamMemberList items={teamMembers} />) ||
                (activeTab === ProjectInfoTabsValue.ROADMAP && <ProjectRoadmap items={data.roadmap} />)}
            </ProjectOtherInfoRightBox>
          </ProjectOtherInfoBox> */}
      </ProjectRightBox>
      {displayCheckin && (
        <CommunityCheckinFloatingWindow>
          <CommunityCheckinBtn onClick={handleCheckin} disabled={disabledCheckin}>
            {loadingCheckin ? 'loading ...' : 'Get Contribution Token!'}
          </CommunityCheckinBtn>
        </CommunityCheckinFloatingWindow>
      )}
      <CommunityCheckedinClaimModal open={openClaimModal} data={checkinData} />
    </ProjectWrapper>
  )
}
export default Project
const ProjectWrapper = styled.div`
  display: flex;
  gap: 20px;
`
const CommunityCheckinFloatingWindow = styled.div`
  position: fixed;
  right: 0;
  bottom: 280px;
  width: 132px;
  height: 82px;
  background: #fffbdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-right: none;
  padding: 10px;
  box-sizing: border-box;
  /* 左上角和左下角radius */
  border-radius: 20px 0 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  cursor: pointer;
  z-index: 2;
`
const CommunityCheckinBtn = styled(ButtonPrimary)`
  background: linear-gradient(135.7deg, #ebff00 -4.05%, #3dd606 97.84%);
  font-weight: 700;
  font-size: 12px;
  color: #333333;
  height: 100%;
`

const ProjectLeftBox = styled.div`
  flex-shrink: 0;
  width: 420px;
`
const ProjectLeftBodyBox = styled(CardBox)`
  padding: 0;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ProjectImage = styled.img`
  width: 420px;
  height: 420px;
  object-fit: cover;
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
  color: #333333;
`
const ProjectBasicInfoBox = styled.div`
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ProjectRightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`
const ContributionListBox = styled(CardBox)`
  background: #fffbdb;
`
const ProjectEventsBox = styled(CardBox)``
const ProjectOtherInfoBox = styled.div`
  display: flex;
  gap: 40px;
`
const ProjectOtherInfoLeftBox = styled.div`
  flex: 1;
`
const ProjectLabelBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`
const ExploreTaskListBox = styled.div`
  margin-top: 20px;
`
const ProjectLabel = styled.div`
  font-weight: 700;
  font-size: 20px;
  color: #333333;
`
const ProjectStoryContent = styled(RichTextBox)``
const ProjectOtherInfoRightBox = styled.div`
  width: 560px;
`
const ProjectOtherInfoRightTabs = styled.div`
  display: flex;
  gap: 80px;
  margin-bottom: 20px;
  border-bottom: solid 1px #d9d9d9;
`
const ProjectOtherInfoRightTab = styled.div<{ isActive: Boolean }>`
  font-weight: 700;
  font-size: 20px;
  color: ${({ isActive }) => (isActive ? `#333333` : 'rgba(51, 51, 51, 0.6)')};
  ${({ isActive }) => (isActive ? `box-shadow: inset 0 -4px #3DD606;` : '')}
  cursor: pointer;
  padding-bottom: 10px;
  transition: all 0.2s ease-in-out;
`
