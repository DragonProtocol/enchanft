/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:00:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 13:24:14
 * @Description: file description
 */
import InputBase from '@mui/material/InputBase'
import React from 'react'
import styled from 'styled-components'
import PngIconInputSearchEmoji from '../icons/PngIconInputSearchEmoji'

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
      <PngIconInputSearchEmoji size="24px" />
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
  background: #ebeee4;
  border-radius: 10px;
  font-size: 18px;
  line-height: 27px;
  color: rgba(51, 51, 51, 0.3);
  padding: 13px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
`
