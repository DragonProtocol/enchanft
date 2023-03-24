import { useUs3rAuthModal } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useUs3rThreadContext } from '@us3r-network/thread';
import { useCallback, useMemo, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useUserFavorites from '../../hooks/useUserFavorites';
import { ButtonPrimary } from '../common/button/ButtonBase';

export type Props = StyledComponentPropsWithRef<'button'> & {
  threadId: string;
  onFavorSuccess?: () => void;
};

function DappFavorButton({ threadId, onFavorSuccess, ...otherProps }: Props) {
  const { dapps } = useUserFavorites();
  const { sessId } = useUs3rProfileContext()!;
  const { openLoginModal } = useUs3rAuthModal();
  const { createNewFavor } = useUs3rThreadContext()!;
  const [loading, setLoading] = useState(false);
  const submitNewFavor = useCallback(() => {
    setLoading(true);
    createNewFavor({ threadId })
      .then(() => {
        if (onFavorSuccess) {
          onFavorSuccess();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [createNewFavor, threadId, onFavorSuccess]);

  const hasFavored = useMemo(() => {
    return dapps.findIndex((d) => d?.threadStreamId === threadId) > -1;
  }, [dapps, threadId]);

  return (
    <ButtonPrimary
      disabled={hasFavored || loading}
      onClick={(e) => {
        e.stopPropagation();
        if (!sessId) {
          openLoginModal();
          return;
        }
        submitNewFavor();
      }}
      {...otherProps}
    >
      {hasFavored ? 'Installed' : loading ? 'Installing' : 'Install'}
    </ButtonPrimary>
  );
}
export default DappFavorButton;
