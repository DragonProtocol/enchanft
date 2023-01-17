/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:49:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 11:03:05
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../../constants';
import Loading from '../../common/loading/Loading';
import ExploreProjectItem, {
  ExploreProjectItemDataViewType,
} from './ExploreProjectItem';

export type ExploreProjectListViewConfigType = {
  loading?: boolean;
  loadingMsg?: string;
  emptyMsg?: string;
};
export type ExploreProjectListItemsType = ExploreProjectItemDataViewType[];
export type ExploreProjectListProps = ExploreProjectListViewConfigType & {
  items: ExploreProjectListItemsType;
};
const ExploreProjectList: React.FC<ExploreProjectListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no project',
}: ExploreProjectListProps) => (
  <>
    {loading && (
      <ListStatusBox>
        <Loading />
      </ListStatusBox>
    )}
    {!loading && items.length === 0 && emptyMsg && (
      <ListStatusBox>{emptyMsg}</ListStatusBox>
    )}

    <ExploreProjectListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => (
          <ExploreProjectItem
            key={`${item.data.id}`}
            data={item.data}
            viewConfig={item.viewConfig}
          />
        ))}
    </ExploreProjectListWrapper>
  </>
);
export default ExploreProjectList;
const ExploreProjectListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
  }
`;
const ListStatusBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
