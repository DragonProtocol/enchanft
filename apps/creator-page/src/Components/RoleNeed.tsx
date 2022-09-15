import styled from 'styled-components';

export default function RoleNeed({ content }: { content: string }) {
  return <Box>{content}</Box>;
}

const Box = styled.div`
  padding-top: 50px;
  text-align: center;
`;
