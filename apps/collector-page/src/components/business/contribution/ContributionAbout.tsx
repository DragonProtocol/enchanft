/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 12:04:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-30 11:56:29
 * @Description: file description
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import ButtonBase, { ButtonPrimary } from '../../common/button/ButtonBase'
import IconTwitterWhite from '../../common/icons/IconTwitterWhite'
import IconDiscordWhite from '../../common/icons/IconDiscordWhite'
import likeReplyRetweetImg from './imgs/like_reply_retweet.png'
import discordChatInviteImg from './imgs/discord_chat_invite.png'
import { getTwitterHomeLink } from '../../../utils/twitter'
export type ContributionAboutDataType = {
  name: string
  icon: string
  twitter: string
  twitterId: string
  discordId: string
  discord: string
  discordName: string
  discordMembers?: number
  discordInviteUrl: string
}

const enum QA_ANSWER_TYPE {
  WL = 'WL',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}
export type ContributionAboutViewConfigType = {
  displayCheckin: boolean
  loadingCheckin: boolean
  disabledCheckin: boolean
  isCheckedin: boolean
  checkinScore: number
}

export type ContributionAboutDataViewType = {
  data: ContributionAboutDataType
  viewConfig?: ContributionAboutViewConfigType
}
export type ContributionAboutHandlesType = {
  onCommunityCheckin?: () => void
}

export type ContributionAboutProps = ContributionAboutDataViewType & ContributionAboutHandlesType

const defaultViewConfig = {
  displayCheckin: false,
  loadingCheckin: false,
  disabledCheckin: false,
  isCheckedin: false,
  checkinScore: 0,
}
const ContributionAbout: React.FC<ContributionAboutProps> = ({
  data,
  viewConfig,
  onCommunityCheckin,
}: ContributionAboutProps) => {
  const { name, icon, twitterId, discordId, discordInviteUrl, discordName, discordMembers } = data
  const { displayCheckin, loadingCheckin, disabledCheckin, isCheckedin, checkinScore } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const onTwitter = () => {
    if (!twitterId) return
    const twitterHomeLink = getTwitterHomeLink(twitterId)
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(twitterHomeLink, twitterId, winParams)
  }
  const onDiscord = () => {
    if (!discordInviteUrl) return
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(discordInviteUrl, discordName, winParams)
  }
  const TwitterLinkComponent = <LinkTextBtn onClick={onTwitter}>@{twitterId || name}</LinkTextBtn>
  const DiscordLinkComponent = <LinkTextBtn onClick={onDiscord}>#{discordName || name}</LinkTextBtn>
  const checkinBtnText = isCheckedin ? `Checked In ! ` : 'Get Toady’s Contribution Token !'
  const questions = [
    {
      title: 'Q: How to get contribution in this community?',
      answers: [
        {
          display: true,
          type: QA_ANSWER_TYPE.WL,
          title: `Join the community.`,
          content: ``,
        },
        {
          display: !!twitterId,
          title: <>Follow {TwitterLinkComponent} on Twitter.</>,
          content: (
            <CommunityBox>
              <CommunityImg src={icon} />
              <CommunityCenter>
                <CommunityName>{name}</CommunityName>
                {twitterId && <CommunityLinkName>@{twitterId || name}</CommunityLinkName>}
              </CommunityCenter>
              {twitterId && (
                <LinkBtnTwitter onClick={onTwitter}>
                  <IconTwitterWhite />
                </LinkBtnTwitter>
              )}
            </CommunityBox>
          ),
        },
        {
          display: !!twitterId,
          type: QA_ANSWER_TYPE.TWITTER,
          title: <>Like, retweet or replay {TwitterLinkComponent} daily on Twitter to earn contribution point.</>,
          content: <QusetionAnswerImg src={likeReplyRetweetImg} />,
        },
        {
          title: <>Join {DiscordLinkComponent} server on Discord.</>,
          type: QA_ANSWER_TYPE.DISCORD,
          content: (
            <CommunityBox>
              <CommunityImg src={icon} radius={'16px'} />
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
          type: QA_ANSWER_TYPE.DISCORD,
          title: <>Chat in or invite friends to the {DiscordLinkComponent} daily on Discord.</>,
          content: <QusetionAnswerImg src={discordChatInviteImg} />,
        },
        {
          display: displayCheckin,
          type: QA_ANSWER_TYPE.DISCORD,
          title: `Daily Click.`,
          content: (
            <GetContributionTokenBtn disabled={disabledCheckin} onClick={onCommunityCheckin}>
              {loadingCheckin ? 'loading ...' : checkinBtnText}
            </GetContributionTokenBtn>
          ),
        },
      ],
    },
    {
      title: 'Q: What is the use of contribution?',
      answers: [
        {
          display: true,
          type: QA_ANSWER_TYPE.WL,
          title: 'Whitelist',
          content: '',
        },
        {
          display: true,
          type: QA_ANSWER_TYPE.WL,
          title: 'Community events',
          content: '',
        },
      ],
    },
  ]
  return (
    <ContributionAboutWrapper>
      <AboutTitle>About Contribution</AboutTitle>
      {questions.map((question, index) => (
        <QuestionItemBox key={index}>
          <QuestionTitle>{question.title}</QuestionTitle>
          {question.answers.map((answer, index) => {
            if (!answer.display) return null
            return (
              <QuestionContent key={index}>
                <QuestionAnswerTitle>★ {answer.title}</QuestionAnswerTitle>
                {answer.content}
              </QuestionContent>
            )
          })}
        </QuestionItemBox>
      ))}
    </ContributionAboutWrapper>
  )
}
export default ContributionAbout

const ContributionAboutWrapper = styled.div`
  width: 100%;
`
const AboutTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #333333;
`
const QuestionItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const QuestionTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #333333;
  margin-top: 20px;
`
const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const QuestionAnswerTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #333333;
`

const LinkTextBtn = styled.a`
  font-weight: 700;
  color: #4c91f0;
  cursor: pointer;
`

const CommunityBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  background: #f8f2ca;
  align-items: center;
`
const CommunityImg = styled.img<{ radius?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.radius || '50%'};
`
const CommunityCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const CommunityName = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
`
const CommunityLinkNameBox = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`
const CommunityLinkName = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`
const DiscordMembersBox = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`
const DiscordMembersLabel = styled.div`
  width: 8px;
  height: 8px;
  background: rgba(51, 51, 51, 0.3);
  border-radius: 50%;
`
const DiscordMembers = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`

const LinkBtn = styled(ButtonBase)`
  width: 60px;
  height: 28px;
  border-radius: 31px;
  box-shadow: none;
`
const LinkBtnTwitter = styled(LinkBtn)`
  background: #4c91f0;
`
const LinkBtnDiscord = styled(LinkBtn)`
  background: #7788d6;
`
const QusetionAnswerImg = styled.img`
  width: 100%;
`
const GetContributionTokenBtn = styled(ButtonPrimary)`
  height: 48px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`
