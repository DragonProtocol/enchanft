/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-16 16:19:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-16 18:59:48
 * @Description: file description
 */
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import IconCaretLeft from '../icons/IconCaretLeft'

type CollapseProps = HTMLAttributes<HTMLDivElement>
const Collapse: React.FC<CollapseProps> = ({ children, ...otherProps }: CollapseProps) => {
  return <CollapseWrapper {...otherProps}>{children}</CollapseWrapper>
}
export default Collapse
const CollapseWrapper = styled.div``
type CollapsePanelProps = HTMLAttributes<HTMLDivElement> & {
  expanded?: boolean
  header?: React.ReactNode
  onChange?: (expanded: boolean) => void
}
export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  expanded,
  header,
  onChange,
  children,
  ...otherProps
}: CollapsePanelProps) => {
  return (
    <CollapsePanelWrapper {...otherProps}>
      <CollapsePanelHeader onClick={() => onChange && onChange(!!expanded)}>
        <CollapsePanelTitle>{header}</CollapsePanelTitle>
        <CollapsePanelIcon expanded={expanded}>
          <IconCaretLeft />
        </CollapsePanelIcon>
      </CollapsePanelHeader>
      <CollapsePanelBody expanded={expanded}>{children}</CollapsePanelBody>
    </CollapsePanelWrapper>
  )
}
const CollapsePanelWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  padding: 20px 0;
`
const CollapsePanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`
const CollapsePanelTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`
const CollapsePanelIcon = styled.div<{ expanded?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(${({ expanded }) => (expanded ? '90deg' : '-90deg')});
  transform-origin: center;
  transition: all 0.4s;
`
const CollapsePanelBody = styled.div<{ expanded?: boolean }>`
  width: 100%;

  box-sizing: border-box;
  ${({ expanded }) =>
    expanded
      ? `height: auto;
  padding-top: 10px;`
      : `height: 0px;padding-top: 0px;`}
  /* transition: all 0.6s; */
  overflow: hidden;
`
