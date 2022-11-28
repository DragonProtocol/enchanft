/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 10:53:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-26 14:10:09
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
export enum RichTextMode {
  HTML,
  MARKDOWN,
}
type RichTextBoxProps = HTMLAttributes<HTMLDivElement> & {
  mode?: RichTextMode;
  value: string;
};
const RichTextBox: React.FC<RichTextBoxProps> = ({
  mode = RichTextMode.MARKDOWN,
  value,
  ...otherProps
}: RichTextBoxProps) => {
  let html = value;
  switch (mode) {
    case RichTextMode.MARKDOWN:
      html = DOMPurify.sanitize(marked.parse(value));
      break;
    case RichTextMode.HTML:
      html = DOMPurify.sanitize(value);
      break;
  }
  return (
    <RichTextBoxWrapper
      {...otherProps}
      dangerouslySetInnerHTML={{ __html: html }}
    ></RichTextBoxWrapper>
  );
};
export default RichTextBox;
const RichTextBoxWrapper = styled.div`
  width: 100%;
  word-break: break-word;
  img {
    max-width: 100%;
  }
`;
