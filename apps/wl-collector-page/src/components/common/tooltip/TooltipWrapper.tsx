/*
 * @Author: shixuewen
 * @Date: 2022-04-02 14:20:04
 * @LastEditTime: 2022-04-02 14:32:15
 * @LastEditors: Please set LastEditors
 * @Description: 鼠标操作提示的包装盒子
 * @FilePath: \synft-app\src\components\common\TooltipWrapper.tsx
 */
import { Tooltip } from '@mui/material';

interface Props {
  /** 子元素 */
  children: any;
  /** 提示标题 */
  title: string;
  /**
   * @description: 如果启用，则会在鼠标悬浮时显示提示
   * @default true
   */
  enable?: boolean;
}
const TooltipWrapper: React.FC<Props> = ({
  children,
  title,
  enable = true,
}: Props) => {
  if (enable) {
    return (
      <Tooltip followCursor placement="top" title={title}>
        <span>{children}</span>
      </Tooltip>
    );
  }
  return children;
};
export default TooltipWrapper;
