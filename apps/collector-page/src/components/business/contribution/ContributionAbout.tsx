/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 12:04:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:42:09
 * @Description: file description
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import ButtonBase, { ButtonPrimary } from '../../common/button/ButtonBase';
import IconTwitterWhite from '../../common/icons/IconTwitterWhite';
import IconDiscordWhite from '../../common/icons/IconDiscordWhite';
import IconLike from '../../common/icons/IconLike';
import IconRetweet from '../../common/icons/IconRetweet';
import IconChat from '../../common/icons/IconChat';
import IconInvite from '../../common/icons/IconInvite';
import { getTwitterHomeLink } from '../../../utils/twitter';
import CommunityCheckinButton, {
  CommunityCheckinButtonHandlesType,
  CommunityCheckinButtonViewConfigType,
} from '../community/CommunityCheckinButton';

export type ContributionAboutDataType = {
  name: string;
  icon: string;
  twitterId: string;
  twitterName: string;
  discordId: string;
  discordName: string;
  discordMembers?: number;
  discordInviteUrl: string;
};

enum QaAnswerType {
  WL = 'WL',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}
export type ContributionAboutViewConfigType =
  CommunityCheckinButtonViewConfigType;

export type ContributionAboutDataViewType = {
  data: ContributionAboutDataType;
  viewConfig?: ContributionAboutViewConfigType;
};
export type ContributionAboutHandlesType = CommunityCheckinButtonHandlesType;

export type ContributionAboutProps = ContributionAboutDataViewType &
  ContributionAboutHandlesType;

const ContributionAbout: React.FC<ContributionAboutProps> = ({
  data,
  viewConfig,
  onCheckin,
  onAccountOperation,
}: ContributionAboutProps) => {
  const {
    name,
    icon,
    twitterId,
    twitterName,
    discordId,
    discordInviteUrl,
    discordName,
    discordMembers,
  } = data;
  const onTwitter = () => {
    if (!twitterId || !twitterName) return;
    const twitterHomeLink = getTwitterHomeLink(twitterName);
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`;
    window.open(twitterHomeLink, twitterName, winParams);
  };
  const onDiscord = () => {
    if (!discordInviteUrl) return;
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`;
    window.open(discordInviteUrl, discordName, winParams);
  };
  const TwitterLinkComponent = (
    <LinkTextBtn onClick={onTwitter}>@{twitterName || name}</LinkTextBtn>
  );
  const DiscordLinkComponent = (
    <LinkTextBtn onClick={onDiscord}>#{discordName || name}</LinkTextBtn>
  );
  const questions = [
    {
      title: 'Q: How to get contribution scores in this community?',
      answers: [
        {
          display: true,
          type: QaAnswerType.WL,
          title: `Join the community.`,
          content: ``,
        },
        {
          display: !!twitterId && !!twitterName,
          title: <>Follow {TwitterLinkComponent} on Twitter.</>,
          content: (
            <CommunityBox>
              <CommunityImg src={icon} />
              <CommunityCenter>
                <CommunityName>{name}</CommunityName>
                {twitterName && (
                  <CommunityLinkName>@{twitterName || name}</CommunityLinkName>
                )}
              </CommunityCenter>
              {twitterName && (
                <LinkBtnTwitter onClick={onTwitter}>
                  <IconTwitterWhite />
                </LinkBtnTwitter>
              )}
            </CommunityBox>
          ),
        },
        {
          display: !!twitterId && !!twitterName,
          type: QaAnswerType.TWITTER,
          title: (
            <>
              Like, retweet {TwitterLinkComponent} daily on Twitter to earn
              contribution scores.
            </>
          ),
          content: (
            <CommunityUserNumberBox>
              <CommunityUserNumberItem>
                <IconLike size="20px" />
                <CommunityUserNumberLabelText>
                  (Like)
                </CommunityUserNumberLabelText>
                <CommunityUserNumberValueText>
                  1 score
                </CommunityUserNumberValueText>
              </CommunityUserNumberItem>
              <CommunityUserNumberItem>
                <IconRetweet size="20px" />
                <CommunityUserNumberLabelText>
                  (Retweet)
                </CommunityUserNumberLabelText>
                <CommunityUserNumberValueText>
                  3 score
                </CommunityUserNumberValueText>
              </CommunityUserNumberItem>
            </CommunityUserNumberBox>
          ),
        },
        {
          display: !!discordId,
          title: <>Join {DiscordLinkComponent} server on Discord.</>,
          type: QaAnswerType.DISCORD,
          content: (
            <CommunityBox>
              <CommunityImg src={icon} radius="16px" />
              <CommunityCenter>
                <CommunityName>{name}</CommunityName>
                {discordMembers && (
                  <DiscordMembersBox>
                    <DiscordMembersLabel />
                    <DiscordMembers>{discordMembers} Members</DiscordMembers>
                  </DiscordMembersBox>
                )}
              </CommunityCenter>
              {discordInviteUrl && (
                <LinkBtnDiscord onClick={onDiscord}>
                  <IconDiscordWhite />
                </LinkBtnDiscord>
              )}
            </CommunityBox>
          ),
        },
        {
          display: !!discordId,
          type: QaAnswerType.DISCORD,
          title: (
            <>
              Chat in or invite friends to the {DiscordLinkComponent} daily on
              Discord.
            </>
          ),
          content: (
            <CommunityUserNumberBox>
              <CommunityUserNumberItem>
                <IconChat size="20px" />
                <CommunityUserNumberLabelText>
                  (Chat)
                </CommunityUserNumberLabelText>
                <CommunityUserNumberValueText>
                  Max 1 score per hours
                </CommunityUserNumberValueText>
              </CommunityUserNumberItem>
              <CommunityUserNumberItem>
                <IconInvite size="20px" />
                <CommunityUserNumberLabelText>
                  (Invite)
                </CommunityUserNumberLabelText>
                <CommunityUserNumberValueText>
                  3 score
                </CommunityUserNumberValueText>
              </CommunityUserNumberItem>
            </CommunityUserNumberBox>
          ),
        },
        {
          display: true,
          type: QaAnswerType.WL,
          title: `Daily Click.`,
          content: (
            <GetContributionTokenBtn
              checkinStatusType={viewConfig?.checkinStatusType}
              checkinBtnText={viewConfig?.checkinBtnText}
              onCheckin={onCheckin}
              onAccountOperation={onAccountOperation}
            />
          ),
        },
      ],
    },
    {
      title: 'Q: What is the use of contribution?',
      answers: [
        {
          display: true,
          type: QaAnswerType.WL,
          title: 'Whitelist',
          content: '',
        },
        {
          display: true,
          type: QaAnswerType.WL,
          title: 'Project events',
          content: '',
        },
      ],
    },
  ];
  return (
    <ContributionAboutWrapper>
      <AboutTitle>About Contribution</AboutTitle>
      {questions.map((question, index) => (
        <QuestionItemBox key={index}>
          <QuestionTitle>{question.title}</QuestionTitle>
          {question.answers.map((answer, index) => {
            if (!answer.display) return null;
            return (
              <QuestionContent key={index}>
                <QuestionAnswerTitle>★ {answer.title}</QuestionAnswerTitle>
                {answer.content}
              </QuestionContent>
            );
          })}
        </QuestionItemBox>
      ))}
    </ContributionAboutWrapper>
  );
};
export default ContributionAbout;

