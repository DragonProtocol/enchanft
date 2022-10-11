/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:00:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 17:51:16
 * @Description: file description
 */
import InputBase from '@mui/material/InputBase'
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import PngIconInputSearchEmoji from '../icons/PngIconInputSearchEmoji'

import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
export type InputSearchProps = HTMLAttributes<HTMLDivElement> & {
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
  ...divProps
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
    <InputSearchWrapper {...divProps}>
      <PngIconInputSearchEmoji size="24px" />
      <InputBaseBox placeholder={placeholder} onChange={handleChange} value={value} />
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
  width: 100%;
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
const InputBaseBox = styled(InputBase)`
  flex: 1;
`
