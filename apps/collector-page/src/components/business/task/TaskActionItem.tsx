/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:46:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 11:51:37
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ActionData, ActionType, Chain, Project, TaskType } from '../../../types/entities'
import { UserActionStatus } from '../../../types/api'
import ActionContributionScore from './actions/ActionContributionScore'
import ActionFollowCommunity from './actions/ActionFollowCommunity'
import ActionFollowTwitter from './actions/ActionFollowTwitter'
import ActionInvitePeople from './actions/ActionInvitePeople'
import ActionJoinDiscord from './actions/ActionJoinDiscord'
import ActionDiscordInvitesPeople from './actions/ActionDiscordInvitesPeople'
import IconCheckbox from '../../common/icons/IconCheckbox'
import IconCheckboxChecked from '../../common/icons/IconCheckboxChecked'
import Loading from '../../common/loading/Loading'
import ActionRetweetTwitter from './actions/ActionRetweetTwitter'
import ActionLikeTwitter from './actions/ActionLikeTwitter'
import ActionCustom from './actions/ActionCustom'
import ActionDiscordObtainRole from './actions/ActionDiscordObtainRole'
import ActionNativeBalance from './actions/ActionNativeBalance'
import ActionNftBalance from './actions/ActionNftBalance'
import ActionQuestionnaire from './actions/ActionQuestionnaire'
import SubtractImg from '../../imgs/subtract.svg'
import ActionVerifyAnswer from './actions/ActionVerifyAnswer'
import ActionQuoteTwitter from './actions/ActionQuoteTwitter'
import ActionUploadImage from './actions/ActionUploadImage'
export type TaskActionItemDataType = {
  id: number
  name: string
  orderNum: number
  type: ActionType
  taskId: number
  projectId: number
  communityId: number
  description: string
  data: ActionData
  progress?: string
  status: UserActionStatus
  project?: {
    slug: string
  }
}

export type TaskActionItemStaticAttrGetters = {
  allowHandle?: boolean
  copyBgc?: string
}
export type TaskActionItemStaticFuncGetters = {
  onTwitter?: (callback: () => void) => void
  onDiscord?: (callback: () => void) => void
  onFollowCommunity?: (action: TaskActionItemDataType) => void
  onVerifyAction?: (action: TaskActionItemDataType) => void
  onCustomAction?: (action: TaskActionItemDataType) => void
  onQuestionConfirm?: (action: TaskActionItemDataType, answer: string) => void
  onQuestionVerifyConfirm?: (
    action: TaskActionItemDataType,
    answer: string,
    confirmCallback: (assertAnswer: boolean) => void,
  ) => void
  onWallet?: (chain: Chain, callback: () => void) => void
  onUploadImage?: (action: TaskActionItemDataType, url: string) => void
}
export type TaskActionItemProps = TaskActionItemStaticAttrGetters &
  TaskActionItemStaticFuncGetters & {
    data: TaskActionItemDataType
    verifying?: boolean
  }

