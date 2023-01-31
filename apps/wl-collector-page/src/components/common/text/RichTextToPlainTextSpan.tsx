/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 10:53:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:34:32
 * @Description: file description
 */
import React from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
export enum RichTextToPlainTextMode {
  HTML,
  MARKDOWN,
}
type RichTextToPlainTextSpanProps = StyledComponentPropsWithRef<'span'> & {
  mode?: RichTextToPlainTextMode;
  value: string;
};
const RichTextToPlainTextSpan: React.FC<RichTextToPlainTextSpanProps> = ({
  mode = RichTextToPlainTextMode.MARKDOWN,
  value,
  ...otherProps
}: RichTextToPlainTextSpanProps) => {
  let text = value;
  switch (mode) {
    case RichTextToPlainTextMode.MARKDOWN:
      text = DOMPurify.sanitize(marked.parse(value)).replace(/<[^>]+>/g, ' ');
      break;
    case RichTextToPlainTextMode.HTML:
      text = DOMPurify.sanitize(value).replace(/<[^>]+>/g, ' ');
      break;
    // no default
  }
  return (
    <RichTextToPlainTextSpanWrapper {...otherProps}>
      {text}
    </RichTextToPlainTextSpanWrapper>
  );
};
export default RichTextToPlainTextSpan;
const RichTextToPlainTextSpanWrapper = styled.span``;