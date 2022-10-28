import React from 'react';
import { ReactComponent as CaretLeftIcon } from './svgs/random.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconRandom: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CaretLeftIcon width={size} height={size} opacity={opacity} />;
};
export default IconRandom;
