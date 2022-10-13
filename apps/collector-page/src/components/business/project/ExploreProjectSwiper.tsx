/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 17:06:24
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import ExploreProjectSwiperItem, {
  ExploreProjectSwiperItemDataViewType,
  ExploreProjectSwiperItemHandlesType,
} from './ExploreProjectSwiperItem'
import RecommendSwiper, { RecommendSwiperItem } from '../../common/swiper/RecommendSwiper'
import { MOBILE_BREAK_POINT } from '../../../constants'
export type ExploreProjectSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExplorProjectSwiperItemsType = ExploreProjectSwiperItemDataViewType[]
export type ExploreProjectSwiperProps = ExploreProjectSwiperViewConfigType &
  ExploreProjectSwiperItemHandlesType & {
    items: ExplorProjectSwiperItemsType
  }
const ExploreProjectSwiper: React.FC<ExploreProjectSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'task empty',
}: ExploreProjectSwiperProps) => {
  const itemLen = items.length
  const navigation = itemLen > 1 ? true : false
  const autoplay = itemLen > 1 ? true : false
  const loop = itemLen > 1 ? true : false
  const pagination = itemLen > 1 ? true : false
  return (
    <ExploreProjectSwiperWrapper
      navigation={navigation}
      autoplay={autoplay}
      loop={loop}
      pagination={pagination}
      loading={loading}
      loadingMsg={loadingMsg}
      emptyMsg={emptyMsg}
    >
      {items.map((item) => (
        <RecommendSwiperItem key={item.data.id}>
          <ExploreProjectSwiperItem data={item.data} viewConfig={item.viewConfig} />
        </RecommendSwiperItem>
      ))}
    </ExploreProjectSwiperWrapper>
  )
}
export default ExploreProjectSwiper
const ExploreProjectSwiperWrapper = styled(RecommendSwiper)`
  width: 100%;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    .recommend-swiper-prev,
    .recommend-swiper-next {
      width: 40px;
      height: 40px;
      border-radius: 16px;
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`
