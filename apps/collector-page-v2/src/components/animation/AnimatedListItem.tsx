/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-21 18:15:07
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 15:04:48
 * @Description: file description
 */
import {
  useTransition,
  animated,
  TransitionFn,
  SpringValue,
} from '@react-spring/web';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

export type TransitionStyles = {
  transform: SpringValue<string>;
  opacity: SpringValue<number>;
  bottomTransform: SpringValue<string>;
  bottomOpacity: SpringValue<number>;
};
export type AnimatedListTransitionItem<T> = T;
export type AnimatedListTransition<T> = TransitionFn<
  AnimatedListTransitionItem<T>,
  TransitionStyles
>;
export function useAnimatedListTransition<T>(
  items: Array<AnimatedListTransitionItem<T>>,
  keyField?: string
) {
  return useTransition(items, {
    keys: (item) => item[keyField || 'id'],
    from: {
      transform: 'rotateX(90deg)',
      opacity: 0,
      bottomTransform: 'rotateX(0deg)',
      bottomOpacity: 1,
    },
    enter: {
      transform: 'rotateX(0deg)',
      opacity: 1,
      bottomTransform: 'rotateX(-90deg)',
      bottomOpacity: 0,
    },
    leave: {
      transform: 'rotateX(90deg)',
      opacity: 0,
      bottomTransform: 'rotateX(0deg)',
      bottomOpacity: 0,
    },
    trail: 200,
    config: {
      duration: 500,
      mass: 5,
      tension: 500,
      friction: 100,
    },
  });
}

type Props = StyledComponentPropsWithRef<'div'> & {
  styles: TransitionStyles;
};
export default function AnimatedListItem({ children, styles }: Props) {
  const { transform, opacity, bottomTransform, bottomOpacity } = styles;
  return (
    <AnimatedListItemCube>
      <animated.div
        className="cube-face cube-face-front"
        style={{ transform, opacity }}
      >
        <div
          ref={(ref: HTMLDivElement) => {
            if (ref) {
              const heightNumber = ref.offsetHeight;
              const heightStr = `${ref.offsetHeight}px`;
              const cubeEl = ref.parentElement.parentElement;
              if (cubeEl) {
                cubeEl.style.height = heightStr;
                cubeEl.style.perspective = `${heightNumber * 4}px`;
              }
              const faceEls = cubeEl.querySelectorAll('.cube-face');

              if (faceEls.length) {
                faceEls.forEach((el) => {
                  (el as HTMLDivElement).style.height = heightStr;
                  (el as HTMLDivElement).style.transformOrigin = `50% 50% -${
                    heightNumber / 2
                  }px`;
                });
              }
            }
          }}
        >
          {children}
        </div>
      </animated.div>
      <animated.div
        className="cube-face cube-face-bottom"
        style={{ transform: bottomTransform, opacity: bottomOpacity }}
      />
    </AnimatedListItemCube>
  );
}
const AnimatedListItemCube = styled.div`
  position: relative;
  width: 100%;
  .cube-face {
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
  }
  .cube-face-bottom {
    background-color: #000;
  }
`;
