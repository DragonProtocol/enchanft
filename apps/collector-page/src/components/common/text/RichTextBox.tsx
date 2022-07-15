/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 10:53:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 11:15:42
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

type RichTextBoxProps = {
  children: any
}
const RichTextBox: React.FC<RichTextBoxProps> = ({ children, ...otherProps }: RichTextBoxProps) => {
  return <RichTextBoxWrapper {...otherProps}>{children}</RichTextBoxWrapper>
}
export default RichTextBox
const RichTextBoxWrapper = styled.pre`
  width: 100%;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: pre-wrap; /* current browsers */
`
