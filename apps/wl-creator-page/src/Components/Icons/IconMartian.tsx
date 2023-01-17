import React from 'react';
import { ReactComponent as MartianIcon } from './svgs/martian.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconMartian: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <MartianIcon width={size} height={size} opacity={opacity} />;
};

export default IconMartian;
