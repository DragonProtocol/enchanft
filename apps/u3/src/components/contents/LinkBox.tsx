import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { LinkIcon } from '../icons/link';

type Props = StyledComponentPropsWithRef<'div'> & { text: string };

export default function LinkBox({ text, ...otherProps }: Props) {
  if (!text) return null;
  return (
    <Box {...otherProps}>
      <LinkIcon />
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
