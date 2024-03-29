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
    <>
      <ContentBox id="profile-content-box">
        <Poap data={poap} />
        <Galxe data={galxe} />
        <Noox data={noox} />
      </ContentBox>
      <div className="placeholder" />
    </>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 0px;
  flex-direction: column;
`;
