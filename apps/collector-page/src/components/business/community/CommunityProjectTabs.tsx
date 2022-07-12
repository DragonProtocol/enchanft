/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 11:08:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-11 11:42:05
 * @Description: file description
 */
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React from 'react'
import styled from 'styled-components'

export type CommunityProjectTabOption = {
  label: string
  value: any
}
export type CommunityProjectTabsOptions = CommunityProjectTabOption[]
export type CommunityProjectTabsProps = {
  options: CommunityProjectTabsOptions
  value: any
  onChange?: (value: any) => void
}
const CommunityProjectTabs: React.FC<CommunityProjectTabsProps> = ({
  options,
  value,
  onChange,
}: CommunityProjectTabsProps) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (onChange) {
      onChange(newValue)
    }
  }
  return (
    <CommunityProjectTabsWrapper>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {options.map((option) => (
          <Tab key={option.value} label={option.label} value={option.value} />
        ))}
      </Tabs>
    </CommunityProjectTabsWrapper>
  )
}
export default CommunityProjectTabs
const CommunityProjectTabsWrapper = styled.div``
