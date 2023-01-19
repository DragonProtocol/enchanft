/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:00:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-19 17:55:59
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import LinkSvgUrl from '../common/icons/svgs/link.svg';

type Props = StyledComponentPropsWithRef<'div'> & {
  text: string;
  displayOriginIcon?: boolean;
};

export default function LinkBox({
  text,
  displayOriginIcon = true,
  ...otherProps
}: Props) {
  if (!text) return null;
  const linkSplitAry = text.split('/');
  const platformImgUrl = `${linkSplitAry[0]}//${linkSplitAry[2]}/favicon.ico`;
  return (
    <Box {...otherProps}>
      <PlatformImg
        src={displayOriginIcon ? platformImgUrl : LinkSvgUrl}
        onError={(e) => {
          if (displayOriginIcon) {
            e.currentTarget.src = LinkSvgUrl;
          }
        }}
      />
      <span>{text}</span>
    </Box>
  );
}

const Box = styled.div`
  padding: 2px 4px;
  height: 18px;
  box-sizing: border-box;
  background: #14171a;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 4px;

  > span {
    flex: 1;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #718096;

    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;
const PlatformImg = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: auto;
`;
