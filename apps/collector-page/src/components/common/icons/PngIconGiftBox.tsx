/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 18:35:50
 * @Description: file description
 */
import Icon from './pngs/gift_box.png';

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  size?: string;
};
const PngIconGiftBox: React.FC<Props> = ({
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
export default PngIconGiftBox;
