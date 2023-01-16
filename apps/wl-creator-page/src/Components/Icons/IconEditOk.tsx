import React from 'react';
import { ReactComponent as CloseIcon } from './svgs/edit_ok.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconEditOk: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CloseIcon width={size} height={size} opacity={opacity} />;
};

export default IconEditOk;
