/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 12:04:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-01 18:49:49
 * @Description: file description
 */
import React, { useState } from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import IconTwitterWhite from '../../common/icons/IconTwitterWhite'
import likeReplyRetweetImg from './imgs/like_reply_retweet.png'
export type ContributionAboutDataType = {
  name: string
  twitter: string
  twitterName: string
  icon: string
}

export type ContributionAboutViewConfigType = {}

export type ContributionAboutDataViewType = {
  data: ContributionAboutDataType
  viewConfig?: ContributionAboutViewConfigType
}
export type ContributionAboutHandlesType = {}

export type ContributionAboutProps = ContributionAboutDataViewType & ContributionAboutHandlesType

const defaultViewConfig = {}
const ContributionAbout: React.FC<ContributionAboutProps> = ({ data, viewConfig }: ContributionAboutProps) => {
  const { name, twitter, twitterName, icon } = data
  const {} = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const onTwitter = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(twitter, name, winParams)
  }
  const TwitterLinkComponent = twitter && <TwitterLink onClick={onTwitter}>@{twitterName || name}</TwitterLink>

  const questions = [
    {
      title: 'Q: How to get contribution in this community?',
      answers: [
        {
          title: `Join the community.`,
          content: ``,
        },
        {
          title: <>Follow {TwitterLinkComponent} on Twitter.</>,
          content: (
            <CommunityBox>
              <CommunityImg src={icon} />
              <CommunityCenter>
                <CommunityName>{name}</CommunityName>
                {twitter && <CommunityTwitterName>@{twitterName || name}</CommunityTwitterName>}
              </CommunityCenter>
              {twitter && (
                <CommunityTwitterBtn onClick={onTwitter}>
                  <IconTwitterWhite />
                </CommunityTwitterBtn>
              )}
            </CommunityBox>
          ),
        },
        {
          title: <>Like, retweet or replay {TwitterLinkComponent} daily on Twitter to earn contribution point.</>,
          content: <LikeReplyRetweetImg src={likeReplyRetweetImg} />,
        },
      ],
    },
    {
      title: 'Q: What is the use of contribution?',
      answers: [
        {
          title: 'Whitelist',
          content: '',
        },
        {
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
          {question.answers.map((answer, index) => (
            <QuestionContent key={index}>
              <QuestionAnswerTitle>
                {index + 1}. {answer.title}
              </QuestionAnswerTitle>
              {answer.content}
            </QuestionContent>
          ))}
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

const TwitterLink = styled.a`
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
const CommunityImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
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
const CommunityTwitterName = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: #333333;
`
const CommunityTwitterBtn = styled(ButtonBase)`
  width: 60px;
  height: 28px;
  background: #4c91f0;
  border-radius: 31px;
  box-shadow: none;
`
const LikeReplyRetweetImg = styled.img`
  width: 100%;
`
