import React from 'react';
import { ReactComponent as RightIcon } from './svgs/right.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconCheckboxChecked: React.FC<Props> = ({
  size = '1.5rem',
  opacity = 1,
}) => {
  return <RightIcon width={size} height={size} opacity={opacity} />;
};
export default IconCheckboxChecked;
