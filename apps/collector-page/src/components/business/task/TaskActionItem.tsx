/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:46:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 13:49:12
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ActionData, ActionType, Project, TaskType } from '../../../types/entities'
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
  project: {
    slug: string
  }
}

export type TaskActionItemProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onTwitter?: (callback: () => void) => void
  onDiscord?: (callback: () => void) => void
  onFollowCommunity?: (action: TaskActionItemDataType) => void
  verifying?: boolean
  copyBgc?: string
}

const TaskActionItem: React.FC<TaskActionItemProps> = ({
  data,
  allowHandle,
  onTwitter,
  onDiscord,
  onFollowCommunity,
  verifying,
  copyBgc,
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
      case ActionType.RETWEET:
        // 转发twitter
        return <ActionRetweetTwitter data={data} onTwitter={onTwitter} allowHandle={allowHandle} />
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
      default:
        return name
    }
  }
  const renderStatus = () => {
    if (allowHandle) {
      switch (status) {
        case UserActionStatus.DONE:
          return <IconCheckboxChecked />
        case UserActionStatus.TODO:
          return verifying ? <Loading size="1.5rem" /> : <IconCheckbox />
      }
    }
    return null
  }
  return (
    <TaskActionItemWrapper>
      <TaskActionContent>{renderAction()}</TaskActionContent>
      {renderStatus()}
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
