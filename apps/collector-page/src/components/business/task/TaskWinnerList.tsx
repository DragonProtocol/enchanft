/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 13:55:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 14:39:27
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'

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
      <WinnerTitleBox>Winner Rank</WinnerTitleBox>
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
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: rgba(193, 205, 209, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 20px;
  text-align: center;
  margin-bottom: 40px;
`
const WinnerListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`
const WinnerItemBox = styled.div`
  display: flex;
  gap: 20px;
  font-size: 20px;
  align-items: center;
`
const WinnerItemAvatar = styled.img`
  width: 40px;
  height: 40px;
`
const WinnerItemUserName = styled.div`
  width: 20%;
  text-transform: capitalize;
`
const WinnerItemPubkey = styled(OverflowEllipsisBox)`
  flex: 1;
`
