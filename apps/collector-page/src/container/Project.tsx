import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskAcceptedStatus } from '../types/api'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ProjectDetailEntity, fetchProjectDetail, selectProjectDetail } from '../features/project/projectDetailSlice'
import {
  fetchCommunityContributionRanks,
  selectAll as selectAllForCommunityContributionranks,
} from '../features/community/contributionRanksSlice'
import ProjectBasicInfo, {
  ProjectDetailBasicInfoDataViewType,
} from '../components/business/project/ProjectDetailBasicInfo'
import ProjectDetail, { ProjectDetailDataViewType } from '../components/business/project/ProjectDetail'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { AsyncRequestStatus } from '../types'
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'
import { follow } from '../features/user/communityHandlesSlice'
import CardBox from '../components/common/card/CardBox'
import ProjectDetailCommunity, {
  ProjectDetailCommunityDataViewType,
} from '../components/business/project/ProjectDetailCommunity'
import ProjectDetailBasicInfo from '../components/business/project/ProjectDetailBasicInfo'
import { ExplorTaskSwiperItemsType } from '../components/business/task/ExploreTaskSwiper'
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
  followedCommunityIds: Array<number | string>,
): ProjectDetailCommunityDataViewType => {
  const { community } = data
  return {
    data: {
      ...community,
      isFollowed: followedCommunityIds.includes(data.id),
    },
    viewConfig: {
      displayFollow: token ? true : false,
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
  const { projectSlug } = useParams()
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)
  const projectDetail = useAppSelector(selectProjectDetail)
  const { isCreator } = usePermissions()
  const { data, status, errorMsg } = projectDetail
  useEffect(() => {
    if (projectSlug) {
      dispatch(fetchProjectDetail(projectSlug))
    }
  }, [projectSlug, token])
  const communityId = data?.communityId

  // 获取社区贡献等级
  const contributionranks = useAppSelector(selectAllForCommunityContributionranks)
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

  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

  // 关注社区
  const handleFollowChange = (isFollowed: boolean) => {
    if (communityId && isFollowed) {
      dispatch(follow({ id: Number(communityId) }))
    }
  }

  // tabs
  const ProjectInfoTabs = [
    {
      label: 'Meet the Team',
      value: ProjectInfoTabsValue.TEAM,
    },
    {
      label: 'Roadmap',
      value: ProjectInfoTabsValue.ROADMAP,
    },
    {
      label: 'Reviews',
      value: ProjectInfoTabsValue.REVIEWS,
    },
  ]
  const [activeTab, setActiveTab] = useState(ProjectInfoTabsValue.TEAM)
  // 展示数据
  if (!data) return null
  const communityDataView = formatStoreDataToComponentDataByCommunityBasicInfo(data, token, userFollowedProjectIds)
  const projectBasicInfoDataView = formatStoreDataToComponentDataByProjectBasicInfo(data, token)
  const showContributionranks = contributionranks.slice(0, 5)
  const contributionMembersTotal = contributionranks.length
  const teamMembers = formatStoreDataToComponentDataByTeamMembers(data, token)
  const tasks = formatStoreDataToComponentDataByTasks(data, token)
  const loading = status === AsyncRequestStatus.PENDING

  const ProjectInfoTabComponents = {
    [ProjectInfoTabsValue.TEAM]: <ProjectTeamMemberList items={teamMembers} />,
    [ProjectInfoTabsValue.ROADMAP]: <ProjectRoadmap items={data.roadmap} />,
    [ProjectInfoTabsValue.REVIEWS]: <span>Not yet developed</span>,
  }
  return (
    <ProjectWrapper>
      <MainContentBox>
        {loading ? (
          <ProjectLoading>loading...</ProjectLoading>
        ) : (
          <>
            <ProjectTopBox>
              <ProjectDetailCommunity
                data={communityDataView.data}
                viewConfig={communityDataView.viewConfig}
                onFollowChange={handleFollowChange}
              />
            </ProjectTopBox>

            <ProjectBottomBox>
              <ProjectBasicInfoBox>
                <ProjectBasicInfoLeft>
                  <ProjectDetailBasicInfo
                    data={projectBasicInfoDataView.data}
                    viewConfig={projectBasicInfoDataView.viewConfig}
                  />
                </ProjectBasicInfoLeft>
                <ProjectBasicInfoRight>
                  <ContributionList
                    items={showContributionranks}
                    hiddenColumns={[ContributionColumns.pubkey]}
                    size={ContributionListSize.small}
                    membersTotal={contributionMembersTotal}
                    displayMore={true}
                    moreText="View All"
                    onMore={() => communityId && navigate(`/contributionranks/${communityId}`)}
                  />
                </ProjectBasicInfoRight>
              </ProjectBasicInfoBox>

              <ProjectEventsBox>
                <ExploreTaskList
                  items={tasks}
                  displayCreateTask={isCreator}
                  onCreateTask={() => {
                    navigate('/task/create')
                  }}
                />
              </ProjectEventsBox>

              <ProjectOtherInfoBox>
                <ProjectOtherInfoLeftBox>
                  <ProjectStoryLabel>Story</ProjectStoryLabel>
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
                  {ProjectInfoTabComponents[activeTab]}
                </ProjectOtherInfoRightBox>
              </ProjectOtherInfoBox>
            </ProjectBottomBox>
          </>
        )}
      </MainContentBox>
    </ProjectWrapper>
  )
}
export default Project
const ProjectWrapper = styled.div`
  width: 100%;
`
const ProjectLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ProjectTopBox = styled(CardBox)``
const ProjectBottomBox = styled(CardBox)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`
const ProjectBasicInfoBox = styled.div`
  display: flex;
  gap: 40px;
`
const ProjectBasicInfoLeft = styled.div`
  flex: 1;
`
const ProjectBasicInfoRight = styled.div`
  width: 250px;
  background: #f8f8f8;
  padding: 10px;
  box-sizing: border-box;
`
const ProjectEventsBox = styled.div``
const ProjectOtherInfoBox = styled.div`
  display: flex;
  gap: 60px;
`
const ProjectOtherInfoLeftBox = styled.div`
  flex: 1;
`
const ProjectStoryLabel = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`
const ProjectStoryContent = styled(RichTextBox)``
const ProjectOtherInfoRightBox = styled.div`
  flex: 1;
`
const ProjectOtherInfoRightTabs = styled.div`
  display: flex;
  gap: 80px;
  margin-bottom: 20px;
`
const ProjectOtherInfoRightTab = styled.div<{ isActive: Boolean }>`
  color: rgba(0, 0, 0, 1);
  font-size: 18px;
  ${({ isActive }) => (isActive ? `box-shadow: inset 0 -1px rgba(0, 0, 0, 1);` : '')}
  cursor: pointer;
  padding-bottom: 10px;
`
