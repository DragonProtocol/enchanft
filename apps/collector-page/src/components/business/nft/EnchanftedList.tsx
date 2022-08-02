/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:27:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 14:45:58
 * @Description: enchanfted list
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import { CursorPointerUpCss } from '../../../GlobalStyle'
import Loading from '../../common/loading/Loading'
import EnchanftedItem, { EnchanftedItemDataViewType } from './EnchanftedItem'

export type EnchanftedListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type EnchanftedListItemsType = EnchanftedItemDataViewType[]
export type EnchanftedListProps = EnchanftedListViewConfigType & {
  items: EnchanftedListItemsType
}
const EnchanftedList: React.FC<EnchanftedListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no enchanfted',
}: EnchanftedListProps) => {
  const navigate = useNavigate()

  return (
    <>
      {loading && (
        <EnchanftedListLoading>
          <Loading />
        </EnchanftedListLoading>
      )}
      {!loading && items.length === 0 && emptyMsg && <EnchanftedListEmpty>{emptyMsg}</EnchanftedListEmpty>}
      <EnchanftedListWrapper>
        {!loading &&
          items.length > 0 &&
          items.map((item) => (
            <EnchanftedItemBox key={`${item.data.mint}`} onClick={() => navigate(`/enchanfted/${item.data.mint}`)}>
              <EnchanftedItem data={item.data} viewConfig={item.viewConfig} />
            </EnchanftedItemBox>
          ))}
      </EnchanftedListWrapper>
    </>
  )
}
export default EnchanftedList
const EnchanftedListWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  grid-gap: 90px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }
`
const EnchanftedListLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const EnchanftedListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const EnchanftedItemBox = styled.div`
  ${CursorPointerUpCss}
`
