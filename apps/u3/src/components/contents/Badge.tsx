/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-13 18:01:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 11:15:09
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';

const contentTagStyleDefault = {
  color: '#718096',
};
const contentTagStyleMap = {
  DEFI: {
    color: '#6C8FC1',
  },
  GAMING: {
    color: '#56B59E',
  },
  NFT: {
    color: '',
  },
  DAO: {
    color: '#5564EA',
  },
  NEWS: {
    color: '#C16C6C',
  },
  READS: {
    color: '#A86ECB',
  },
  PODCAST: {
    color: '#B57856',
  },
  ARTICLE: {
    color: '#97B556',
  },
};
type Props = StyledComponentPropsWithRef<'span'> & {
  text: string;
};
export default function Badge({ text, ...otherProps }: Props) {
  const color = contentTagStyleMap[text]?.color ?? contentTagStyleDefault.color;
  return (
    <Box color={color} {...otherProps}>
      {text}
    </Box>
  );
}

const Box = styled.span<{ color: string }>`
  height: 18px;
  padding: 2px 4px;
  box-sizing: border-box;
  border: 1px solid ${({ color }) => color};
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;
`;
