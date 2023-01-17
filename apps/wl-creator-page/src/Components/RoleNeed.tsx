import styled from 'styled-components';

export default function RoleNeed({ content }: { content: string }) {
  return (
    <Box>
      {content}
      <br />
      <p>
        <a
          href="https://twitter.com/realwlxyz"
          target="_blank"
          rel="noreferrer noopener"
        >
          {' '}
          DM
        </a>{' '}
        us
      </p>
    </Box>
  );
}

const Box = styled.div`
  padding-top: 50px;
  text-align: center;
`;
