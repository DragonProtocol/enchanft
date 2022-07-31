import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskAcceptedStatus } from '../types/api'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProjectDetailEntity, fetchProjectDetail, selectProjectDetail } from '../features/project/projectDetailSlice'
import {
  fetchProjectContributionRanks,
  selectAll as selectAllForProjectContributionranks,
} from '../features/project/projectContributionRanksSlice'
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
import { ExploreTaskListItemsType } from '../components/business/task/ExploreTaskList'
import { ProjectTeamMemberListItemsType } from '../components/business/project/ProjectTeamMemberList'
import ProjectContributionList from '../components/business/project/ProjectContributionList'

export enum ProjectParamsVisibleType {
  CONTRIBUTION = 'contribution',
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
// project
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
// tasks
const formatStoreDataToComponentDataByTasks = (data: ProjectDetailEntity, token: string): ExploreTaskListItemsType => {
  return data.tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnersNum = task.whitelistTotalNum
    return {
      data: { ...task, project: { ...data } },
    }
  })
}
// teamMembers
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
  const { slug } = useParams()

  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)
  const projectDetail = useAppSelector(selectProjectDetail)
  const { data, status, errorMsg } = projectDetail
  useEffect(() => {
    if (slug) {
      dispatch(fetchProjectDetail(slug))
    }
  }, [slug, token])
  const projectId = data?.id

  // 获取社区贡献等级
  const contributionranks = useAppSelector(selectAllForProjectContributionranks)
  const fetchContributionranksIntervalRef = useRef<any>(null)
  const dispatchContributionRanks = () =>
    projectId &&
    dispatch(
      fetchProjectContributionRanks({
        id: projectId,
      }),
    )
  useEffect(() => {
    if (projectId) {
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
  }, [projectId])

  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

  // 关注社区
  const handleFollowChange = (isFollowed: boolean) => {
    if (projectId && isFollowed) {
      dispatch(follow({ id: Number(projectId) }))
    }
  }
  // 接受任务
  const handleTakeTask = (id) => {
    dispatch(take({ id }))
  }
  // 接任务的状态
  const { take: takeTaskState } = useAppSelector(selectUserTaskHandlesState)

  // 社区展示信息切换
  const ProjectTabOptions = [
    {
      label: 'Collection',
      value: 'collection',
    },
    {
      label: 'Contribution',
      value: 'contribution',
    },
  ]

  // 展示数据
  if (!data) return null
  const communityDataView = formatStoreDataToComponentDataByCommunityBasicInfo(data, token, userFollowedProjectIds)
  const projectBasicInfoDataView = formatStoreDataToComponentDataByProjectBasicInfo(data, token)
  const roadmapDataView = formatStoreDataToComponentDataByTasks(data, token)

  const loading = status === AsyncRequestStatus.PENDING

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
                <ProjectDetailBasicInfo
                  data={projectBasicInfoDataView.data}
                  viewConfig={projectBasicInfoDataView.viewConfig}
                />
                <ProjectContributionList items={contributionranks} />
              </ProjectBasicInfoBox>
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
const ProjectLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
