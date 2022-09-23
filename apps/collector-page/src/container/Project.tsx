import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
// import { OrbisChannelComponent } from '@ecnft/orbis-component'
import {
  ProjectDetailEntity,
  fetchProjectDetail,
  selectProjectDetail,
  resetProjectDetailState,
} from '../features/project/projectDetailSlice'

import ProjectBasicInfo, {
  ProjectDetailBasicInfoDataViewType,
} from '../components/business/project/ProjectDetailBasicInfo'
import { AsyncRequestStatus } from '../types'
import CardBox from '../components/common/card/CardBox'
import ProjectDetailBasicInfo from '../components/business/project/ProjectDetailBasicInfo'
import ExploreTaskList, { ExploreTaskListItemsType } from '../components/business/task/ExploreTaskList'
import ProjectTeamMemberList, {
  ProjectTeamMemberListItemsType,
} from '../components/business/project/ProjectTeamMemberList'
import ContributionList from '../components/business/contribution/ContributionList'
import RichTextBox from '../components/common/text/RichTextBox'
import ProjectRoadmap from '../components/business/project/ProjectRoadmap'
import usePermissions from '../hooks/usePermissons'
import Loading from '../components/common/loading/Loading'
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox'
import PngIconNotebook from '../components/common/icons/PngIconNotebook'
import { ButtonPrimary } from '../components/common/button/ButtonBase'
import useUserHandlesForCommunity from '../hooks/useUserHandlesForCommunity'
import useContributionranks from '../hooks/useContributionranks'
import CommunityCheckedinClaimModal from '../components/business/community/CommunityCheckedinClaimModal'
import useAccountOperationForChain, { AccountOperationType } from '../hooks/useAccountOperationForChain'
import CommunityFollowButton, { FollowStatusType } from '../components/business/community/CommunityFollowButton'
import { MOBILE_BREAK_POINT } from '../constants'
import { isDesktop } from 'react-device-detect'
import IconWebsite from '../components/common/icons/IconWebsite'
import IconTwitterBlack from '../components/common/icons/IconTwitterBlack'
import IconDiscordBlack from '../components/common/icons/IconDiscordBlack'
import { getTwitterHomeLink } from '../utils/twitter'
import { ORBIS_GROUP_ID } from '../constants'

