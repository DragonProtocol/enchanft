/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 17:28:10
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ProjectStatus } from '../../../types/api'
import ButtonRadioGroup from '../../common/button/ButtonRadioGroup'
import InputSearch from '../../common/input/InputSearch'
export enum ProjectStatusOther {
  All = '',
}
export type ExploreProjectStatusType = ProjectStatus | ProjectStatusOther
export const ExploreProjectStatusOptions = [
  {
    label: 'All',
    value: ProjectStatusOther.All,
  },
  // {
  //   label: 'Active',
  //   value: ProjectStatus.ACTIVE,
  // },
  {
    label: 'Live',
    value: ProjectStatus.LIVE,
  },
  {
    label: 'Future',
    value: ProjectStatus.FUTURE,
  },
]

export type ExploreProjectFilterDataType = {
  status: ExploreProjectStatusType
  keywords: string
}

export type ExploreProjectFilterViewConfigType = {
  displayStatus?: boolean
  displayKeywords?: boolean
}

export type ExploreProjectFilterDataViewType = {
  data: ExploreProjectFilterDataType
  viewConfig?: ExploreProjectFilterViewConfigType
}
export type ExploreProjectFilterHandlesType = {
  onChange?: (filter: ExploreProjectFilterDataType) => void
}
export type ExploreProjectFilterProps = ExploreProjectFilterDataViewType & ExploreProjectFilterHandlesType

const defaultViewConfig = {
  displayStatus: true,
  displayKeywords: true,
}
const ExploreProjectFilter: React.FC<ExploreProjectFilterProps> = ({
  data,
  viewConfig,
  onChange,
}: ExploreProjectFilterProps) => {
  const { status, keywords } = data
  const { displayStatus, displayKeywords } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleStatusChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        status: value,
      })
    }
  }
  const handleKeywordsChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        keywords: value,
      })
    }
  }
  return (
    <ExploreProjectFilterWrapper>
      {displayStatus && (
        <FilterLeftBox>
          <ButtonRadioGroup options={ExploreProjectStatusOptions} value={status} onChange={handleStatusChange} />
        </FilterLeftBox>
      )}
      {displayKeywords && (
        <FilterRightBox>
          <InputSearch value={keywords} onChange={handleKeywordsChange} placeholder="Search project keywords" />
        </FilterRightBox>
      )}
    </ExploreProjectFilterWrapper>
  )
}
export default ExploreProjectFilter
const ExploreProjectFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
`
const FilterLeftBox = styled.div``
const FilterRightBox = styled.div`
  flex: 1;
  max-width: 650px;
`