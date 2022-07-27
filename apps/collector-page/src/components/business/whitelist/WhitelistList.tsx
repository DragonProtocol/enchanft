/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-26 17:00:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 18:57:08
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../../constants'
import WhitelistItem, { WhitelistItemDataViewType } from './WhitelistItem'

export type WhitelistListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type WhitelistListItemsType = WhitelistItemDataViewType[]
export type WhitelistListProps = WhitelistListViewConfigType & {
  items: WhitelistListItemsType
}
const WhitelistList: React.FC<WhitelistListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no whitelist',
}: WhitelistListProps) => (
  <>
    {loading && <WhitelistListLoading>{loadingMsg}</WhitelistListLoading>}
    {!loading && items.length === 0 && emptyMsg && <WhitelistListEmpty>{emptyMsg}</WhitelistListEmpty>}
    <WhitelistListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => <WhitelistItem key={`${item.data.id}`} data={item.data} viewConfig={item.viewConfig} />)}
    </WhitelistListWrapper>
  </>
)
export default WhitelistList
const WhitelistListWrapper = styled.div`
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
const WhitelistListLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const WhitelistListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
