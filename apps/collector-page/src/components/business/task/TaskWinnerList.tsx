/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 13:55:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 18:19:58
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { omitIntermediateStr } from '../../../utils/string'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import UserAvatar from '../user/UserAvatar'

export type WinnerItemDataType = {
  id: number
  name: string
  pubkey: string
  avatar: string
}

export type TaskWinnerListProps = {
  items: WinnerItemDataType[]
}

const TaskWinnerList: React.FC<TaskWinnerListProps> = ({ items }: TaskWinnerListProps) => {
  return (
    <TaskWinnerListWrapper>
      <WinnerTitleBox>Winner List</WinnerTitleBox>
      <WinnerListBox>
        {items.map((item, index) => (
          <WinnerItemBox key={index}>
            <WinnerItemAvatar src={item.avatar} />
            <WinnerItemUserName>{item.name}</WinnerItemUserName>
            <WinnerItemPubkey number={1}>{item.pubkey}</WinnerItemPubkey>
          </WinnerItemBox>
        ))}
      </WinnerListBox>
    </TaskWinnerListWrapper>
  )
}
export default TaskWinnerList
const TaskWinnerListWrapper = styled.div`
  width: 100%;
`
const WinnerTitleBox = styled.div`
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  margin-bottom: 10px;
`
const WinnerListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const WinnerItemBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const WinnerItemAvatar = styled(UserAvatar)`
  width: 40px;
  height: 40px;
`
const WinnerItemUserName = styled.div`
  width: 30%;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const WinnerItemPubkey = styled(OverflowEllipsisBox)`
  flex: 1;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
