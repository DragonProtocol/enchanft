/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 18:32:40
 * @Description: file description
 */
import styled from 'styled-components';
import { OrderBy, ProjectType } from '../../services/types/common';
import { ProjectExploreListParams } from '../../services/types/project';
import SearchInput from '../common/input/SearchInput';
import Select from '../common/select/Select';

export type ProjectExploreListFilterValues = Pick<
  ProjectExploreListParams,
  'orderBy' | 'type' | 'keywords'
>;
const orderByOptions: Array<{
  value: ProjectExploreListFilterValues['orderBy'];
  label: string;
}> = [
  {
    value: OrderBy.FORU,
    label: 'For U',
  },
  {
    value: OrderBy.NEWEST,
    label: 'Newest',
  },
  {
    value: OrderBy.TRENDING,
    label: 'Trending',
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
      <Left>
        <Select
          options={orderByOptions}
          onChange={(value) => onChange({ ...values, orderBy: value })}
          value={orderBy}
        />
        <Select
          options={typeOptions}
          onChange={(value) => onChange({ ...values, type: value })}
          value={type}
        />
      </Left>
      <Search onSearch={(value) => onChange({ ...values, keywords: value })} />
    </ProjectExploreListFilterWrapper>
  );
}
const ProjectExploreListFilterWrapper = styled.div`
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
