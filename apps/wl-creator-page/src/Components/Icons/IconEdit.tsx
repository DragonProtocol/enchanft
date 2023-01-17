import React from 'react';
import { ReactComponent as CloseIcon } from './svgs/edit.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconEdit: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CloseIcon width={size} height={size} opacity={opacity} />;
};

export default IconEdit;
