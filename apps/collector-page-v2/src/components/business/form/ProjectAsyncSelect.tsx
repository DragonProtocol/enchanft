/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 12:43:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 15:46:44
 * @Description: file description
 */
import { StyledComponentPropsWithRef } from 'styled-components';
import { fetchListForProjectExplore } from '../../../services/api/project';
import { OrderBy } from '../../../services/types/common';
import AsyncSelect, {
  AsyncSelectV2,
  Option,
} from '../../common/select/AsyncSelect';

type ValueType = string | number;
type Props = StyledComponentPropsWithRef<'div'> & {
  value: ValueType;
  onChange?: (value: ValueType) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSelectOption?: (option: Option) => void;
};

const getProjectOptions = (keywords: string) => {
  // TODO 暂时先取TRENDING的前50条，后期要有一个获取所有project的接口
  const params = {
    orderBy: OrderBy.TRENDING,
    pageSize: 50,
    pageNumber: 0,
    keywords,
  };
  return fetchListForProjectExplore(params).then((resp) => resp.data.data);
};

export default function ProjectAsyncSelect({
  value,
  onChange,
  onSelectOption,
}: Props) {
  return (
    <AsyncSelect
      value={value}
      onChange={onChange}
      onSelectOption={onSelectOption}
      getOptions={getProjectOptions}
    />
  );
}

export function ProjectAsyncSelectV2({ value, onChange }: Props) {
  return (
    <AsyncSelectV2
      value={value}
      onChange={onChange}
      getOptions={getProjectOptions}
    />
  );
}
