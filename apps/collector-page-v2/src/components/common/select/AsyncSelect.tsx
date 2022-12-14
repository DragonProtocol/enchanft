/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:59:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 12:25:33
 * @Description: file description
 */
import React, { useRef } from 'react';

import AsyncSelect from 'react-select/async';

type ValueType = string | number;
type Option = {
  value: ValueType;
  label: string;
};
type Props = {
  value: ValueType;
  onChange: (value: ValueType) => void;
  valueField?: string;
  labelField?: string;
  getOptions: (inputValue: string) => Promise<any[]>;
};
export default function ({
  value,
  onChange,
  valueField = 'id',
  labelField = 'name',
  getOptions,
}: Props) {
  const cacheOptions = useRef<Option[]>([]);
  const loadOptions = (inputValue, callback) => {
    getOptions(inputValue)
      .then((data) => {
        const options = data.map((item) => ({
          value: item[valueField],
          label: item[labelField],
        }));
        callback(options);
        cacheOptions.current = options;
      })
      .catch((err) => callback([]));
  };
  const SelectValue = cacheOptions.current.find((item) => item.value === value);
  return (
    <AsyncSelect
      defaultOptions
      value={SelectValue}
      onChange={(option) => onChange(option.value)}
      cacheOptions
      loadOptions={loadOptions}
    />
  );
}
