/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 10:32:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-10 11:22:29
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

type OptionValue = string | number
type Option = {
  label: string
  value: OptionValue
}
export type ButtonRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  options: Option[]
  value: OptionValue
  onChange?: (value: OptionValue) => void
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  options,
  value,
  onChange,
  ...divProps
}: ButtonRadioGroupProps) => {
  const handleChange = (v: OptionValue) => {
    if (onChange) {
      onChange(v)
    }
  }
  return (
    <ButtonRadioGroupWrapper {...divProps}>
      {options.map(({ label, value: v }) => (
        <ButtonRadioGroupOption key={v} isActive={v === value} onClick={() => handleChange(v)}>
          {label}
        </ButtonRadioGroupOption>
      ))}
    </ButtonRadioGroupWrapper>
  )
}
export default ButtonRadioGroup
const ButtonRadioGroupWrapper = styled.div`
  height: 50px;
  background: #f8f8f8;
  display: flex;
`
const ButtonRadioGroupOption = styled.div<{ isActive?: boolean }>`
  width: 85px;
  height: 100%;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  cursor: pointer;
  background: ${(props) => (props.isActive ? '#3DD606' : '#F8F8F8')};
  color: ${(props) => (props.isActive ? '#FFFFFF' : '#333333')};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
`
