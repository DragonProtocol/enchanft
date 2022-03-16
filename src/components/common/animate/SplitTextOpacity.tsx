import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
export interface SplitTextOpacityFuns {
  restart: () => void
}
const SplitTextOpacity = (props: { children: any }, ref: Ref<unknown>) => {
  const { children } = props
  const [opacity, setOpacity] = useState({ from: 0, to: 1 })
  useImperativeHandle(ref, () => ({
    restart: () => {
      setOpacity({ from: 1, to: 0 })
      setTimeout(() => {
        setOpacity({ from: 0, to: 1 })
      }, 500)
    },
  }))
  const animation = (i: number) =>
    useSpring({ opacity: opacity.to, from: { opacity: opacity.from }, delay: Math.random() * 500 })

  return (
    children &&
    (children as string).split('').map((item, index) => (
      <animated.span key={index} style={animation(index)}>
        {item}
      </animated.span>
    ))
  )
}
export default forwardRef(SplitTextOpacity)
