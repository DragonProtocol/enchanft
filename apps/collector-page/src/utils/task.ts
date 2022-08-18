/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-15 15:37:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 15:40:48
 * @Description: file description
 */
import { RewardType } from '../types/entities'

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
