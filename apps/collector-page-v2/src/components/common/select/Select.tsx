/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 15:24:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 14:08:50
 * @Description: file description
 */
import { useEffect, useMemo, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ChevronDownSvg from '../icons/svgs/chevron-down.svg';

type ValueType = string | number;
export type SelectOption = {
  value: ValueType;
  label: string;
  iconUrl?: string;
};
export type Props = StyledComponentPropsWithRef<'div'> & {
  options: SelectOption[];
  value: ValueType;
  placeholder?: string;
  onChange?: (value: ValueType) => void;
  iconUrl?: string;
};
export default function Select({
  options,
  value,
  placeholder = 'Select',
  onChange,
  iconUrl,
  ...wrapperProps
}: Props) {
  const [openOptions, setOpenOptions] = useState(false);
  const option = useMemo(
    () => options.find((item) => item.value === value),
    [options, value]
  );
  const displayText = useMemo(
    () => (option ? option.label : placeholder),
    [option, placeholder]
  );
  useEffect(() => {
    const handleClick = (e) => setOpenOptions(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  return (
    <SelectWrapper {...wrapperProps}>
      <SelectButton
        className="select-button"
        onClick={(e) => {
          e.stopPropagation();
          setOpenOptions(!openOptions);
        }}
      >
        <SelectButtonLeft>
          {iconUrl && (
            <SelectButtonBeforeIcon
              className="select-button-before-icon"
              src={iconUrl}
            />
          )}

          <SelectButtonText className="select-button-text">
            {displayText}
          </SelectButtonText>
        </SelectButtonLeft>

        <SelectButtonChevronIcon
          className="select-button-chevron-icon"
          src={ChevronDownSvg}
        />
      </SelectButton>

      {openOptions && (
        <OptionsBox className="select-options-box">
          {options.map((item) => (
            <OptionItem
              className="select-option-item"
              key={item.value}
              isActive={item.value === value}
              onClick={() => {
                if (onChange) {
                  onChange(item.value);
                }
                setOpenOptions(false);
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
            </OptionItem>
          ))}
        </OptionsBox>
      )}
    </SelectWrapper>
  );
}
const SelectWrapper = styled.div`
  height: 40px;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 8px 20px;
  border: 1px solid #39424c;
  position: relative;
  cursor: pointer;
`;
const SelectButton = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const SelectButtonLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const SelectButtonBeforeIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const SelectButtonText = styled.span`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
`;
const SelectButtonChevronIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const OptionsBox = styled.div`
  position: absolute;
  left: 0;
  bottom: -10px;
  transform: translateY(100%);

  display: flex;
  flex-direction: column;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 10px;
  z-index: 1;
`;
const OptionItem = styled.div<{ isActive: boolean }>`
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
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
        background: #14171a;
        opacity: 0.8;
      `};
  }
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span``;
