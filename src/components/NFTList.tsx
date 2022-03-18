import React from 'react'
import { useNavigate } from 'react-router-dom'
import { animated, useSprings } from 'react-spring'
import styled from 'styled-components'
import { CursorPointerUpCss } from '../GlobalStyle'
import NFTCard from './NFTCard'
export interface NftDataItem {
  mint?: string
  image?: string
  name?: string
  uri?: string
  hasCopied?: boolean
  hasInjected?: boolean
}
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
const NFTListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .list-item {
    flex: 1;
    margin: 0 8px 8px 0; // 间隙为8px
    width: calc((100% - 32px) / 4); // 这里的32px = (分布个数3-1)*间隙4px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
    max-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
    ${CursorPointerUpCss}
  }
`
