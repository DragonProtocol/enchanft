/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-22 11:02:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-24 18:37:40
 * @FilePath: \synft-app\src\components\NFTList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { animated, useSprings } from 'react-spring'
import styled from 'styled-components'
import { CursorPointerUpCss } from '../GlobalStyle'
import { MEDIA_BREAK_POINTS } from '../utils/constants'
import NFTCard from './NFTCard'

import type { NFTDataItem } from '../synft'

export type NftDataItem = NFTDataItem
interface Props {
  data: NftDataItem[]
}
const NFTList: React.FC<Props> = (props: Props) => {
  const { data } = props
  const navigate = useNavigate()
  // 卡片交互动画
  const [cardAnimateds, cardAnimatedApi] = useSprings(data.length, (i) => ({
    transform: 'translateY(0px)',
    scale: 1,
    from: {
      scale: 0.9,
      transform: 'translateY(0px)',
    },
  }))
  const cardTo = (cardIndex: number, eventType: string) => {
    let style = {}
    switch (eventType) {
      case 'onMouseOverCapture':
        style = { transform: 'translateY(-4px)' }
        break
      case 'onMouseOutCapture':
        style = { transform: 'translateY(0px)' }
        break
      case 'onMouseDownCapture':
        style = { scale: 0.9 }
        break
      case 'onMouseUpCapture':
        style = { scale: 1 }
        break
      case 'onMouseLeave':
        style = { scale: 1 }
        break
    }
    cardAnimatedApi.start((i) => (cardIndex === i ? style : {}))
  }
  return (
    <NFTListWrapper>
      {data.map((item, idx) => {
        return (
          <animated.div
            key={item.mint}
            className="list-item"
            onClick={() => navigate(`/info/${item.mint}`)}
            style={{ ...(cardAnimateds[idx] || {}) }}
            onMouseOverCapture={() => cardTo(idx, 'onMouseOverCapture')}
            onMouseOutCapture={() => cardTo(idx, 'onMouseOutCapture')}
            onMouseDownCapture={() => cardTo(idx, 'onMouseDownCapture')}
            onMouseUpCapture={() => cardTo(idx, 'onMouseUpCapture')}
            onMouseLeave={() => cardTo(idx, 'onMouseLeave')}
          >
            <NFTCard data={item}></NFTCard>
          </animated.div>
        )
      })}
    </NFTListWrapper>
  )
}
export default NFTList
export const NFTListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 26px;
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
  .list-item {
    ${CursorPointerUpCss}
  }
`
