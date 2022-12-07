import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback } from 'react';
import { voteContent } from '../services/api/contents';

export function useVoteUp(id: number, upVoted: boolean) {
  const { user } = useWlUserReact();
  const voteUp = useCallback(async () => {
    if (upVoted) return;
    await voteContent(id, user.token);
  }, [user.token, id, upVoted]);
  return voteUp;
}
