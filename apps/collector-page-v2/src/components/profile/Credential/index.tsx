import styled from 'styled-components';

import { GalxeData, NooxData, PoapData } from '../../../services/types/profile';
import Galxe from './Galxe';
import Noox from './Noox';
import Poap from './Poap';

export default function Credential({
  galxe,
  poap,
  noox,
}: {
  galxe: GalxeData;
  poap: Array<PoapData>;
  noox: NooxData;
}) {
  return (
    <ContentBox>
      <Galxe data={galxe} />
      <Poap data={poap} />
      <Noox data={noox} />
    </ContentBox>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;