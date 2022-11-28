/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 10:32:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 17:44:27
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

type OptionValue = string | number;
type Option = {
  label: string;
  value: OptionValue;
};
export type ButtonRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  options: Option[];
  value: OptionValue;
  onChange?: (value: OptionValue) => void;
};

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  options,
  value,
  onChange,
  ...divProps
}: ButtonRadioGroupProps) => {
  const handleChange = (v: OptionValue) => {
    if (onChange) {
      onChange(v);
    }
  };
  return (
    <ButtonRadioGroupWrapper {...divProps}>
      {options.map(({ label, value: v }) => (
        <ButtonRadioGroupOption
          key={v}
          isActive={v === value}
          onClick={() => handleChange(v)}
        >
          {label}
        </ButtonRadioGroupOption>
      ))}
    </ButtonRadioGroupWrapper>
  );
};
export default ButtonRadioGroup;
const ButtonRadioGroupWrapper = styled.div`
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  box-shadow: inset 0px 0px 0px 2px #333333;
  border-radius: 10px;
  overflow: hidden;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
`;
const ButtonRadioGroupOption = styled.div<{ isActive?: boolean }>`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  background: ${(props) => (props.isActive ? '#333333' : '')};
  color: ${(props) => (props.isActive ? '#FFFFFF' : '#333333')};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  border-right: 2px solid #333333;
  &:last-child {
    border: none;
  }
`;
