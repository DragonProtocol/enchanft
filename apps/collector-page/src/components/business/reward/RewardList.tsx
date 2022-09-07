/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-26 17:00:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-07 11:53:26
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import Loading from '../../common/loading/Loading'
import RewardItem, { RewardItemDataViewType } from './RewardItem'

export type RewardListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type RewardListItemsType = RewardItemDataViewType[]
export type RewardListProps = RewardListViewConfigType & {
  items: RewardListItemsType
}
const RewardList: React.FC<RewardListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no rewards',
}: RewardListProps) => (
  <>
    {loading && (
      <RewardListLoading>
        <Loading />
      </RewardListLoading>
    )}
    {!loading && items.length === 0 && emptyMsg && <RewardListEmpty>{emptyMsg}</RewardListEmpty>}
    <RewardListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => <RewardItem key={`${item.data.id}`} data={item.data} viewConfig={item.viewConfig} />)}
    </RewardListWrapper>
  </>
)
export default RewardList
const RewardListWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  grid-gap: 20px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }
`
const RewardListLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const RewardListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
