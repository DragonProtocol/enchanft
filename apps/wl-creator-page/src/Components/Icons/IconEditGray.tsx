import React from 'react';
import { ReactComponent as CloseIcon } from './svgs/edit_gray.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconEditGray: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CloseIcon width={size} height={size} opacity={opacity} />;
};

export default IconEditGray;
