import styled from 'styled-components';

export default function Badge({ text }: { text: string }) {
  return <Box>{text}</Box>;
}

const Box = styled.span`
  height: 18px;
  padding: 2px 4px;
  box-sizing: border-box;
  background: #718096;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: #14171a;
`;
