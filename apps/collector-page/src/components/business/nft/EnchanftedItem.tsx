/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:28:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:30:12
 * @Description: enchanfted item
 */

import React from 'react'
import styled from 'styled-components'

export type EnchanftedItemDataType = {
  streamId: string
  post: {
    url: string
    title: string
    tags: string[]
  }
  notes: string
  unread: boolean
  isPrivate: boolean
  createdAt: number
  lastModifiedAt: number
}

export type EnchanftedItemViewConfigType = {
  displayEdit?: boolean
  displayDel?: boolean
  disabledEdit?: boolean
  disabledDel?: boolean
  loadingEdit?: boolean
  loadingDel?: boolean
}

export type EnchanftedItemDataViewType = {
  data: EnchanftedItemDataType
  viewConfig?: EnchanftedItemViewConfigType
}

export type EnchanftedItemHandlesType = {
  onEdit?: (Enchanfted: EnchanftedItemDataType) => void
  onDelete?: (Enchanfted: EnchanftedItemDataType) => void
}

export type EnchanftedItemProps = EnchanftedItemDataViewType & EnchanftedItemHandlesType

const defaultViewConfig = {
  displayEdit: false,
  displayDel: false,
  disabledEdit: false,
  disabledDel: false,
  loadingEdit: false,
  loadingDel: false,
}
interface Props {
  data: EnchanftedItemDataType
  displayEdit?: boolean
  displayDel?: boolean
  onEdit?: (Enchanfted: EnchanftedItemDataType) => void
  onDelete?: (Enchanfted: EnchanftedItemDataType) => void
}

const EnchanftedItem: React.FC<EnchanftedItemProps> = ({ data, viewConfig, onEdit, onDelete }: EnchanftedItemProps) => {
  const {
    notes,
    unread,
    isPrivate,
    post: { url, title, tags },
  } = data
  const { displayEdit, displayDel, disabledEdit, disabledDel, loadingEdit, loadingDel } = {
    ...defaultViewConfig,
    ...viewConfig,
  }

  const unreadLabel = unread ? 'read later' : 'already read'
  const isPrivateLabel = isPrivate ? 'private' : 'public'
  return <EnchanftedItemWrapper>aaa</EnchanftedItemWrapper>
}
export default EnchanftedItem
const EnchanftedItemWrapper = styled.div``