const TaskActionItem: React.FC<TaskActionItemProps> = ({
  data,
  allowHandle,
  verifying,
  copyBgc,
  onTwitter,
  onDiscord,
  onFollowCommunity,
  onVerifyAction,
  onCustomAction,
  onQuestionConfirm,
  onQuestionVerifyConfirm,
  onWallet,
  onUploadImage,
}: TaskActionItemProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status } = data
  const renderAction = () => {
    switch (type) {
      case ActionType.FOLLOW_TWITTER:
        // 关注twitter
        return <ActionFollowTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
      case ActionType.TURN_ON_NOTIFICATION:
        // 关注社区
        return <ActionFollowCommunity data={data} onFollowCommunity={onFollowCommunity} allowHandle={allowHandle} />
      case ActionType.INVITE_PEOPLE:
        // 邀请人员
        return <ActionInvitePeople data={data} copyBgc={copyBgc} allowHandle={allowHandle} />
      case ActionType.JOIN_DISCORD:
        // 加入Discord
        return <ActionJoinDiscord data={data} onDiscord={onDiscord} allowHandle={allowHandle} />
      case ActionType.DISCORD_INVITES_PEOPLE:
        // 邀请人员加入Discord Server
        return <ActionDiscordInvitesPeople data={data} onDiscord={onDiscord} allowHandle={allowHandle} />
      case ActionType.DISCORD_OBTAIN_ROLE:
        // 获取doscord role
        return <ActionDiscordObtainRole data={data} onDiscord={onDiscord} allowHandle={allowHandle} />
      case ActionType.RETWEET:
        // 转发twitter
        return <ActionRetweetTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
      case ActionType.QUOTE_TWEET:
        // 转发twitter
        return <ActionQuoteTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
      case ActionType.LIKE_TWEET:
        // 点赞twitter
        return <ActionLikeTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
      case ActionType.UPDATE_BIO_OF_TWITTER:
        // 更新Twitter Bio
        // TODO 目前先复用follow twitter 的 action，后续如果action操作有差异再新建 action
        return <ActionFollowTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
      case ActionType.MEET_CONTRIBUTION_SCORE:
        // 达成贡献度
        return <ActionContributionScore data={data} allowHandle={allowHandle} />
      case ActionType.CUSTOM:
        // 自定义action
        return <ActionCustom data={data} allowHandle={allowHandle} onCustomAction={onCustomAction} />
      case ActionType.NATIVE_BALANCE:
        // 钱包余额
        return <ActionNativeBalance data={data} allowHandle={allowHandle} onWallet={onWallet} />
      case ActionType.NFT_BALANCE:
        // 持有指定nft
        return <ActionNftBalance data={data} allowHandle={allowHandle} />
      case ActionType.ANSWER_VERIFY:
        // 问答
        return (
          <ActionVerifyAnswer data={data} allowHandle={allowHandle} onQuestionVerifyConfirm={onQuestionVerifyConfirm} />
        )
      case ActionType.QUESTIONNAIRE:
        // 问卷调查
        return <ActionQuestionnaire data={data} allowHandle={allowHandle} onQuestionConfirm={onQuestionConfirm} />
      case ActionType.UPLOAD_IMAGE:
        // 图片上传
        return <ActionUploadImage data={data} allowHandle={allowHandle} onUploadImage={onUploadImage} />
      default:
        return name
    }
  }
  const onVerifyActionClick = useCallback(() => {
    if (onVerifyAction) {
      onVerifyAction(data)
    }
  }, [])
  const renderWeight = useCallback(() => {
    if (actionData.lucky_draw_weight) {
      return <TaskActionLuckyDrawWeight>+{actionData.lucky_draw_weight}</TaskActionLuckyDrawWeight>
    }
    return null
  }, [actionData])
  const renderStatus = () => {
    if (allowHandle) {
      switch (status) {
        case UserActionStatus.DONE:
          return <IconCheckboxChecked />
        case UserActionStatus.TODO:
          return verifying ? (
            <Loading size="1.5rem" />
          ) : (
            <TaskActionStatusTodo onClick={onVerifyActionClick}>
              <IconCheckbox />
            </TaskActionStatusTodo>
          )
      }
    }
    return null
  }
  return (
    <TaskActionItemWrapper>
      <TaskActionContent>{renderAction()}</TaskActionContent>
      <TaskActionRight>
        {renderWeight()}
        {renderStatus()}
      </TaskActionRight>
    </TaskActionItemWrapper>
  )
}
export default TaskActionItem
const TaskActionItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 20px;
  color: #333333;
`

const TaskActionContent = styled.div`
  flex: 1;
`
const TaskActionRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
const TaskActionStatusTodo = styled.div`
  cursor: pointer;
  height: 24px;
`
const TaskActionLuckyDrawWeight = styled.div`
  width: 20px;
  height: 16px;
  text-align: center;
  background-image: url(${SubtractImg});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  font-weight: 700;
  font-size: 11px;
  line-height: 16px;
  color: #f7f9f1;
`
