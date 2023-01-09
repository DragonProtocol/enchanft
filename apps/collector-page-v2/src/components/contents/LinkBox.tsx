import styled from 'styled-components';
import { LinkIcon } from '../icons/link';

export default function LinkBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <Box>
      <LinkIcon />
      <span>{text}</span>
    </Box>
  );
}

const Box = styled.span`
  padding: 2px 4px;
  /* height: 18px; */
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
