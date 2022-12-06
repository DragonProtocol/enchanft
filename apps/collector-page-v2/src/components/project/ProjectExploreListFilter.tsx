/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 16:50:03
 * @Description: file description
 */
import styled from 'styled-components';
import Select from 'react-select';
import { OrderBy, ProjectType } from '../../services/types/common';
import { ProjectExploreListParams } from '../../services/types/project';

export type ProjectExploreListFilterValues = Pick<
  ProjectExploreListParams,
  'orderBy' | 'type' | 'keywords'
>;
const orderByOptions: Array<{
  value: ProjectExploreListFilterValues['orderBy'];
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
const typeOptions: Array<{
  value: ProjectExploreListFilterValues['type'];
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

export const defaultProjectExploreListFilterValues = {
  orderBy: orderByOptions[0].value,
  type: typeOptions[0].value,
  keywords: '',
};
type ProjectExploreListFilterProps = {
  values: ProjectExploreListFilterValues;
  onChange: (values: ProjectExploreListFilterValues) => void;
};
export default function ProjectExploreListFilter({
  values,
  onChange,
}: ProjectExploreListFilterProps) {
  const { orderBy, type, keywords } = values;
  return (
    <ProjectExploreListFilterWrapper>
      <Select
        name="orderBy"
        options={orderByOptions}
        onChange={({ value }) => onChange({ ...values, orderBy: value })}
        value={orderByOptions.find((item) => item.value === orderBy)}
      />
      <Select
        name="type"
        options={typeOptions}
        onChange={({ value }) => onChange({ ...values, type: value })}
        value={typeOptions.find((item) => item.value === type)}
      />
      <input
        type="search"
        name="keywords"
        onChange={(e) => onChange({ ...values, keywords: e.target.value })}
        value={keywords}
      />
    </ProjectExploreListFilterWrapper>
  );
}
const ProjectExploreListFilterWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;
