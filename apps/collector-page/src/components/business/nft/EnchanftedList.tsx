/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:27:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:30:37
 * @Description: enchanfted list
 */

import React from 'react'
import styled from 'styled-components'
import EnchanftedItem, { EnchanftedItemDataViewType, EnchanftedItemHandlesType } from './EnchanftedItem'

export type EnchanftedListViewConfigType = {
  loading?: boolean
  loadingMore?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type EnchanftedListItemsType = EnchanftedItemDataViewType[]
export type EnchanftedListProps = EnchanftedItemHandlesType &
  EnchanftedListViewConfigType & {
    items: EnchanftedListItemsType
  }
const EnchanftedList: React.FC<EnchanftedListProps> = ({
  items,
  loading,
  loadingMore,
  loadingMsg,
  emptyMsg,
}: EnchanftedListProps) => (
  <EnchanftedListWrapper>
    {!loading &&
      items.length > 0 &&
      items.map((item) => (
        <EnchanftedItem
          key={`${item.data.streamId}-${item.data.createdAt}`}
          data={item.data}
          viewConfig={item.viewConfig}
        />
      ))}
    {(loading || loadingMore) && (
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {loadingMsg}
      </div>
    )}
    {!loading && !loadingMore && items.length === 0 && emptyMsg && (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>{emptyMsg}</div>
    )}
  </EnchanftedListWrapper>
)
export default EnchanftedList
const EnchanftedListWrapper = styled.div``
