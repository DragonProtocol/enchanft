/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 15:18:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 19:25:48
 * @Description: file description
 */
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import React from 'react'
import styled from 'styled-components'
import { ProjectStatus, TaskType } from '../../../types/api'
import SearchIcon from '@mui/icons-material/Search'
export enum ProjectStatusOther {
  All = '',
}
export type ProjectFilterStatusType = ProjectStatus | ProjectStatusOther
export const ProjectFilterStatusOptions = [
  {
    label: 'All',
    value: ProjectStatusOther.All,
  },
  {
    label: 'Active',
    value: ProjectStatus.ACTIVE,
  },
  {
    label: 'Live',
    value: ProjectStatus.LIVE,
  },
  {
    label: 'Future',
    value: ProjectStatus.FUTURE,
  },
]

export type ProjectFilterDataType = {
  status: ProjectFilterStatusType
  keyword?: string
}

export type ProjectFilterViewConfigType = {
  displayStatus?: boolean
  displayKeyword?: boolean
}

export type ProjectFilterDataViewType = {
  data: ProjectFilterDataType
  viewConfig?: ProjectFilterViewConfigType
}
export type ProjectFilterHandlesType = {
  onChange?: (filter: ProjectFilterDataType) => void
}
export type ProjectFilterProps = ProjectFilterDataViewType & ProjectFilterHandlesType

const defaultViewConfig = {
  displayStatus: true,
  displayKeyword: true,
}
const ProjectFilter: React.FC<ProjectFilterProps> = ({ data, viewConfig, onChange }: ProjectFilterProps) => {
  const { status } = data
  const { displayStatus, displayKeyword } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleStatusChange = (value: ProjectFilterStatusType) => {
    if (onChange) {
      onChange({
        ...data,
        status: value,
      })
    }
  }
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({
        ...data,
        keyword: e.target.value,
      })
    }
  }
  return (
    <ProjectFilterWrapper>
      {displayStatus && (
        <ProjectStatusSelector>
          {ProjectFilterStatusOptions.map(({ label, value }) => (
            <ProjectStatusSelectorItem
              key={value}
              isActive={status === value}
              onClick={() => handleStatusChange(value)}
            >
              {label}
            </ProjectStatusSelectorItem>
          ))}
        </ProjectStatusSelector>
      )}
      {displayKeyword && (
        <ProjectKeywordBox>
          <SearchIcon />
          <InputBase
            sx={{ ml: 1, flex: 1, height: 'auto' }}
            placeholder="Search keywords, communities or collections"
            inputProps={{ 'aria-label': 'Search keywords, communities or collections' }}
            onChange={handleKeywordChange}
          />
        </ProjectKeywordBox>
      )}
    </ProjectFilterWrapper>
  )
}
export default ProjectFilter
const ProjectFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
`
const ProjectStatusSelector = styled.div`
  height: 50px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 100);
  border: 2px solid rgba(21, 21, 21, 100);
  display: flex;
`
const ProjectStatusSelectorItem = styled.div<{ isActive?: boolean }>`
  width: 85px;
  height: 100%;
  cursor: pointer;
  border-left: 2px solid rgba(21, 21, 21, 100);
  &:first-child {
    border-left: none;
  }
  background: ${(props) => (props.isActive ? '#000' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  display: flex;
  justify-content: center;
  align-items: center;
`
const ProjectKeywordBox = styled.div`
  flex: 1;
  height: 50px;
  padding: 13px;
  border-radius: 15px;
  font-size: 14px;
  border: 2px solid rgba(0, 0, 0, 1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
`
