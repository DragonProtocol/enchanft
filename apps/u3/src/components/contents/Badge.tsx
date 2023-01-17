import styled from 'styled-components';

export default function Badge({ text }: { text: string }) {
  return <Box>{text}</Box>;
}

const Box = styled.span`
  padding: 2px 4px;
  background: #718096;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: #14171a;
`;
