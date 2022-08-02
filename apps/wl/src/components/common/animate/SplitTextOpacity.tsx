import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { animated, useSprings } from 'react-spring';
export interface SplitTextOpacityFuns {
  restart: () => void;
}
const SplitTextOpacity = (props: { children: any }, ref: Ref<unknown>) => {
  const { children } = props;
  const textAry = (children as string).split('') || [];
  const textLen = textAry.length;
  const [springs, api] = useSprings(textLen, (index) => ({
    opacity: 1,
    from: { opacity: 0 },
    delay: Math.random() * 500,
  }));
  useImperativeHandle(ref, () => ({
    restart: () => {
      api.start((index) => ({ opacity: 0, delay: Math.random() * 500 }));
      setTimeout(() => {
        api.start((index) => ({ opacity: 1, delay: Math.random() * 500 }));
      }, 500);
    },
  }));

  return textLen > 0
    ? springs.map((styles, idx) => (
        <animated.span key={idx} style={styles}>
          {textAry[idx]}
        </animated.span>
      ))
    : children;
};
export default forwardRef(SplitTextOpacity);
