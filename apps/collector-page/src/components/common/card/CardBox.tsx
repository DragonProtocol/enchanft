/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 10:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 13:11:56
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

type CardBoxProps = HTMLAttributes<HTMLDivElement>;
const CardBox: React.FC<CardBoxProps> = ({
  children,
  ...otherProps
}: CardBoxProps) => {
  return <CardBoxWrapper {...otherProps}>{children}</CardBoxWrapper>;
};
export default CardBox;
const CardBoxWrapper = styled.div`
  width: 100%;
  padding: 20px;
  background: #f7f9f1;
  border: 4px solid #333333;
  border-radius: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;
