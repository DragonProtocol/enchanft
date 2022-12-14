/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 12:43:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 12:50:10
 * @Description: file description
 */
import { fetchListForProjectExplore } from '../../../services/api/project';
import { OrderBy } from '../../../services/types/common';
import AsyncSelect from '../../common/select/AsyncSelect';

type ValueType = string | number;
type Props = {
  value: ValueType;
  onChange: (value: ValueType) => void;
};
export default function ProjectAsyncSelect({ value, onChange }: Props) {
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
  return (
    <AsyncSelect
      value={value}
      onChange={onChange}
      getOptions={getProjectOptions}
    />
  );
}
