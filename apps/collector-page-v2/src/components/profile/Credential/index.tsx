import styled from 'styled-components';
import Galxe from './Galxe';
import Noox from './Noox';
import Poap from './Poap';

export default function Credential() {
  return (
    <ContentBox>
      <Galxe />
      <Poap />
      <Noox />
    </ContentBox>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;
