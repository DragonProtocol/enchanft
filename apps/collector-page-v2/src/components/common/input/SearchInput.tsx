/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-09 19:37:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 16:53:00
 * @Description: file description
 */
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import SearchSvg from '../icons/svgs/search.svg';

const Wrapper = styled.div`
  width: 100%;
  height: 48px;
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
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Input = styled.input`
  width: 0px;
  flex: 1;
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  outline: none;
  border: none;
  background: transparent;

  &::placeholder {
    color: #666;
  }
`;

interface Props extends StyledComponentPropsWithRef<'div'> {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounce?: boolean; // 是否开启防抖 default: true
  debounceMs?: number; // 防抖间隔毫秒数 default: 300
}

export default function SearchInput({
  onSearch,
  placeholder = 'Search',
  debounce: needDebounce = true,
  debounceMs = 300,
  ...otherProps
}: Props) {
  const [value, setValue] = useState('');

  const handleDebounceSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (needDebounce) {
        handleDebounceSearch(e.target.value);
      } else {
        onSearch(e.target.value);
      }
    },
    [setValue, needDebounce, handleDebounceSearch]
  );

  return (
    <Wrapper {...otherProps}>
      <Icon src={SearchSvg} className="search-input-icon" />
      <Input
        className="search-input-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </Wrapper>
  );
}