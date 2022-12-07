import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback } from 'react';
import { favorsContent } from '../services/api/contents';

export default function userFavored(id: number, favored: boolean) {
  const { user } = useWlUserReact();
  const favors = useCallback(async () => {
    if (favored) return;
    await favorsContent(id, user.token);
  }, [user.token, id, favored]);
  return favors;
}
