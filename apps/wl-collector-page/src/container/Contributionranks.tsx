import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { isDesktop, isMobile } from 'react-device-detect';
import { usePermissions, useWlUserReact } from '@ecnft/wl-user-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ButtonNavigation from '../components/common/button/ButtonNavigation';
import IconCaretLeft from '../components/common/icons/IconCaretLeft';
import CardBox from '../components/common/card/CardBox';
import ContributionList from '../components/business/contribution/ContributionList';
import {
  fetchContributionCommunityInfo,
  resetContributionCommunityInfo,
  selectContributionCommunityInfo,
} from '../features/contribution/communityInfoSlice';
import {
  downloadContributionTokens,
  selectUserCommunityHandlesState,
} from '../features/user/communityHandlesSlice';
import {
  fetchUserContributon,
  resetCommunityUserContributionState,
  selectUserContributon,
} from '../features/contribution/userContributionSlice';
import { AsyncRequestStatus } from '../types';
import ContributionAbout from '../components/business/contribution/ContributionAbout';
import ContributionMy, {
  ContributionMyDataViewType,
} from '../components/business/contribution/ContributionMy';
import Loading from '../components/common/loading/Loading';
import useContributionranks from '../hooks/useContributionranks';
import CommunityCheckedinClaimModal from '../components/business/community/CommunityCheckedinClaimModal';
import useAccountOperationForChain, {
  AccountOperationType,
} from '../hooks/useAccountOperationForChain';
import { CheckinStatusType } from '../components/business/community/CommunityCheckinButton';
import { MOBILE_BREAK_POINT } from '../constants';
import useUserHandlesForCommunity from '../hooks/useUserHandlesForCommunity';
import { FollowStatusType } from '../components/business/community/CommunityFollowButton';

const Contributionranks: React.FC = () => {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const dispatch = useAppDispatch();
  const { user, isLogin } = useWlUserReact();
  const { id: userId, avatar, name } = user;
  const {
    follow: followCommunityState,
    downloadContributionTokens: downloadContributionTokensState,
  } = useAppSelector(selectUserCommunityHandlesState);
  // 用户的contribution操作权限
  const { checkContributionAllowed } = usePermissions();

  // 获取社区信息
  const { data: community, status: communityStatus } = useAppSelector(
    selectContributionCommunityInfo
  );
  useEffect(() => {
    if (projectSlug) {
      dispatch(fetchContributionCommunityInfo(projectSlug));
    }
    return () => {
      dispatch(resetContributionCommunityInfo());
    };
  }, [projectSlug]);
  // 用户在此社区的相关操作信息
  const {
    handlesState,
    isFollowed,
    handleFollow,
    isVerifiedCheckin,
    isCheckedin,
    handleCheckin,
    checkinData,
  } = useUserHandlesForCommunity(community?.id, projectSlug);
  // 按钮执行前要对账户进行的操作
  const { accountOperationType, accountOperationDesc, handleAccountOperation } =
    useAccountOperationForChain(community?.chainId);
  const { follow, checkin } = handlesState;

  let followStatusType = FollowStatusType.UNKNOWN;
  if (isFollowed) {
    // 已关注
    followStatusType = FollowStatusType.FOLLOWED;
  } else if (follow.status === AsyncRequestStatus.PENDING) {
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
  // 获取用户在此社区的贡献值
  const { data: userContributionScore, status: userContributionStatus } =
    useAppSelector(selectUserContributon);
  useEffect(() => {
    if (isLogin && projectSlug && isFollowed) {
      dispatch(fetchUserContributon(projectSlug));
    }
    return () => {
      dispatch(resetCommunityUserContributionState());
    };
  }, [projectSlug, isLogin, isFollowed]);

  // 获取社区贡献等级排行
  const { contributionranks, contributionranksState } =
    useContributionranks(projectSlug);

  const userContributionRanking = contributionranks.find(
    (item) => item.userId === userId
  )?.ranking;

  // download contribution tokens
  const { status: downloadContributionTokensStatus } =
    downloadContributionTokensState;
  const displayDownload =
    !!community?.id && checkContributionAllowed(community.id);
  const loadingDownload =
    downloadContributionTokensStatus === AsyncRequestStatus.PENDING;
  const disabledDownload = loadingDownload;
  const handleDownload = useCallback(() => {
    if (community?.id) {
      dispatch(downloadContributionTokens(community.id));
    }
  }, [community]);

  let checkinStatusType = CheckinStatusType.UNKNOWN;
  // let checkinBtnText = ''
  if (!isFollowed) {
    checkinStatusType = CheckinStatusType.NOT_FOLLOWED;
  } else if (isCheckedin) {
    checkinStatusType = CheckinStatusType.CHECKEDIN;
  } else if (checkin.status === AsyncRequestStatus.PENDING) {
    checkinStatusType = CheckinStatusType.CHECKING;
  } else {
    checkinStatusType = CheckinStatusType.CHECKIN;
  }

  // 展示数据
  const { status: followCommunityStatus } = follow;
  const contributionranksLoading =
    contributionranksState.status === AsyncRequestStatus.PENDING;
  const userContributionInfo: ContributionMyDataViewType = {
    data: {
      avatar,
      userName: name,
      score: userContributionScore || 0,
      ranking: userContributionRanking || 0,
    },
    viewConfig: {
      displayFollowCommunity:
        isLogin && !isFollowed && followStatusType !== FollowStatusType.UNKNOWN,
      followStatusType,
    },
  };
  // TODO 没有twitter名称字段
  const communityInfo = {
    name: community?.name || '',
    // TODO 目前community.icon 指向 project.img, 后面要彻底换成获取project.img
    icon: community?.icon || '',
    twitterId: community?.twitterId || '',
    twitterName: community?.twitterName || '',
    discordId: community?.discordId || '',
    discordInviteUrl: community?.discordInviteUrl || '',
    discordName: '',
  };

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
            highlightIds={[userId]}
          />
        )}
      </ContributionListBox>
    );
  };
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
                onFollow={handleFollow}
                onAccountOperation={handleAccountOperation}
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
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onCheckin={handleCheckin}
              onAccountOperation={handleAccountOperation}
            />
          </ContributionAboutBox>
        </ContributionRigtBox>
      </ContributionMainBox>

      <CommunityCheckedinClaimModal
        open={!!checkin.openClaimModal}
        data={checkinData}
      />
    </ContributionWrapper>
  );
};
export default Contributionranks;
const ContributionWrapper = styled.div`
  width: 100%;
`;
const ContributionLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContributionHeader = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 10px;
  }
`;
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
`;
const ContributionTitle = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`;
const ContributionMainBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
`;
const ContributionListBox = styled(CardBox)`
  flex: 1;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`;
const ContributionRigtBox = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`;
const ContributionMyBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`;
const ContributionAboutBox = styled(CardBox)`
  width: 100%;
  padding: 20px;
  background: #fffbdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`;
