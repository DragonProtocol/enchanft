/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:00:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 13:19:24
 * @Description: file description
 */
import InputBase from '@mui/material/InputBase'
import React from 'react'
import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
export type InputSearchProps = {
  value: string
  placeholder?: string
  onChange?: (value: string) => void
  displayClear?: boolean
}
const InputSearch: React.FC<InputSearchProps> = ({
  value,
  placeholder = 'Search',
  onChange,
  displayClear = true,
}: InputSearchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO 防抖处理
    const value = e.target.value
    if (onChange) {
      onChange(value)
    }
  }

  const handleClear = () => {
    if (onChange) {
      onChange('')
    }
  }
  return (
    <InputSearchWrapper>
      <SearchIcon />
      <InputBase
        sx={{ ml: 1, flex: 1, height: 'auto' }}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
      {displayClear && value && (
        <IconButton onClick={handleClear}>
          <CancelIcon />
        </IconButton>
      )}
    </InputSearchWrapper>
  )
}
export default InputSearch
const InputSearchWrapper = styled.div`
  flex: 1;
  height: 50px;
  padding: 13px;
  border-radius: 15px;
  font-size: 14px;
  border: 2px solid rgba(0, 0, 0, 1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
`
