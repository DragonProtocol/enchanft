import { RewardData, RewardType } from '../Components/TaskCreate/type';

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

export const getTaskRewardTypeValue = (reward?: {
  type: RewardType;
  raffled: boolean;
  name: string;
  data: RewardData;
}) => {
  let rewardTypeValue = 'Unknown Reward';
  if (reward) {
    switch (reward.type) {
      case RewardType.CONTRIBUTION_TOKEN:
        rewardTypeValue = `${reward.data?.token_num || ''} Contribution Token`;
        break;
      case RewardType.WHITELIST:
        rewardTypeValue = reward?.name || 'Whitelist';
        break;
      case RewardType.OTHERS:
        rewardTypeValue = reward?.name || 'Others';
        break;
    }
  }
  return rewardTypeValue;
};
