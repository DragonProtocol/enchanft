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
import {
  follow as followCommunity,
  selectfollow as selectfollowCommunity,
} from '../features/user/communityHandlesSlice'
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
import Loading from '../components/common/loading/Loading'
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox'

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
  followedCommunityIds: Array<string>,
  followCommunityStatus: AsyncRequestStatus,
): ProjectDetailCommunityDataViewType => {
  const { community } = data
  return {
    data: {
      ...community,
      isFollowed: followedCommunityIds.includes(data.id.toString()),
    },
    viewConfig: {
      displayFollow: token ? true : false,
      loadingFollow: followCommunityStatus === AsyncRequestStatus.PENDING,
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
  const { isCreator, checkProjectAllowed } = usePermissions()
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

  // 关注社区
  const { status: followCommunityStatus } = useAppSelector(selectfollowCommunity)
  const handleFollowChange = (isFollowed: boolean) => {
    if (communityId && isFollowed) {
      dispatch(followCommunity({ id: Number(communityId) }))
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
    // {
    //   label: 'Reviews',
    //   value: ProjectInfoTabsValue.REVIEWS,
    // },
  ]
  const [activeTab, setActiveTab] = useState(ProjectInfoTabsValue.TEAM)
  const loading = status === AsyncRequestStatus.PENDING
  if (loading)
    return (
      <MainInnerStatusBox>
        <Loading />{' '}
      </MainInnerStatusBox>
    )
  // 展示数据
  if (!data) return null
  const communityDataView = formatStoreDataToComponentDataByCommunityBasicInfo(
    data,
    token,
    userFollowedProjectIds,
    followCommunityStatus,
  )
  const projectBasicInfoDataView = formatStoreDataToComponentDataByProjectBasicInfo(data, token)
  const showContributionranks = contributionranks.slice(0, 5)
  const contributionMembersTotal = contributionranks.length
  const teamMembers = formatStoreDataToComponentDataByTeamMembers(data, token)
  const tasks = formatStoreDataToComponentDataByTasks(data, token)

  const ProjectInfoTabComponents = {
    [ProjectInfoTabsValue.TEAM]: <ProjectTeamMemberList items={teamMembers} />,
    [ProjectInfoTabsValue.ROADMAP]: <ProjectRoadmap items={data.roadmap} />,
    // [ProjectInfoTabsValue.REVIEWS]: <span>Not yet developed</span>,
  }
  return (
    <ProjectWrapper>
      <MainContentBox>
        <ProjectTopBox>
          <ProjectCommunityInfoBox>
            <ProjectDetailCommunity
              data={communityDataView.data}
              viewConfig={communityDataView.viewConfig}
              onFollowChange={handleFollowChange}
            />
          </ProjectCommunityInfoBox>

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
                membersTotal={contributionMembersTotal}
                displayMore={true}
                moreText="View All"
                onMore={() => navigate(`/${projectSlug}/rank`)}
              />
            </ProjectBasicInfoRight>
          </ProjectBasicInfoBox>
        </ProjectTopBox>

        <ProjectBottomBox>
          <ProjectEventsBox>
            <ProjectLabelBox>
              <ProjectLabel>Events</ProjectLabel>
            </ProjectLabelBox>
            <ExploreTaskListBox>
              <ExploreTaskList
                items={tasks}
                displayCreateTask={isCreator && checkProjectAllowed(Number(data.id))}
                onCreateTask={() => {
                  navigate(`/${projectSlug}/task/create/${data.id}?projectName=${encodeURIComponent(data.name)}`)
                }}
              />
            </ExploreTaskListBox>
          </ProjectEventsBox>

          <ProjectOtherInfoBox>
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
              {ProjectInfoTabComponents[activeTab]}
            </ProjectOtherInfoRightBox>
          </ProjectOtherInfoBox>
        </ProjectBottomBox>
      </MainContentBox>
    </ProjectWrapper>
  )
}
export default Project
const ProjectWrapper = styled.div`
  width: 100%;
`
const ProjectTopBox = styled(CardBox)`
  width: 100%;
  padding: 0;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ProjectCommunityInfoBox = styled.div`
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
`

const ProjectBasicInfoBox = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`
const ProjectBasicInfoLeft = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
`
const ProjectBasicInfoRight = styled.div`
  width: 480px;
  background: #fffbdb;
  padding: 20px;
  box-sizing: border-box;
`

const ProjectBottomBox = styled(CardBox)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`
const ProjectEventsBox = styled.div``
const ProjectOtherInfoBox = styled.div`
  display: flex;
  gap: 40px;
`
const ProjectOtherInfoLeftBox = styled.div`
  flex: 1;
`
const ProjectLabelBox = styled.div`
  border-bottom: solid 1px #d9d9d9;
  display: flex;
`
const ExploreTaskListBox = styled.div`
  margin-top: 20px;
`
const ProjectLabel = styled.div`
  font-weight: 700;
  font-size: 20px;
  color: #333333;
  padding-bottom: 10px;
  box-shadow: inset 0 -4px #3dd606;
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
