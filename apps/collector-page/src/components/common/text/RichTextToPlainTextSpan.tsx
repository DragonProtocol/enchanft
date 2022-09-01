/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 10:53:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-09 16:01:00
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
export enum RichTextToPlainTextMode {
  HTML,
  MARKDOWN,
}
type RichTextToPlainTextSpanProps = HTMLAttributes<HTMLSpanElement> & {
  mode?: RichTextToPlainTextMode
  value: string
}
const RichTextToPlainTextSpan: React.FC<RichTextToPlainTextSpanProps> = ({
  mode = RichTextToPlainTextMode.MARKDOWN,
  value,
  ...otherProps
}: RichTextToPlainTextSpanProps) => {
  let text = value
  switch (mode) {
    case RichTextToPlainTextMode.MARKDOWN:
      text = DOMPurify.sanitize(marked.parse(value)).replace(/<[^>]+>/g, ' ')
      break
    case RichTextToPlainTextMode.HTML:
      text = DOMPurify.sanitize(value).replace(/<[^>]+>/g, ' ')
      break
  }
  return <RichTextToPlainTextSpanWrapper {...otherProps}>{text}</RichTextToPlainTextSpanWrapper>
}
export default RichTextToPlainTextSpan
const RichTextToPlainTextSpanWrapper = styled.span``
