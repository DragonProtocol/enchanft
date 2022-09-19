/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 17:53:58
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../../../constants'
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
        <ButtonRadioGroupSortBy options={ExploreMintStageOptions} value={mintStage} onChange={handleStatusChange} />
      )}
      {displayKeywords && (
        <InputSearchKeywords value={keywords} onChange={handleKeywordsChange} placeholder="Search project keywords" />
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 20px;
  }
`
const ButtonRadioGroupSortBy = styled(ButtonRadioGroup)`
  width: 400px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    max-width: 100%;
    font-size: 14px;
    line-height: 21px;
  }
`
const InputSearchKeywords = styled(InputSearch)`
  flex: 1;
  max-width: 500px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`
