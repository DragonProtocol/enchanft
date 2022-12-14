/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 14:37:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 17:31:11
 * @Description: file description
 */
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

const Input = styled.input`
  width: 100%;
  height: 48px;
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  outline: none;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
  background: #1a1e23;
  border: 1px solid #39424c;
  border-radius: 12px;
  gap: 10px;
  &:focus-within {
    border-color: #555;
  }

  &::placeholder {
    color: #4e5a6e;
  }
`;

export interface Props extends StyledComponentPropsWithRef<'input'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  debounce?: boolean; // 是否开启防抖 default: false
  debounceMs?: number; // 防抖间隔毫秒数 default: 300
}

export default function InputBase({
  value,
  onChange,
  placeholder = 'Search',
  debounce: needDebounce,
  debounceMs = 300,
  ...otherProps
}: Props) {
  const handleDebounceSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
    }, debounceMs),
    [onChange, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (needDebounce) {
        handleDebounceSearch(e);
      } else if (onChange) onChange(e);
    },
    [needDebounce, handleDebounceSearch]
  );

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      {...otherProps}
    />
  );
}
