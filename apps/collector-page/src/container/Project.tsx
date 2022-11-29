import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isDesktop } from 'react-device-detect';
import {
  AccountType,
  AuthorizerType,
  usePermissions,
  useWlUserReact,
  WlUserModalType,
} from '@ecnft/wl-user-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  ProjectDetailEntity,
  fetchProjectDetail,
  selectProjectDetail,
  resetProjectDetailState,
} from '../features/project/projectDetailSlice';

import ProjectDetailBasicInfo, {
  ProjectDetailBasicInfoDataViewType,
} from '../components/business/project/ProjectDetailBasicInfo';
import { AsyncRequestStatus } from '../types';
import CardBox from '../components/common/card/CardBox';
import ExploreTaskList, {
  ExploreTaskListItemsType,
} from '../components/business/task/ExploreTaskList';
import ContributionList from '../components/business/contribution/ContributionList';
import Loading from '../components/common/loading/Loading';
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox';
import PngIconNotebook from '../components/common/icons/PngIconNotebook';
import { ButtonPrimary } from '../components/common/button/ButtonBase';
import useUserHandlesForCommunity from '../hooks/useUserHandlesForCommunity';
import useContributionranks from '../hooks/useContributionranks';
import CommunityCheckedinClaimModal from '../components/business/community/CommunityCheckedinClaimModal';
import useAccountOperationForChain, {
  AccountOperationType,
} from '../hooks/useAccountOperationForChain';
import CommunityFollowButton, {
  FollowStatusType,
} from '../components/business/community/CommunityFollowButton';
import { MOBILE_BREAK_POINT } from '../constants';
import IconWebsite from '../components/common/icons/IconWebsite';
import IconTwitterBlack from '../components/common/icons/IconTwitterBlack';
import IconDiscordBlack from '../components/common/icons/IconDiscordBlack';
import { getTwitterHomeLink } from '../utils/twitter';
import { toWlModPageTaskCreate } from '../route/utils';
import { selectAll as selectAllForTodoTasks } from '../features/user/todoTasksSlice';
import { TodoTaskItem } from '../types/api';
import ProjectGradeTag from '../components/business/project/ProjectGradeTag';
import { GradeType } from '../types/entities';
import {
  selectUserProjectHandlesState,
  applyForVerification as applyForVerificationAsyncThunk,
} from '../features/user/projectHandlesSlice';

export enum ProjectInfoTabsValue {
  TEAM = 'team',
  ROADMAP = 'roadmap',
  REVIEWS = 'reviews',
}

// project basic info
const formatStoreDataToComponentDataByProjectBasicInfo = (
  data: ProjectDetailEntity
): ProjectDetailBasicInfoDataViewType => {
  const displayMintInfo = true;
  const displayTasks = true;
  return {
    data,
    viewConfig: {
      displayMintInfo,
      displayTasks,
    },
  };
};
// project tasks
const formatStoreDataToComponentDataByTasks = (
  data: ProjectDetailEntity,
  todoTasks: TodoTaskItem[]
): ExploreTaskListItemsType => {
  return (
    data.tasks?.map((task) => {
      const findTask = todoTasks.find((item) => item.id === task.id);
      return {
        data: { ...task, project: { ...data }, status: findTask?.status },
      };
    }) || []
  );
};

