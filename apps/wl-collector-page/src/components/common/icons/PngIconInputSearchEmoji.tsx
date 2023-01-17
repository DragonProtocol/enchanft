/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 19:45:27
 * @Description: file description
 */
import Icon from './pngs/input_search_emoji.png';

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  size?: string;
};
const PngIconInputSearchEmoji: React.FC<Props> = ({
  size = '1.5rem',
  style,
  ...imgProps
}: Props) => {
  const props = {
    style: { width: size, height: size, ...style },
    ...imgProps,
  };
  return <img src={Icon} {...props} />;
};
export default PngIconInputSearchEmoji;
