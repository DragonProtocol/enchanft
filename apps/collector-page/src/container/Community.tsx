import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskAcceptedStatus } from '../types/api'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  CommunityBasicInfoForEntity,
  CommunityCollectionProjectItemForEntity,
  fetchCommunityCollectionDetail,
  selectCommunityCollectionDetail,
} from '../features/community/collectionDetailSlice'
import {
  fetchCommunityContributionRanks,
  selectAll as selectAllForCommunityContributionranks,
} from '../features/community/contributionRanksSlice'
import CommunityBasicInfo, { CommunityBasicInfoDataType } from '../components/business/community/CommunityBasicInfo'
import CommunityProjectTabs, {
  CommunityProjectTabsOptions,
} from '../components/business/community/CommunityProjectTabs'
import ProjectDetail, { ProjectDetailDataViewType } from '../components/business/project/ProjectDetail'
import CommunityContribution from '../components/business/community/CommunityContribution'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { AsyncRequestStatus } from '../types'
import { selectIds as selectIdsByUserFollowedCommunity } from '../features/user/followedCommunitiesSlice'
import { follow } from '../features/user/communityHandlesSlice'

// 处理社区基本信息
const formatStoreDataToComponentDataByCommunityBasicInfo = (
  data: CommunityBasicInfoForEntity,
  followedCommunityIds: Array<number | string>,
): CommunityBasicInfoDataType => {
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    description: data.description,
    communityFollowerNum: data.communityFollowerNum,
    isFollowed: followedCommunityIds.includes(data.id),
  }
}

// 处理社区项目切换可选项
const formatStoreDataToComponentDataByCommunityProjectTabs = (
  projects: CommunityCollectionProjectItemForEntity[],
): CommunityProjectTabsOptions => {
  return projects.map((project) => {
    return {
      label: project.name,
      value: project.id,
    }
  })
}

// 处理项目详情
const formatStoreDataToComponentDataByProjectDetail = (
  projects: CommunityCollectionProjectItemForEntity[],
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
): ProjectDetailDataViewType[] => {
  return projects.map((project) => {
    const displayMintInfo = true
    const displayTasks = true
    // format tasks
    const tasks =
      displayTasks &&
      project.tasks.map((task) => {
        const displayConnectWalletTip = token ? false : true
        const displayAccept = token && task.acceptedStatus === TaskAcceptedStatus.DONE ? true : false
        const displayTake = token && task.acceptedStatus === TaskAcceptedStatus.CANDO ? true : false
        const loadingTake = takeTaskState.params?.id === task.id && takeTaskState.status === AsyncRequestStatus.PENDING
        const disabledTake = !token || loadingTake ? true : false
        const displayGoToTasks = displayAccept
        return {
          data: task,
          viewConfig: {
            displayConnectWalletTip,
            displayAccept,
            displayGoToTasks,
            displayTake,
            disabledTake,
            loadingTake,
          },
        }
      })
    // format team members
    const teamMembers = project.teamMembers.map((member) => ({
      data: member,
      viewConfig: {},
    }))
    // format roadmap
    const roadmap = project.roadmap.map((item) => ({ ...item }))
    return {
      data: {
        ...project,
        tasks,
        teamMembers,
        roadmap,
      },
      viewConfig: {
        displayMintInfo: displayMintInfo,
        displayTasks: displayTasks,
      },
    }
  })
}

export enum CommunityParamsVisibleType {
  CONTRIBUTION = 'contribution',
}

