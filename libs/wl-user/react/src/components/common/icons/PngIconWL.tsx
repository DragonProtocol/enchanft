import { HTMLAttributes } from 'react'
import Icon from './pngs/wl.png'
type Props = HTMLAttributes<HTMLImageElement> & {
  size?: string
}
const PngIcon: React.FC<Props> = ({ size = '1.5rem', style, ...imgProps }) => {
  const _props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  }
  return <img src={Icon} {..._props} />
}
export default PngIcon