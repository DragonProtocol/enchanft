import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import IconCaretLeft from '../icons/IconCaretLeft';
import IconCaretRight from '../icons/IconCaretRight';
import ButtonNavigation from '../button/ButtonNavigation';
import Loading from '../loading/Loading';

export type RecommendSwiperProps = HTMLAttributes<HTMLDivElement> & {
  loading?: boolean;
  loadingMsg?: string;
  emptyMsg?: string;
  navigation?: boolean;
  autoplay?: boolean;
  pagination?: boolean;
  loop?: boolean;
};
const RecommendSwiper: React.FC<RecommendSwiperProps> = ({
  children,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'empty',
  navigation,
  autoplay,
  pagination,
  loop,
  ...divProps
}: RecommendSwiperProps) => {
  const modulesConfig: any[] = [];
  const navigationConfig: any = {};
  const autoplayConfig: any = {};
  if (navigation) {
    modulesConfig.push(Navigation);
    Object.assign(navigationConfig, {
      nextEl: '.recommend-swiper-next',
      prevEl: '.recommend-swiper-prev',
    });
  }
  if (autoplay) {
    modulesConfig.push(Autoplay);
    Object.assign(autoplayConfig, {
      delay: 6000,
    });
  }
  const paginationConfig = {
    clickable: pagination ? true : false,
  };
  const loopConfig = loop ? true : false;
  return (
    <RecommendSwiperWrapper {...divProps}>
      {navigation && (
        <RecommendSwiperLeft className="recommend-swiper-prev">
          <IconCaretLeft />
        </RecommendSwiperLeft>
      )}
      {loading ? (
        <RecommendSwiperBox>
          <RecommendSwiperLoading>
            <Loading />
          </RecommendSwiperLoading>
        </RecommendSwiperBox>
      ) : (
        <RecommendSwiperBox>
          <Swiper
            className="recommend-swiper"
            spaceBetween={50}
            slidesPerView={1}
            loop={loopConfig}
            modules={modulesConfig}
            navigation={navigationConfig}
            autoplay={autoplayConfig}
            pagination={paginationConfig}
          >
            {children || (
              <RecommendSwiperItem>
                <RecommendSwiperEmpty>{emptyMsg}</RecommendSwiperEmpty>
              </RecommendSwiperItem>
            )}
          </Swiper>
        </RecommendSwiperBox>
      )}

      {navigation && (
        <RecommendSwiperRight className="recommend-swiper-next">
          <IconCaretRight />
        </RecommendSwiperRight>
      )}
    </RecommendSwiperWrapper>
  );
};
export default RecommendSwiper;
const RecommendSwiperWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  .recommend-swiper {
    width: 100%;
    height: 100%;
  }
`;
const RecommendSwiperBox = styled.div`
  width: calc(100% - 8px);
  margin: 0 auto;
  height: calc(100% - 8px);
  outline: 4px solid #333333;

  box-sizing: border-box;
  background: #f7f9f1;

  box-shadow: 0px 8px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  overflow: hidden;
`;
const RecommendSwiperLeft = styled(ButtonNavigation)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
`;
const RecommendSwiperRight = styled(ButtonNavigation)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  cursor: pointer;
  z-index: 2;
`;
const RecommendSwiperLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RecommendSwiperEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const RecommendSwiperItem = SwiperSlide;
