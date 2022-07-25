/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 12:42:27
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import ExploreProjectSwiperItem, {
  ExploreProjectSwiperItemDataViewType,
  ExploreProjectSwiperItemHandlesType,
} from './ExploreProjectSwiperItem'
import RecommendSwiper, { RecommendSwiperItem } from '../../common/swiper/RecommendSwiper'
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
    <ExploreProjectSwiperWrapper>
      <RecommendSwiper
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
      </RecommendSwiper>
    </ExploreProjectSwiperWrapper>
  )
}
export default ExploreProjectSwiper
const ExploreProjectSwiperWrapper = styled.div`
  width: 100%;
`
