/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:13:22
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ExploreTaskSwiperItem, {
  ExploreTaskSwiperItemDataViewType,
  ExploreTaskSwiperItemHandlesType,
} from './ExploreTaskSwiperItem';
import RecommendSwiper, {
  RecommendSwiperItem,
} from '../../common/swiper/RecommendSwiper';
import { MEDIA_BREAK_POINTS, MOBILE_BREAK_POINT } from '../../../constants';

export type ExploreTaskSwiperViewConfigType = {
  loading?: boolean;
  loadingMsg?: string;
  emptyMsg?: string;
};
export type ExplorTaskSwiperItemsType = ExploreTaskSwiperItemDataViewType[];
export type ExploreTaskSwiperProps = ExploreTaskSwiperViewConfigType &
  ExploreTaskSwiperItemHandlesType & {
    items: ExplorTaskSwiperItemsType;
  };
const ExploreTaskSwiper: React.FC<ExploreTaskSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'task empty',
}: ExploreTaskSwiperProps) => {
  const itemLen = items.length;
  const navigation = itemLen > 1;
  const autoplay = itemLen > 1;
  const loop = itemLen > 1;
  const pagination = itemLen > 1;
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
          <ExploreTaskSwiperItem
            data={item.data}
            viewConfig={item.viewConfig}
          />
        </RecommendSwiperItem>
      ))}
    </ExploreTaskSwiperWrapper>
  );
};
export default ExploreTaskSwiper;
const ExploreTaskSwiperWrapper = styled(RecommendSwiper)`
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
`;
