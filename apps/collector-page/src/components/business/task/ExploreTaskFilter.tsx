/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 17:23:36
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ExploreTaskSortBy } from '../../../types/api'
import ButtonRadioGroup from '../../common/button/ButtonRadioGroup'
import InputSearch from '../../common/input/InputSearch'
export const ExploreTaskSortByOptions = [
  {
    label: 'New',
    value: ExploreTaskSortBy.NEW,
  },
  {
    label: 'Hot',
    value: ExploreTaskSortBy.HOT,
  },
]

export type ExploreTaskFilterDataType = {
  sortBy: ExploreTaskSortBy
  keywords: string
}

export type ExploreTaskFilterViewConfigType = {
  displayStatus?: boolean
  displayKeywords?: boolean
}

export type ExploreTaskFilterDataViewType = {
  data: ExploreTaskFilterDataType
  viewConfig?: ExploreTaskFilterViewConfigType
}
export type ExploreTaskFilterHandlesType = {
  onChange?: (filter: ExploreTaskFilterDataType) => void
}
export type ExploreTaskFilterProps = ExploreTaskFilterDataViewType & ExploreTaskFilterHandlesType

const defaultViewConfig = {
  displayStatus: true,
  displayKeywords: true,
}
const ExploreTaskFilter: React.FC<ExploreTaskFilterProps> = ({
  data,
  viewConfig,
  onChange,
}: ExploreTaskFilterProps) => {
  const { sortBy, keywords } = data
  const { displayStatus, displayKeywords } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleSortByChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        sortBy: value,
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
    <ExploreTaskFilterWrapper>
      {displayStatus && (
        <FilterLeftBox>
          <ButtonRadioGroup options={ExploreTaskSortByOptions} value={sortBy} onChange={handleSortByChange} />
        </FilterLeftBox>
      )}
      {displayKeywords && (
        <FilterRightBox>
          <InputSearch value={keywords} onChange={handleKeywordsChange} placeholder="Search task keywords" />
        </FilterRightBox>
      )}
    </ExploreTaskFilterWrapper>
  )
}
export default ExploreTaskFilter
const ExploreTaskFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
`
const FilterLeftBox = styled.div`
  width: 200px;
`
const FilterRightBox = styled.div`
  flex: 1;
  max-width: 650px;
`
