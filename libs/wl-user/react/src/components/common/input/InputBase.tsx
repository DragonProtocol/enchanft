/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:00:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 16:20:06
 * @Description: file description
 */
import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

function InputBase(props: InputProps) {
  return <InputBaseWrapper {...props} />;
}
export default InputBase;

const InputBaseWrapper = styled.input`
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  background: #ebeee4;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
  border: none;
`;