const Project: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLogin, validateBindAccount, dispatchModal } =
    useWlUserReact();
  const { token } = user;

  const { projectSlug } = useParams();
  const { data, status, errorMsg } = useAppSelector(selectProjectDetail);
  const dispatchFetchDetail = useCallback(
    () => projectSlug && dispatch(fetchProjectDetail(projectSlug)),
    [projectSlug]
  );
  const [loadingView, setLoadingView] = useState(true);
  const { isCreator, checkProjectAllowed } = usePermissions();
  const todoTasks = useAppSelector(selectAllForTodoTasks);
  // 进入loading状态
  useEffect(() => {
    setLoadingView(true);
  }, [projectSlug]);
  // projectSlug、 token 变化，重新请求详情数据
  useEffect(() => {
    dispatchFetchDetail();
    return () => {
      dispatch(resetProjectDetailState());
    };
  }, [projectSlug, token]);
  // 确保终止loading状态
  useEffect(() => {
    if (
      loadingView &&
      ![AsyncRequestStatus.IDLE, AsyncRequestStatus.PENDING].includes(status)
    ) {
      setLoadingView(false);
    }
  }, [loadingView, status]);

  // 获取社区贡献等级
  const { contributionranks } = useContributionranks(projectSlug);

  // 用户在此社区的相关操作信息
  const {
    handlesState,
    isFollowed,
    handleFollow,
    isVerifiedCheckin,
    isCheckedin,
    handleCheckin,
    checkinData,
  } = useUserHandlesForCommunity(data?.communityId, projectSlug);

  // 用户在社区执行相关操作前检查账户绑定情况
  const { accountOperationType, accountOperationDesc, handleAccountOperation } =
    useAccountOperationForChain(data?.chainId);

  // 用户显示 apply for verification
  const { applyForVerification } = useAppSelector(
    selectUserProjectHandlesState
  );
  const applyForVerificationLoading =
    applyForVerification.status === AsyncRequestStatus.PENDING;
  const displayApplyForVerification = useMemo(
    () =>
      !!data &&
      data.grade === GradeType.UNOFFICIAL &&
      !!data?.community.twitterName,
    [data]
  );
  const handleApplyForVerification = useCallback(() => {
    if (!isLogin) {
      dispatchModal({ type: WlUserModalType.LOGIN });
    } else if (!validateBindAccount(AccountType.TWITTER)) {
      dispatchModal({
        type: WlUserModalType.BIND,
        payload: AuthorizerType.TWITTER,
      });
    } else {
      const account = user.accounts.find(
        (item) => item.thirdpartyName === data?.community.twitterName
      );
      if (account) {
        dispatch(applyForVerificationAsyncThunk(data.id));
      } else {
        toast.warn(
          'The bound twitter is inconsistent with the current project community twitter'
        );
      }
    }
  }, [isLogin, user, data, validateBindAccount]);

  if (loadingView)
    return (
      <MainInnerStatusBox>
        <Loading />{' '}
      </MainInnerStatusBox>
    );

  if (!data) {
    return (
      // eslint-disable-next-line react/no-unescaped-entities
      <MainInnerStatusBox>Can't find project {projectSlug}</MainInnerStatusBox>
    );
  }

  const projectBasicInfoDataView =
    formatStoreDataToComponentDataByProjectBasicInfo(data);
  const showContributionranks = contributionranks.slice(0, 5);
  const contributionMembersTotal = contributionranks.length;
  const tasks = formatStoreDataToComponentDataByTasks(data, todoTasks);

  const { follow, checkin } = handlesState;
  // 关注社区
  const { status: followCommunityStatus } = follow;
  // 检查账户绑定情况，关注按钮呈现不同视图
  const { community } = data;
  let followStatusType: FollowStatusType | null = null;
  if (isFollowed) {
    // 已关注
    followStatusType = FollowStatusType.FOLLOWED;
  } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
    // 正在执行关注
    followStatusType = FollowStatusType.FOLLOWING;
  } else if (accountOperationType !== AccountOperationType.BIND_UNKNOWN) {
    if (accountOperationType !== AccountOperationType.COMPLETED) {
      //  账户未绑定
      followStatusType = FollowStatusType.ACCOUNT_OPERATION;
    } else {
      // 可关注
      followStatusType = FollowStatusType.FOLLOW;
    }
  }

  // 进入ranks页面，如果符合条件就自动关注
  const allowFollow = followStatusType === FollowStatusType.FOLLOW;
  const startContribute = () => {
    navigate(`/${projectSlug}/rank`);
    if (allowFollow) handleFollow();
  };

  // 社区签到
  const displayCheckin =
    isLogin && isFollowed && !isCheckedin && isVerifiedCheckin;
  const loadingCheckin = checkin.status === AsyncRequestStatus.PENDING;
  const disabledCheckin = loadingCheckin || isCheckedin;

  return (
    <ProjectWrapper>
      <ProjectLeftBox>
        <ProjectLeftInfo>
          <ProjectLeftInfoTop>
            <ProjectImageBox>
              <ProjectGradeTag grade={data.grade} />
              <ProjectImage src={data.image} />
            </ProjectImageBox>

            <ProjectLeftInfoTopRight>
              <ProjectName>{data.name}</ProjectName>
              {community && (
                <ProjectCommunityBox>
                  <CommunityLeftBox>
                    {community.website && (
                      <ProjectLink
                        href={community.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
                      <ProjectLink
                        href={community.discordInviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconDiscordBlack />
                      </ProjectLink>
                    )}
                  </CommunityLeftBox>
                </ProjectCommunityBox>
              )}
            </ProjectLeftInfoTopRight>
          </ProjectLeftInfoTop>
          <PorjectNumbersBox>
            <PorjectNumbersItemBox>
              <ProjectNumbersItemLabel>items</ProjectNumbersItemLabel>
              <ProjectNumbersItemValue>
                {projectBasicInfoDataView.data.itemTotalNum || 0}
              </ProjectNumbersItemValue>
            </PorjectNumbersItemBox>
            <PorjectNumbersItemBox>
              <ProjectNumbersItemLabel>EnchaNFT</ProjectNumbersItemLabel>
              <ProjectNumbersItemValue>
                {projectBasicInfoDataView.data.injectedCoins || 0}
              </ProjectNumbersItemValue>
            </PorjectNumbersItemBox>
          </PorjectNumbersBox>
          {!!followStatusType && (
            <FollowBtn
              followStatusType={followStatusType}
              onFollow={handleFollow}
              onAccountOperation={handleAccountOperation}
            />
          )}

          <ProjectDetailBasicInfo
            data={projectBasicInfoDataView.data}
            viewConfig={projectBasicInfoDataView.viewConfig}
          />
        </ProjectLeftInfo>
        {displayApplyForVerification && (
          <ApplyForVerificationBox>
            <ApplyForVerificationTitle>
              Community is not Verified
            </ApplyForVerificationTitle>
            <ApplyForVerificationDesc>
              If you are on the team, Please send us message and get verified.
            </ApplyForVerificationDesc>
            <ApplyForVerificationBtn
              onClick={handleApplyForVerification}
              disabled={applyForVerificationLoading}
            >
              {applyForVerificationLoading
                ? 'Loading ...'
                : 'Apply for Verification'}
            </ApplyForVerificationBtn>
          </ApplyForVerificationBox>
        )}
      </ProjectLeftBox>

      <ProjectRightBox>
        <ContributionListBox>
          <ContributionList
            items={showContributionranks}
            membersTotal={contributionMembersTotal}
            displayMore
            moreText={
              allowFollow
                ? 'Apply for WL and start contributing'
                : 'Start contributing'
            }
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
              displayCreateTask={
                isDesktop && isCreator && checkProjectAllowed(Number(data.id))
              }
              maxColumns={3}
              onCreateTask={() =>
                projectSlug && toWlModPageTaskCreate(projectSlug)
              }
            />
          </ExploreTaskListBox>
        </ProjectEventsBox>
      </ProjectRightBox>
      {displayCheckin && (
        <CommunityCheckinFloatingWindow>
          <CommunityCheckinBtn
            onClick={handleCheckin}
            disabled={disabledCheckin}
          >
            {loadingCheckin ? 'loading ...' : 'Get Contribution Scores!'}
          </CommunityCheckinBtn>
        </CommunityCheckinFloatingWindow>
      )}
      <CommunityCheckedinClaimModal
        open={!!checkin.openClaimModal}
        data={checkinData}
      />
    </ProjectWrapper>
  );
};
export default Project;
const ProjectWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
`;
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
`;
const CommunityCheckinBtn = styled(ButtonPrimary)`
  background: linear-gradient(135.7deg, #ebff00 -4.05%, #3dd606 97.84%);
  font-weight: 700;
  font-size: 12px;
  color: #333333;
  height: 100%;
`;

const ProjectLeftBox = styled.div`
  flex-shrink: 0;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`;
const ProjectLeftInfo = styled(CardBox)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`;
const ProjectLeftInfoTop = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 10px;
  }
`;
const PorjectNumbersBox = styled.div`
  display: flex;
  gap: 10px;
`;
const PorjectNumbersItemBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 12px;
  width: 185px;
  height: 40px;
  background: #ebeee4;
  border-radius: 10px;
`;
const ProjectNumbersItemLabel = styled.span`
  font-size: 16px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
  }
`;
const ProjectNumbersItemValue = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`;
const ProjectImageBox = styled.div`
  position: relative;
`;
const ProjectImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 10px;
  object-fit: cover;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100px;
    height: 100px;
  }
`;
const ProjectLeftInfoTopRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ProjectCommunityBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommunityLeftBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;
const ProjectLink = styled.a`
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;
const FollowBtn = styled(CommunityFollowButton)`
  width: 100%;
  height: 60px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 70px;
    height: 30px;
    font-size: 16px;
    line-height: 24px;
  }
`;
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
`;
const ApplyForVerificationBox = styled(CardBox)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`;
const ApplyForVerificationTitle = styled.span`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const ApplyForVerificationDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #333333;
`;
const ApplyForVerificationBtn = styled(ButtonPrimary)`
  height: 40px;
`;
const ProjectRightBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`;
const ContributionListBox = styled(CardBox)`
  background: #fffbdb;
`;
const ProjectEventsBox = styled(CardBox)``;
const ProjectLabelBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ExploreTaskListBox = styled.div`
  margin-top: 20px;
`;
const ProjectLabel = styled.div`
  font-weight: 700;
  font-size: 20px;
  color: #333333;
`;
