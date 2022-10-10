/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:49:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 13:13:03
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import Loading from '../../common/loading/Loading'
import ExploreProjectIndexItem, { ExploreProjectIndexItemDataViewType } from './ExploreProjectIndexItem'

export type ExploreProjectIndexListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExploreProjectIndexListItemsType = ExploreProjectIndexItemDataViewType[]
export type ExploreProjectIndexListProps = ExploreProjectIndexListViewConfigType & {
  items: ExploreProjectIndexListItemsType
}
const ExploreProjectIndexList: React.FC<ExploreProjectIndexListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no project',
}: ExploreProjectIndexListProps) => (
  <>
    {loading && (
      <ListStatusBox>
        <Loading />
      </ListStatusBox>
    )}
    {!loading && items.length === 0 && emptyMsg && <ListStatusBox>{emptyMsg}</ListStatusBox>}

    <ExploreProjectIndexListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => (
          <ExploreProjectIndexItem key={`${item.data.id}`} data={item.data} viewConfig={item.viewConfig} />
        ))}
    </ExploreProjectIndexListWrapper>
  </>
)
export default ExploreProjectIndexList
const ExploreProjectIndexListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 18px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(1, minmax(220px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 18px;
  }
`
const ListStatusBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`