const Community: React.FC = () => {
  const { communityId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  const visible = searchParams.get('visible')

  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)
  // 获取社区信息
  const collectionDetail = useAppSelector(selectCommunityCollectionDetail)
  const { data, status, errorMsg } = collectionDetail
  useEffect(() => {
    if (communityId) {
      dispatch(
        fetchCommunityCollectionDetail({
          communityId: Number(communityId),
        }),
      )
    }
  }, [communityId, token])

  // 获取社区贡献等级
  const contributionranks = useAppSelector(selectAllForCommunityContributionranks)
  const fetchContributionranksIntervalRef = useRef<any>(null)
  const dispatchContributionRanks = () =>
    dispatch(
      fetchCommunityContributionRanks({
        communityId: Number(communityId),
      }),
    )
  useEffect(() => {
    dispatchContributionRanks()
    fetchContributionranksIntervalRef.current = setInterval(() => {
      dispatchContributionRanks()
    }, 60 * 1000)
    return () => {
      clearInterval(fetchContributionranksIntervalRef.current)
    }
  }, [communityId])

  // 获取用户关注的社区ID集合
  const userFollowedCommunityIds = useAppSelector(selectIdsByUserFollowedCommunity)

  // 关注社区
  const handleFollowChange = (isFollowed: boolean) => {
    if (communityId && isFollowed) {
      dispatch(follow({ id: Number(communityId) }))
    }
  }
  // 接受任务
  const handleTakeTask = (id) => {
    dispatch(take({ id }))
  }
  // 接任务的状态
  const { take: takeTaskState } = useAppSelector(selectUserTaskHandlesState)

  // 社区展示信息切换
  const CommunityTabOptions = [
    {
      label: 'Collection',
      value: 'collection',
    },
    {
      label: 'Contribution',
      value: 'contribution',
    },
  ]
  const [curCommunityTab, setCurCommunityTab] = useState(CommunityTabOptions[0].value)
  useEffect(() => {
    if (visible) {
      if (visible === CommunityParamsVisibleType.CONTRIBUTION) {
        setCurCommunityTab(CommunityTabOptions[1].value)
      }
    }
  }, [visible])
  // 项目展示信息切换
  const [curProjectId, setCurProjectId] = useState<number>(Number(projectId))
  useEffect(() => {
    if (!data) return
    const findProject = data.projects.find((project) => project.id === Number(projectId))
    // const findProject = data.projects[0]
    const findProjectId = (findProject && findProject.id) || data.projects[0].id
    setCurProjectId(findProjectId)
  }, [projectId, data])

  // 展示数据
  if (!data) return null
  const communityBasicInfoData = formatStoreDataToComponentDataByCommunityBasicInfo(
    data.community,
    userFollowedCommunityIds,
  )
  const communityBasicInfoViewConfig = { displayFollow: token ? true : false }

  const communityProjectTabs = formatStoreDataToComponentDataByCommunityProjectTabs(data.projects)

  const projects = formatStoreDataToComponentDataByProjectDetail(data.projects, token, takeTaskState)

  const curProjectDetail = projects.find((project) => project.data.id === curProjectId)
  const loading = status === AsyncRequestStatus.PENDING

  const renderCollection = () => {
    if (!curProjectDetail) return <span>No Project</span>
    return (
      <>
        {communityProjectTabs.length > 1 && (
          <CommunityProjectTabsBox>
            <CommunityProjectTabs options={communityProjectTabs} value={curProjectId} onChange={setCurProjectId} />
          </CommunityProjectTabsBox>
        )}

        <ProjectDetail
          data={curProjectDetail.data}
          viewConfig={curProjectDetail.viewConfig}
          onTake={(task) => handleTakeTask(task.id)}
        ></ProjectDetail>
      </>
    )
  }
  return (
    <CommunityWrapper>
      <ScrollBox>
        <MainContentBox>
          {loading ? (
            <CommunityLoading>loading...</CommunityLoading>
          ) : (
            <>
              <CommunityBasicInfo
                data={communityBasicInfoData}
                viewConfig={communityBasicInfoViewConfig}
                onFollowChange={handleFollowChange}
              />
              <CommunityTabs>
                {CommunityTabOptions.map((item) => (
                  <CommunityTab
                    key={item.value}
                    onClick={() => setCurCommunityTab(item.value)}
                    isActive={item.value === curCommunityTab}
                  >
                    {item.label}
                  </CommunityTab>
                ))}
              </CommunityTabs>
              <CommunityTabContentBox>
                {curCommunityTab === 'collection' && renderCollection()}
                {curCommunityTab === 'contribution' && <CommunityContribution items={contributionranks} />}
              </CommunityTabContentBox>
            </>
          )}
        </MainContentBox>
      </ScrollBox>
    </CommunityWrapper>
  )
}
export default Community
const CommunityWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
`
const CommunityTabs = styled.div`
  width: 700px;
  height: 32px;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 1);
  margin-top: 40px;
`
const CommunityTab = styled.div<{ isActive?: boolean }>`
  width: 350px;
  height: 100%;
  cursor: pointer;
  border-left: 2px solid rgba(21, 21, 21, 100);
  &:first-child {
    border-left: none;
  }
  background: ${(props) => (props.isActive ? '#000' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  display: flex;
  justify-content: center;
  align-items: center;
`
const CommunityTabContentBox = styled.div`
  margin-top: 40px;
`
const CommunityProjectTabsBox = styled.div`
  margin-bottom: 40px;
`
const CommunityLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
