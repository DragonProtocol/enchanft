/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 10:32:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 15:33:06
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

type OptionValue = string | number
type Option = {
  label: string
  value: OptionValue
}
export type ButtonRadioGroupProps = {
  options: Option[]
  value: OptionValue
  onChange?: (value: OptionValue) => void
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({ options, value, onChange }: ButtonRadioGroupProps) => {
  const handleChange = (v: OptionValue) => {
    if (onChange) {
      onChange(v)
    }
  }
  return (
    <ButtonRadioGroupWrapper>
      {options.map(({ label, value: v }) => (
        <ProjectStatusSelectorItem key={v} isActive={v === value} onClick={() => handleChange(v)}>
          {label}
        </ProjectStatusSelectorItem>
      ))}
    </ButtonRadioGroupWrapper>
  )
}
export default ButtonRadioGroup
const ButtonRadioGroupWrapper = styled.div`
  height: 50px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 100);
  border: 2px solid rgba(21, 21, 21, 100);
  display: flex;
`
const ProjectStatusSelectorItem = styled.div<{ isActive?: boolean }>`
  width: 85px;
  height: 100%;
  cursor: pointer;
  border-left: 2px solid rgba(21, 21, 21, 100);
  &:first-child {
    border-left: none;
  }
  background: ${(props) => (props.isActive ? '#000' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  display: flex;
  justify-content: center;
  align-items: center;
`
