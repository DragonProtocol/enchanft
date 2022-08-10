/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-09 16:52:10
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import ExploreTaskSwiperItem, {
  ExploreTaskSwiperItemDataViewType,
  ExploreTaskSwiperItemHandlesType,
} from './ExploreTaskSwiperItem'
import RecommendSwiper, { RecommendSwiperItem } from '../../common/swiper/RecommendSwiper'
export type ExploreTaskSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExplorTaskSwiperItemsType = ExploreTaskSwiperItemDataViewType[]
export type ExploreTaskSwiperProps = ExploreTaskSwiperViewConfigType &
  ExploreTaskSwiperItemHandlesType & {
    items: ExplorTaskSwiperItemsType
  }
const ExploreTaskSwiper: React.FC<ExploreTaskSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'task empty',
}: ExploreTaskSwiperProps) => {
  const itemLen = items.length
  const navigation = itemLen > 1 ? true : false
  const autoplay = itemLen > 1 ? true : false
  const loop = itemLen > 1 ? true : false
  const pagination = itemLen > 1 ? true : false
  return (
    <ExploreTaskSwiperWrapper
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
          <ExploreTaskSwiperItem data={item.data} viewConfig={item.viewConfig} />
        </RecommendSwiperItem>
      ))}
    </ExploreTaskSwiperWrapper>
  )
}
export default ExploreTaskSwiper
const ExploreTaskSwiperWrapper = styled(RecommendSwiper)`
  width: 100%;
`
