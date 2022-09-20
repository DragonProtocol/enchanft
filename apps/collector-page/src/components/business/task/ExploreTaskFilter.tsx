/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 14:29:14
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../../../constants'
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
        <ButtonRadioGroupSortBy options={ExploreTaskSortByOptions} value={sortBy} onChange={handleSortByChange} />
      )}
      {displayKeywords && (
        <InputSearchKeywords value={keywords} onChange={handleKeywordsChange} placeholder="Search task keywords" />
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 20px;
  }
`
const ButtonRadioGroupSortBy = styled(ButtonRadioGroup)`
  width: 200px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const InputSearchKeywords = styled(InputSearch)`
  flex: 1;
  max-width: 650px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`
