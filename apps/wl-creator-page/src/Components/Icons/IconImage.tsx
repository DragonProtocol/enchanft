import React from 'react';
import { ReactComponent as Icon } from './svgs/image.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconImage: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <Icon width={size} height={size} opacity={opacity} />;
};

export default IconImage;
