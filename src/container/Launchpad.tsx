/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-23 20:12:44
 * @FilePath: \synft-app\src\container\LaunchpadEnchaNFT.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import UnderwayList from '../components/launchpad/UnderwayList'
import UpcomingList from '../components/launchpad/UpcomingList'

function Launchpad() {
  const list = [
    {
      img: 'https://picsum.photos/500',
      name: `Trippin'Ape Tribe`,
      projectPartyName: `Trippin'Ape Tribe`,
      homeUrl: 'http://www.baidu.com',
      twitterUrl: 'http://www.baidu.com',
      discordUrl: 'http://www.baidu.com',
      desc: `10,000 Apes have fallen under the trance of a mysterious yet charismatic leader, Chorles, but don't worry… it's definitely not a cult.`,
      itemsNum: 6000,
      price: 4,
      enchanfted: 2,
    },
    {
      img: 'https://picsum.photos/500',
      name: `Trippin'Ape Tribe 2222`,
      projectPartyName: `Trippin'Ape Tribe`,
      homeUrl: 'http://www.baidu.com',
      twitterUrl: 'http://www.baidu.com',
      discordUrl: 'http://www.baidu.com',
      desc: `10,000 Apes have fallen under the trance of a mysterious yet charismatic leader, Chorles, but don't worry… it's definitely not a cult.`,
      itemsNum: 6000,
      price: 4,
      enchanfted: 2,
    },
    {
      img: 'https://picsum.photos/500',
      name: `Trippin'Ape Tribe 3333`,
      projectPartyName: `Trippin'Ape Tribe`,
      homeUrl: 'http://www.baidu.com',
      twitterUrl: 'http://www.baidu.com',
      discordUrl: 'http://www.baidu.com',
      desc: `10,000 Apes have fallen under the trance of a mysterious yet charismatic leader, Chorles, but don't worry… it's definitely not a cult.`,
      itemsNum: 6000,
      price: 4,
      enchanfted: 2,
    },
  ]
  return (
    <LaunchpadWrapper>
      <UnderwayList data={list} />
      <UpcomingList data={list} />
    </LaunchpadWrapper>
  )
}

export default Launchpad

const LaunchpadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`
