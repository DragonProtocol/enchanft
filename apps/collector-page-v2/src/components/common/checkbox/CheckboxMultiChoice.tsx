/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 15:24:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 11:21:06
 * @Description: file description
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import CheckSvg from '../icons/svgs/check.svg';

type ValueType = any;
export type CheckboxMultiChoiceOption = {
  value: ValueType;
  label: string;
  iconUrl?: string;
};
export type Props = StyledComponentPropsWithRef<'div'> & {
  label?: string;
  options: CheckboxMultiChoiceOption[];
  value: ValueType[];
  onChange?: (value: ValueType[]) => void;
  onSelectOption?: (options: CheckboxMultiChoiceOption[]) => void;
};
export default function CheckboxMultiChoice({
  label,
  options,
  value,
  onChange,
  onSelectOption,
  ...wrapperProps
}: Props) {
  const selectOptions = useMemo(
    () => options.filter((item) => value.includes(item.value)),
    [options, value]
  );
  return (
    <CheckboxMultiChoiceWrapper {...wrapperProps}>
      {label && <CheckboxMultiChoiceLabel>{label}: </CheckboxMultiChoiceLabel>}

      <OptionsBox className="select-options-box">
        {options.map((item) => {
          const isChecked = value.includes(item.value);
          return (
            <OptionItem
              className="select-option-item"
              key={item.value}
              isChecked={isChecked}
              onClick={() => {
                if (onSelectOption) {
                  onSelectOption([...selectOptions, item]);
                }
                if (onChange) {
                  onChange([...value, item.value]);
                }
              }}
            >
              {item.iconUrl && (
                <OptionIcon
                  src={item.iconUrl}
                  className="select-option-item-icon"
                />
              )}
              <OptionLabel className="select-option-item-label">
                {item.label}
              </OptionLabel>
              {isChecked && (
                <CheckedIcon
                  src={CheckSvg}
                  className="select-option-item-icon"
                />
              )}
            </OptionItem>
          );
        })}
      </OptionsBox>
    </CheckboxMultiChoiceWrapper>
  );
}
const CheckboxMultiChoiceWrapper = styled.div`
  height: 40px;
  position: relative;
`;

const CheckboxMultiChoiceLabel = styled.img`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
const OptionsBox = styled.div`
  min-width: 100%;
  position: absolute;
  left: 0;
  top: 100%;
  margin-bottom: 10px;
  margin-top: 10px;

  display: flex;
  flex-direction: column;
  gap: 2px;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  z-index: 1;
`;
const OptionItem = styled.div<{ isChecked: boolean }>`
  height: 40px;
  padding: 20px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${(props) => (props.isChecked ? '#14171A' : 'none')};
  color: ${(props) => (props.isChecked ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isChecked &&
      `
        background: #14171a;
        opacity: 0.6;
      `};
  }
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  white-space: nowrap;
`;
const CheckedIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
