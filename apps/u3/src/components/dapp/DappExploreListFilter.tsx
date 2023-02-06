/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 16:47:42
 * @Description: file description
 */
import { useMemo } from 'react';
import styled from 'styled-components';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { ProjectExploreListParams } from '../../services/types/project';
import SearchInput from '../common/input/SearchInput';
import Select from '../common/select/Select';
import GridSvgUrl from '../common/icons/svgs/grid.svg';
import ListSvgUrl from '../common/icons/svgs/list.svg';

export type DappExploreListFilterValues = Pick<
  ProjectExploreListParams,
  'chains' | 'types' | 'keywords'
>;

export const defaultChainOption = {
  value: '',
  label: 'All Chains',
};
export const defaultTypeOption = {
  value: '',
  label: 'All Categories',
};

export const defaultDappExploreListFilterValues: DappExploreListFilterValues = {
  chains: [defaultChainOption.value],
  types: [defaultTypeOption.value],
  keywords: '',
};
type DappExploreListFilterProps = {
  values: DappExploreListFilterValues;
  onChange: (values: DappExploreListFilterValues) => void;
};
export default function DappExploreListFilter({
  values,
  onChange,
}: DappExploreListFilterProps) {
  const { topics } = useConfigsTopics();
  const chainOptions = useMemo(
    () => [
      defaultChainOption,
      ...topics.chains.map((item) => ({
        value: item.chainEnum,
        label: item.name,
        iconUrl: item.image,
      })),
    ],
    [topics]
  );
  const typeOptions = useMemo(
    () => [
      defaultTypeOption,
      ...topics.projectTypes.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    ],
    [topics]
  );
  const { types, chains, keywords } = values;
  return (
    <DappExploreListFilterWrapper>
      <Left>
        <Select
          iconUrl={GridSvgUrl}
          options={chainOptions}
          onChange={(value) => onChange({ ...values, chains: [value] })}
          value={chains[0]}
        />
        <Select
          iconUrl={ListSvgUrl}
          options={typeOptions}
          onChange={(value) => onChange({ ...values, types: [value] })}
          value={types[0]}
        />
      </Left>
      <Search onSearch={(value) => onChange({ ...values, keywords: value })} />
    </DappExploreListFilterWrapper>
  );
}
const DappExploreListFilterWrapper = styled.div`
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
