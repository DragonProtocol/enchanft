/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 16:41:04
 * @Description: file description
 */
import styled from 'styled-components';
import Select from 'react-select';
import {
  OrderBy,
  Platform,
  ProjectType,
  Reward,
} from '../../services/types/common';
import { EventExploreListParams } from '../../services/types/event';

export type EventExploreListFilterValues = Pick<
  EventExploreListParams,
  'orderBy' | 'platform' | 'reward' | 'projectType' | 'keywords'
>;
const orderByOptions: Array<{
  value: EventExploreListFilterValues['orderBy'];
  label: string;
}> = [
  {
    value: OrderBy.NEWEST,
    label: 'Newest',
  },
  {
    value: OrderBy.EARLIEST,
    label: 'Earliest',
  },
  {
    value: OrderBy.TRENDING,
    label: 'Trending',
  },
  {
    value: OrderBy.FORU,
    label: 'For U',
  },
];
const platformOptions: Array<{
  value: EventExploreListFilterValues['platform'];
  label: string;
}> = [
  {
    value: '',
    label: 'All Platform',
  },
  {
    value: Platform.GALXE,
    label: 'Galxe',
  },
  {
    value: Platform.NOOX,
    label: 'Noox',
  },
  {
    value: Platform.POAP,
    label: 'POAP',
  },
  {
    value: Platform.QUEST3,
    label: 'Quest3',
  },
];
const rewardOptions: Array<{
  value: EventExploreListFilterValues['reward'];
  label: string;
}> = [
  {
    value: '',
    label: 'All Reward',
  },
  {
    value: Reward.BADGE,
    label: 'Badge',
  },
  {
    value: Reward.NFT,
    label: 'NFT',
  },
  {
    value: Reward.TOKEN,
    label: 'Token',
  },
  {
    value: Reward.WL,
    label: 'WL',
  },
];
const projectTypeOptions: Array<{
  value: EventExploreListFilterValues['projectType'];
  label: string;
}> = [
  {
    value: '',
    label: 'All Project',
  },
  {
    value: ProjectType.DAO,
    label: 'Dao',
  },
  {
    value: ProjectType.DEFI,
    label: 'DeFi',
  },
  {
    value: ProjectType.GAME,
    label: 'Game',
  },
  {
    value: ProjectType.NFT,
    label: 'NFT',
  },
];

export const defaultEventExploreListFilterValues = {
  orderBy: orderByOptions[0].value,
  platform: platformOptions[0].value,
  reward: rewardOptions[0].value,
  projectType: projectTypeOptions[0].value,
  keywords: '',
};
type EventExploreListFilterProps = {
  values: EventExploreListFilterValues;
  onChange: (values: EventExploreListFilterValues) => void;
};
export default function EventExploreListFilter({
  values,
  onChange,
}: EventExploreListFilterProps) {
  const { orderBy, platform, reward, projectType } = values;
  return (
    <EventExploreListFilterWrapper>
      <Select
        name="orderBy"
        options={orderByOptions}
        onChange={({ value }) => onChange({ ...values, orderBy: value })}
        value={orderByOptions.find((item) => item.value === orderBy)}
      />
      <Select
        name="platform"
        options={platformOptions}
        onChange={({ value }) => onChange({ ...values, platform: value })}
        value={platformOptions.find((item) => item.value === platform)}
      />
      <Select
        name="reward"
        options={rewardOptions}
        onChange={({ value }) => onChange({ ...values, reward: value })}
        value={rewardOptions.find((item) => item.value === reward)}
      />
      <Select
        name="projectType"
        options={projectTypeOptions}
        onChange={({ value }) => onChange({ ...values, projectType: value })}
        value={projectTypeOptions.find((item) => item.value === projectType)}
      />
      <input
        type="search"
        name="keywords"
        onChange={(e) => onChange({ ...values, keywords: e.target.value })}
      />
    </EventExploreListFilterWrapper>
  );
}
const EventExploreListFilterWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;
