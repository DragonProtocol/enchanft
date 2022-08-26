/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 11:56:53
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MintStage } from '../../../types/entities'
import ButtonRadioGroup from '../../common/button/ButtonRadioGroup'
import InputSearch from '../../common/input/InputSearch'
export enum MintStageOther {
  All = '',
}
export type ExploreMintStageType = MintStage | MintStageOther
export const ExploreMintStageOptions = [
  {
    label: 'All',
    value: MintStageOther.All,
  },
  {
    label: 'Live',
    value: MintStage.LIVE,
  },
  {
    label: 'Future',
    value: MintStage.FUTURE,
  },
  {
    label: 'Closed',
    value: MintStage.CLOSED,
  },
]

export type ExploreProjectFilterDataType = {
  mintStage: ExploreMintStageType
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
  const { mintStage, keywords } = data
  const { displayStatus, displayKeywords } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleStatusChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        mintStage: value,
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
          <ButtonRadioGroup options={ExploreMintStageOptions} value={mintStage} onChange={handleStatusChange} />
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
const FilterLeftBox = styled.div`
  /* width: 300px; */
`
const FilterRightBox = styled.div`
  flex: 1;
  max-width: 650px;
`
