/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 12:43:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 13:42:52
 * @Description: file description
 */
import React, { useEffect, useRef, useState } from 'react';
import { StyledComponentPropsWithRef } from 'styled-components';
import { getAllPlatform } from '../../../services/api/common';
import Select, { SelectOption } from '../../common/select/Select';

type ValueType = string | number;
type Props = StyledComponentPropsWithRef<'div'> & {
  value: ValueType;
  onChange: (value: ValueType) => void;
};
export default function PlatformSelect({ value, onChange }: Props) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    getAllPlatform().then((resp) =>
      setOptions(
        resp.data.data.map((item) => ({
          value: item.platform,
          label: item.platform,
          iconUrl: item.platformLogo,
        }))
      )
    );
  }, []);
  return <Select options={options} value={value} onChange={onChange} />;
}
