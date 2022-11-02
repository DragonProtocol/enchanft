import React from 'react';
import { ReactComponent as RightIcon } from './svgs/right_website.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconRightWebsite: React.FC<Props> = ({
  size = '1.5rem',
  opacity = 1,
}) => {
  return <RightIcon width={size} height={size} opacity={opacity} />;
};
export default IconRightWebsite;
