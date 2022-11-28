/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 11:44:36
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { MOBILE_BREAK_POINT } from '../../../constants';
import { MintStage } from '../../../types/entities';
import ButtonRadioGroup from '../../common/button/ButtonRadioGroup';
import InputSearch from '../../common/input/InputSearch';
export enum MintStageOther {
  All = '',
}
export type ExploreMintStageType = MintStage | MintStageOther;
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
];

export type ExploreProjectIndexFilterDataType = {
  mintStage: ExploreMintStageType;
  keywords: string;
};

export type ExploreProjectIndexFilterViewConfigType = {
  displayStatus?: boolean;
  displayKeywords?: boolean;
};

export type ExploreProjectIndexFilterDataViewType = {
  data: ExploreProjectIndexFilterDataType;
  viewConfig?: ExploreProjectIndexFilterViewConfigType;
};
export type ExploreProjectIndexFilterHandlesType = {
  onChange?: (filter: ExploreProjectIndexFilterDataType) => void;
};
export type ExploreProjectIndexFilterProps =
  ExploreProjectIndexFilterDataViewType & ExploreProjectIndexFilterHandlesType;

const defaultViewConfig = {
  displayStatus: true,
  displayKeywords: true,
};
const ExploreProjectIndexFilter: React.FC<ExploreProjectIndexFilterProps> = ({
  data,
  viewConfig,
  onChange,
}: ExploreProjectIndexFilterProps) => {
  const { mintStage, keywords } = data;
  const { displayStatus, displayKeywords } = {
    ...defaultViewConfig,
    ...viewConfig,
  };
  const handleStatusChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        mintStage: value,
      });
    }
  };
  const handleKeywordsChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        keywords: value,
      });
    }
  };
  return (
    <ExploreProjectIndexFilterWrapper>
      {/* {displayStatus && (
        <ButtonRadioGroupSortBy options={ExploreMintStageOptions} value={mintStage} onChange={handleStatusChange} />
      )} */}
      {displayKeywords && (
        <InputSearchKeywords
          value={keywords}
          onChange={handleKeywordsChange}
          placeholder="Search Keywords, Communities or Projects"
        />
      )}
    </ExploreProjectIndexFilterWrapper>
  );
};
export default ExploreProjectIndexFilter;
const ExploreProjectIndexFilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 20px;
  }
`;
const ButtonRadioGroupSortBy = styled(ButtonRadioGroup)`
  width: 400px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    max-width: 100%;
    font-size: 14px;
    line-height: 21px;
  }
`;
const InputSearchKeywords = styled(InputSearch)`
  width: 600px;
  height: 50px;
  background: #f7f9f1;
  border: 2px solid #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`;
