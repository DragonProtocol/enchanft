import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback } from 'react';
import { personalFavors } from '../services/api/contents';

export default function userFavored(uuid: string | number, favored: boolean) {
  const { user } = useWlUserReact();
  const favors = useCallback(async () => {
    if (favored) return false;
    await personalFavors(`${uuid}`, user.token);
    return true;
  }, [user.token, uuid, favored]);
  return favors;
}
