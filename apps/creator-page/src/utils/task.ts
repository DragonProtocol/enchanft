import { RewardType } from '../Components/TaskCreate/type';

export const getTaskRewardTypeLabel = (reward?: {
  type: RewardType;
  raffled: boolean;
}) => {
  let rewardTypeLabel = 'Unknown Reward Type';
  if (reward) {
    switch (reward.type) {
      case RewardType.CONTRIBUTION_TOKEN:
        rewardTypeLabel = reward.raffled ? 'Raffle' : 'FCFS';
        break;
      case RewardType.WHITELIST:
        rewardTypeLabel = reward.raffled ? 'Raffle' : 'FCFS';
        break;
      case RewardType.OTHERS:
        rewardTypeLabel = reward.raffled ? 'Raffle' : 'FCFS';
        break;
    }
  }
  return rewardTypeLabel;
};