const ContributionAboutWrapper = styled.div`
  width: 100%;
`;
const AboutTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
`;
const QuestionItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const QuestionTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #333333;
  margin-top: 20px;
`;
const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuestionAnswerTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #333333;
`;

const LinkTextBtn = styled.a`
  font-weight: 700;
  color: #4c91f0;
  cursor: pointer;
`;
const QusetionAnswerContentBox = styled.div`
  padding: 10px;
  box-sizing: border-box;
  background: #f8f2ca;
`;
const CommunityBox = styled(QusetionAnswerContentBox)`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const CommunityUserNumberBox = styled(QusetionAnswerContentBox)`
  display: flex;
  justify-content: space-evenly;
`;
const CommunityUserNumberItem = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;
const CommunityUserNumberLabelText = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`;
const CommunityUserNumberValueText = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  white-space: nowrap;
`;

const CommunityImg = styled.img<{ radius?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.radius || '50%'};
`;
const CommunityCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const CommunityName = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
`;
const CommunityLinkNameBox = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const CommunityLinkName = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`;
const DiscordMembersBox = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const DiscordMembersLabel = styled.div`
  width: 8px;
  height: 8px;
  background: rgba(51, 51, 51, 0.3);
  border-radius: 50%;
`;
const DiscordMembers = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`;

const LinkBtn = styled(ButtonBase)`
  width: 60px;
  height: 28px;
  border-radius: 31px;
  box-shadow: none;
`;
const LinkBtnTwitter = styled(LinkBtn)`
  background: #4c91f0;
`;
const LinkBtnDiscord = styled(LinkBtn)`
  background: #7788d6;
`;
const QusetionAnswerImg = styled.img`
  width: 100%;
`;
const GetContributionTokenBtn = styled(CommunityCheckinButton)`
  height: 48px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;
