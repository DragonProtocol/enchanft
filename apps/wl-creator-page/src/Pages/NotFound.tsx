import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function NotFound() {
  return (
    <Box>
      <h3>Page Not Found</h3>
      <p>
        <Link to={'/'}>Back To Home</Link>{' '}
      </p>
    </Box>
  );
}

const Box = styled.div`
  text-align: center;
  padding-top: 50px;
  color: #333333;
  & h3 {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    color: inherit;
  }
`;
