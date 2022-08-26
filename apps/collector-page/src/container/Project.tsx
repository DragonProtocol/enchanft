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
  FollowStatusType,
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
  token: string,
  followedCommunityIds: Array<string | number>,
  followCommunityStatus: AsyncRequestStatus,
  accountTypes: string[],
): ProjectDetailCommunityDataViewType => {
  const { community, chainId } = data

  const chainType = getChainType(chainId)

  let followStatusType = FollowStatusType.UNKNOWN

  if (token) {
    const isFollowed = followedCommunityIds.map((item) => String(item)).includes(String(community.id))
    if (isFollowed) {
      followStatusType = FollowStatusType.FOLLOWED
    } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      followStatusType = FollowStatusType.FOLLOWING
    } else {
      // 钱包是否跟用户系统绑定
      let isBindWallet = false
      switch (chainType) {
        case ChainType.EVM:
          if (accountTypes.includes('EVM')) {
            isBindWallet = true
          }
          break
        case ChainType.SOLANA:
          if (accountTypes.includes('SOLANA')) {
            isBindWallet = true
          }
          break
      }
      if (!isBindWallet) {
        followStatusType = FollowStatusType.BIND_WALLET
      } else {
        followStatusType = FollowStatusType.FOLLOW
      }
    }
  } else {
    followStatusType = FollowStatusType.CONNECT_WALLET
  }

  return {
    data: community,
    viewConfig: {
      followStatusType,
      bindWalletType: chainType,
    },
  }
}
// project basic info
const formatStoreDataToComponentDataByProjectBasicInfo = (
  data: ProjectDetailEntity,
  token: string,
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
const formatStoreDataToComponentDataByTasks = (data: ProjectDetailEntity, token: string): ExploreTaskListItemsType => {
  return data.tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnerNum = task.whitelistTotalNum
    return {
      data: { ...task, project: { ...data } },
    }
  })
}
// project teamMembers
const formatStoreDataToComponentDataByTeamMembers = (
  data: ProjectDetailEntity,
  token: string,
): ProjectTeamMemberListItemsType => {
  return data.teamMembers.map((member) => ({
    data: member,
    viewConfig: {},
  }))
}

const Project: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, accounts } = useAppSelector(selectAccount)
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

  // 获取社区贡献等级
  const contributionranks = useAppSelector(selectAllForCommunityContributionranks)
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

  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

  // 打开连接钱包的窗口
  const handleOpenConnectWallet = useCallback(() => {
    dispatch(setConnectWalletModalShow(true))
  }, [])

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
    token,
    userFollowedProjectIds,
    followCommunityStatus,
    accountTypes,
  )

  const projectBasicInfoDataView = formatStoreDataToComponentDataByProjectBasicInfo(data, token)
  const showContributionranks = contributionranks.slice(0, 5)
  const contributionMembersTotal = contributionranks.length
  // const teamMembers = formatStoreDataToComponentDataByTeamMembers(data, token)
  const tasks = formatStoreDataToComponentDataByTasks(data, token)

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
  // 打开绑定钱包账户的窗口
  const handleOpenWalletBind = (chainType: ChainType) => {
    const modalType = chainType === ChainType.SOLANA ? ConnectModal.PHANTOM : ConnectModal.METAMASK
    dispatch(setConnectModal(modalType))
  }

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
              onBindWallet={handleOpenWalletBind}
              onConnectWallet={handleOpenConnectWallet}
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
            moreText="Start Contributing"
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
    </ProjectWrapper>
  )
}
export default Project
const ProjectWrapper = styled.div`
  display: flex;
  gap: 20px;
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
