import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback } from 'react';
import { personalVote } from '../services/api/contents';

export function useVoteUp(uuid: string | number, upVoted: boolean) {
  const { user } = useWlUserReact();
  const voteUp = useCallback(async () => {
    if (upVoted) return false;
    await personalVote(`${uuid}`, user.token);
    return true;
  }, [user.token, uuid, upVoted]);
  return voteUp;
}