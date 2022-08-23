/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-15 15:37:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 12:03:03
 * @Description: file description
 */
import { TaskDetailEntity } from '../features/task/taskDetailSlice'
import { TodoTaskItemForEntity } from '../features/user/todoTasksSlice'
import { TaskDetailResponse, TodoTaskActionItem, TodoTaskItem, UserActionStatus } from '../types/api'
import { RewardType, TaskTodoCompleteStatus } from '../types/entities'

export const getTaskRewardTypeLabel = (reward?: { type: RewardType; raffled: boolean }) => {
  let rewardTypeLabel = 'Unknown Reward Type'
  if (reward) {
    switch (reward.type) {
      case RewardType.WHITELIST:
        rewardTypeLabel = reward.raffled ? 'Raffle' : 'FCFS'
        break
      case RewardType.OTHERS:
        rewardTypeLabel = reward.raffled ? 'Raffle' : 'FCFS'
        break
    }
  }
  return rewardTypeLabel
}

type TaskEntityType = TodoTaskItemForEntity | TaskDetailEntity
export const getTaskEntityForUpdateActionAfter = (task: TaskEntityType, action: TodoTaskActionItem): TaskEntityType => {
  const { id } = action
  const actions = task.actions.map((item) => (item.id === id ? action : item))
  const taskIsCompleted = actions.every((item) => item.status === UserActionStatus.DONE)
  let status = task.status
  if (taskIsCompleted) {
    status = TaskTodoCompleteStatus.COMPLETED
  } else {
    const taskIsInProgress = actions.some((item) => item.status === UserActionStatus.DONE)
    if (taskIsInProgress) {
      status = TaskTodoCompleteStatus.IN_PRGRESS
    }
  }
  return { ...task, status, actions }
}