export enum ProjectInfoTabsValue {
  TEAM = 'team',
  ROADMAP = 'roadmap',
  REVIEWS = 'reviews',
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
  return (
    data.tasks?.map((task) => {
      // TODO 待确认，这里先用task的whiteListTotalNum代替
      // const winnerNum = task.whitelistTotalNum
      return {
        data: { ...task, project: { ...data } },
      }
    }) || []
  )
}
// project teamMembers
const formatStoreDataToComponentDataByTeamMembers = (data: ProjectDetailEntity): ProjectTeamMemberListItemsType => {
  return (
    data.teamMembers?.map((member) => ({
      data: member,
      viewConfig: {},
    })) || []
  )
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
  const { contributionranks } = useContributionranks(projectSlug)

  // 用户在此社区的相关操作信息
  const { handlesState, isFollowed, handleFollow, isVerifiedCheckin, isCheckedin, handleCheckin, checkinData } =
    useUserHandlesForCommunity(data?.communityId, projectSlug)

  // 用户在社区执行相关操作前检查账户绑定情况
  const { accountOperationType, accountOperationDesc, handleAccountOperation } = useAccountOperationForChain(
    data?.chainId,
  )

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

  const { follow, checkin } = handlesState
  // 关注社区
  const { status: followCommunityStatus } = follow
  // 检查账户绑定情况，关注按钮呈现不同视图
  const { community } = data
  let followStatusType: FollowStatusType | null = null
  if (isFollowed) {
    // 已关注
    followStatusType = FollowStatusType.FOLLOWED
  } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
    // 正在执行关注
    followStatusType = FollowStatusType.FOLLOWING
  } else if (accountOperationType !== AccountOperationType.BIND_UNKNOWN) {
    if (accountOperationType !== AccountOperationType.COMPLETED) {
      //  账户未绑定
      followStatusType = FollowStatusType.ACCOUNT_OPERATION
    } else {
      // 可关注
      followStatusType = FollowStatusType.FOLLOW
    }
  }

  //进入ranks页面，如果符合条件就自动关注
  const allowFollow = followStatusType === FollowStatusType.FOLLOW
  const startContribute = () => {
    navigate(`/${projectSlug}/rank`)
    if (allowFollow) handleFollow()
  }

  // 社区签到
  const displayCheckin = isLogin && isFollowed && !isCheckedin && isVerifiedCheckin
  const loadingCheckin = checkin.status === AsyncRequestStatus.PENDING
  const disabledCheckin = loadingCheckin || isCheckedin

  return (
    <ProjectWrapper>
      <ProjectLeftBox>
        <ProjectLeftInfo>
          <ProjectLeftInfoTop>
            {data.image && <ProjectImage src={data.image} />}
            <ProjectLeftInfoTopRight>
              <ProjectName>{data.name}</ProjectName>
              {community && (
                <ProjectCommunityBox>
                  <CommunityLeftBox>
                    {community.website && (
                      <ProjectLink href={community.website} target="_blank" rel="noopener noreferrer">
                        <IconWebsite />
                      </ProjectLink>
                    )}
                    {community.twitterName && (
                      <ProjectLink
                        href={getTwitterHomeLink(community.twitterName)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconTwitterBlack />
                      </ProjectLink>
                    )}

                    {community.discordInviteUrl && (
                      <ProjectLink href={community.discordInviteUrl} target="_blank" rel="noopener noreferrer">
                        <IconDiscordBlack />
                      </ProjectLink>
                    )}
                  </CommunityLeftBox>
                  {!!followStatusType && (
                    <FollowBtn
                      followStatusType={followStatusType}
                      onFollow={handleFollow}
                      onAccountOperation={handleAccountOperation}
                    />
                  )}
                </ProjectCommunityBox>
              )}
            </ProjectLeftInfoTopRight>
          </ProjectLeftInfoTop>

          <ProjectDetailBasicInfo
            data={projectBasicInfoDataView.data}
            viewConfig={projectBasicInfoDataView.viewConfig}
          />
        </ProjectLeftInfo>
      </ProjectLeftBox>

      <ProjectRightBox>
        <ContributionListBox>
          <ContributionList
            items={showContributionranks}
            membersTotal={contributionMembersTotal}
            displayMore={true}
            moreText={allowFollow ? 'Join and start contributing' : 'Start contributing'}
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
              displayCreateTask={isDesktop && isCreator && checkProjectAllowed(Number(data.id))}
              maxColumns={3}
              onCreateTask={() => {
                navigate(
                  `/${projectSlug}/task/create/${data.id}?projectName=${encodeURIComponent(data.name)}&discordId=${data.community?.discordId || ''
                  }&communityName=${data.community?.name || ''}&communityTwitter=${data.community?.twitterName || ''}`,
                )
              }}
            />
          </ExploreTaskListBox>
        </ProjectEventsBox>

        {/* 
        // comments
        {data.orbisGroupId && data.orbisChannelId &&
          <OrbisBox>
            <OrbisChannelComponent group_id={data.orbisGroupId} channel_id={data.orbisChannelId} />
          </OrbisBox>
        }
         */}

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
            {loadingCheckin ? 'loading ...' : 'Get Contribution Scores!'}
          </CommunityCheckinBtn>
        </CommunityCheckinFloatingWindow>
      )}
      <CommunityCheckedinClaimModal open={!!checkin.openClaimModal} data={checkinData} />
    </ProjectWrapper>
  )
}
export default Project
const ProjectWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`
const ProjectLeftInfo = styled(CardBox)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const ProjectLeftInfoTop = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 10px;
  }
`
const ProjectImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 10px;
  object-fit: cover;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100px;
    height: 100px;
  }
`
const ProjectLeftInfoTopRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ProjectCommunityBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CommunityLeftBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`
const ProjectLink = styled.a`
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`
const FollowBtn = styled(CommunityFollowButton)`
  width: 100px;
  height: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 70px;
    height: 30px;
    font-size: 16px;
    line-height: 24px;
  }
`
const ProjectName = styled.div`
  width: 100%;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  color: #333333;
  word-wrap: break-word;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
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
const OrbisBox = styled(CardBox)`
  height: 600px;
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
