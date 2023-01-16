import React from 'react';
import { ReactComponent as CaretLeftIcon } from './svgs/tweet.svg';
interface Props {
  size?: string;
  opacity?: number;
}
const IconTweet: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CaretLeftIcon width={size} height={size} opacity={opacity} />;
};
export default IconTweet;
