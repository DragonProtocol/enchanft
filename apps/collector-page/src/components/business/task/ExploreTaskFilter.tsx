/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 11:21:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:13:04
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { MOBILE_BREAK_POINT } from '../../../constants';
import { SearchTaskStatus } from '../../../types/api';
import ButtonRadioGroup from '../../common/button/ButtonRadioGroup';
import InputSearch from '../../common/input/InputSearch';

export const SearchTaskStatusOptions = [
  {
    label: 'All',
    value: SearchTaskStatus.ALL,
  },
  {
    label: 'Live',
    value: SearchTaskStatus.LIVE,
  },
  {
    label: 'Future',
    value: SearchTaskStatus.FUTURE,
  },
  {
    label: 'Closed',
    value: SearchTaskStatus.CLOSED,
  },
];

export type ExploreTaskFilterDataType = {
  status: SearchTaskStatus;
  keywords: string;
};

export type ExploreTaskFilterViewConfigType = {
  displayStatus?: boolean;
  displayKeywords?: boolean;
};

export type ExploreTaskFilterDataViewType = {
  data: ExploreTaskFilterDataType;
  viewConfig?: ExploreTaskFilterViewConfigType;
};
export type ExploreTaskFilterHandlesType = {
  onChange?: (filter: ExploreTaskFilterDataType) => void;
};
export type ExploreTaskFilterProps = ExploreTaskFilterDataViewType &
  ExploreTaskFilterHandlesType;

const defaultViewConfig = {
  displayStatus: true,
  displayKeywords: true,
};
const ExploreTaskFilter: React.FC<ExploreTaskFilterProps> = ({
  data,
  viewConfig,
  onChange,
}: ExploreTaskFilterProps) => {
  const { status, keywords } = data;
  const { displayStatus, displayKeywords } = {
    ...defaultViewConfig,
    ...viewConfig,
  };
  const handleSortByChange = (value) => {
    if (onChange) {
      onChange({
        ...data,
        status: value,
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
    <ExploreTaskFilterWrapper>
      {displayStatus && (
        <ButtonRadioGroupStatus
          options={SearchTaskStatusOptions}
          value={status}
          onChange={handleSortByChange}
        />
      )}
      {displayKeywords && (
        <InputSearchKeywords
          value={keywords}
          onChange={handleKeywordsChange}
          placeholder="Search task keywords"
        />
      )}
    </ExploreTaskFilterWrapper>
  );
};
export default ExploreTaskFilter;
const ExploreTaskFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 20px;
  }
`;
const ButtonRadioGroupStatus = styled(ButtonRadioGroup)`
  width: 400px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    max-width: 100%;
    font-size: 14px;
    line-height: 21px;
  }
`;
const InputSearchKeywords = styled(InputSearch)`
  flex: 1;
  max-width: 500px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
  }
`;
