/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 18:32:23
 * @Description: file description
 */
import styled from 'styled-components';
import { OrderBy, ProjectType, Reward } from '../../services/types/common';
import { EventExploreListParams } from '../../services/types/event';
import SearchInput from '../common/input/SearchInput';
import Select, { SelectOption } from '../common/select/Select';
import OrderBySvg from '../common/icons/svgs/activity-heart.svg';
import RewardSvg from '../common/icons/svgs/gift.svg';
import ProjectTypeSvg from '../common/icons/svgs/grid.svg';
import PlatformFilter from '../business/filter/PlatformFilter';

export type EventExploreListFilterValues = Pick<
  EventExploreListParams,
  'orderBy' | 'platform' | 'reward' | 'projectType' | 'keywords'
>;
const orderByOptions: Array<SelectOption> = [
  {
    value: OrderBy.FORU,
    label: 'For U',
  },
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
];
const rewardOptions: Array<SelectOption> = [
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
const projectTypeOptions: Array<SelectOption> = [
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

export const defaultEventExploreListFilterValues: EventExploreListFilterValues =
  {
    orderBy: orderByOptions[0].value,
    platform: '',
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
      <Left>
        <Select
          options={orderByOptions}
          onChange={(value) => onChange({ ...values, orderBy: value })}
          value={orderBy}
          iconUrl={OrderBySvg}
        />
        <PlatformFilter
          onChange={(value) => onChange({ ...values, platform: value })}
          value={platform}
        />
        <Select
          options={rewardOptions}
          onChange={(value) => onChange({ ...values, reward: value })}
          value={reward}
          iconUrl={RewardSvg}
        />
        <Select
          options={projectTypeOptions}
          onChange={(value) => onChange({ ...values, projectType: value })}
          value={projectType}
          iconUrl={ProjectTypeSvg}
        />
      </Left>

      <Search onSearch={(value) => onChange({ ...values, keywords: value })} />
    </EventExploreListFilterWrapper>
  );
}
const EventExploreListFilterWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Search = styled(SearchInput)`
  max-width: 400px;
`;
