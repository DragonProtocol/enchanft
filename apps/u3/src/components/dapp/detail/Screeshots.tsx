/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 11:52:09
 * @Description: file description
 */
import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Slider from 'react-slick';
import Card, { CardTitle } from './Card';
import ModalBase, { ModalBaseBody } from '../../common/modal/ModalBase';
import ComingSoonImgUrl from './imgs/screeshots.png';
// import ComingSoonImgUrl from './imgs/screeshots.png';
import picNextCur from './imgs/pic_next.png';
import picPrevCur from './imgs/pic_prev.png';
import { SectionTitle } from './SectionTitle';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Props = StyledComponentPropsWithRef<'div'> & {
  urls: string[];
};
const settings = {
  arrows: false,
  dots: true,
  // autoplay: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  className: 'slides',
  dotsClass: 'slick-dots slick-thumb',
};
export default function Screeshots({ urls, ...otherProps }: Props) {
  const [showImgIndex, setShowImgIndex] = useState(-1);

  const closePictureViewer = () => setShowImgIndex(-1);

  return (
    <ScreeshotsWrapper {...otherProps}>
      <CardTitle>Screeshots</CardTitle>
      <SliderWrapper>
        <Slider {...settings}>
          {urls.map((url, index) => (
            <ScreeshotImg src={url} onClick={() => setShowImgIndex(index)} />
          ))}
        </Slider>
      </SliderWrapper>
      <ModalBase
        isOpen={showImgIndex !== -1}
        onRequestClose={closePictureViewer}
        style={{ overlay: { zIndex: 1000 } }}
      >
        <ModalBody onClick={closePictureViewer}>
          {showImgIndex > 0 && (
            <div
              className="picture-viewer prev"
              onClick={(e) => {
                e.stopPropagation();
                setShowImgIndex((index) => index - 1);
              }}
            />
          )}
          {showImgIndex < urls.length - 1 && (
            <div
              className="picture-viewer next"
              onClick={(e) => {
                e.stopPropagation();
                setShowImgIndex((index) => index + 1);
              }}
            />
          )}

          <ScreeshotImg
            src={urls?.[showImgIndex]}
            isZoomOut
            onClick={closePictureViewer}
          />
        </ModalBody>
      </ModalBase>
    </ScreeshotsWrapper>
  );
}

const ScreeshotsWrapper = styled(Card)`
  width: 100%;
  height: 312px;
`;

const SliderWrapper = styled.div`
  width: 100%;
  margin-top: 20px;

  .slick-slide div {
    padding: 0 10px;
  }

  /* 设置 dots 容器样式 */
  .slick-dots {
    margin-top: 20px;
  }

  /* 设置每个 dot 的样式 */
  .slick-dots li {
    height: 4px;
  }

  /* 设置 dot 按钮的样式 */
  .slick-dots li button {
    margin: 0 auto;
    width: 8px;
    height: 4px;
    background: #718096;
    border-radius: 10px;
    padding: 0;
    transition: all 0.3s ease;
  }

  /* 隐藏默认的 dot 字符 */
  .slick-dots li button:before {
    display: none;
  }

  /* 设置激活状态的 dot 的样式 */
  .slick-dots li.slick-active button {
    width: 20px;
  }
`;

const ScreeshotImg = styled.img<{ isZoomOut?: boolean }>`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;

  ${(props) =>
    props.isZoomOut
      ? `
    cursor: zoom-out;
    width: auto;
    height: auto;
    max-width: 1380px;
    max-height: 100%;

  `
      : `cursor: zoom-in;`}
`;

const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;

const ModalBody = styled(ModalBaseBody)`
  background: transparent;
  padding-top: 12%;
  position: relative;

  .picture-viewer {
    width: 130px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: url(${picPrevCur}), auto;
  }

  .next {
    left: unset;
    right: 0;
    cursor: url(${picNextCur}), auto;
  }
  /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
`;

export function ScreeshotsMobile({ ...otherProps }: Props) {
  return (
    <ScreeshotsWrapperMobile {...otherProps}>
      <SectionTitle>Screeshots</SectionTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </ScreeshotsWrapperMobile>
  );
}

const ScreeshotsWrapperMobile = styled.div`
  width: 100%;
`;
