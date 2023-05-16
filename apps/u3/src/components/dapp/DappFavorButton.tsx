import { FavorButton, FavorButtonProps } from '@us3r-network/link';
import styled from 'styled-components';

function DappFavorButton(props: FavorButtonProps) {
  return (
    <FavorButtonStyled {...props}>
      {({ isFavored, isFavoring }) =>
        isFavored ? 'Installed' : isFavoring ? 'Installing' : 'Install'
      }
    </FavorButtonStyled>
  );
}
export default DappFavorButton;
const FavorButtonStyled = styled(FavorButton)``;
