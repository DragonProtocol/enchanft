/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-20 17:46:47
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import useLogin from './useLogin';
import { favorsContent, voteContent } from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';
import { getContentShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';
import useContentHidden from './useContentHidden';

export default () => {
  const { handleLoginVerify } = useLogin();
  const { user } = useWlUserReact();
  // vote
  const [votedIds, setVotedContentIds] = useState([]);
  const onVote = useCallback(
    (data: ContentListItem) => {
      handleLoginVerify(() => {
        voteContent(data.id, user.token)
          .then(() => {
            setVotedContentIds([...votedIds, data.id]);
          })
          .catch((error) => toast.error(error.message));
      });
    },
    [votedIds, setVotedContentIds, handleLoginVerify]
  );
  // favor
  const [favoredIds, setFavoredContentIds] = useState([]);
  const onFavor = useCallback(
    (data: ContentListItem) => {
      handleLoginVerify(() => {
        favorsContent(data.id, user.token)
          .then(() => {
            setFavoredContentIds([...favoredIds, data.id]);
          })
          .catch((error) => toast.error(error.message));
      });
    },
    [favoredIds, setFavoredContentIds, handleLoginVerify]
  );

  // hidden
  const { keysFilter: hiddenIds, contentHiddenOrNot } = useContentHidden();
  const onHidden = useCallback(
    (data: ContentListItem) => {
      contentHiddenOrNot(data?.uid || data.id);
    },
    [contentHiddenOrNot]
  );
  // share
  const onShare = useCallback((data: ContentListItem) => {
    tweetShare(data.title, getContentShareUrl(data.id));
  }, []);

  const formatCurrentContents = useCallback(
    (data: ContentListItem[]) =>
      (data || [])
        .filter((item) => !hiddenIds.includes(item.uid || item.id))
        .map((item) => ({
          ...item,
          upVoteNum: votedIds.includes(item.id)
            ? item.upVoteNum + 1
            : item.upVoteNum,
          upVoted: item.upVoted || votedIds.includes(item.id),
          favored: item.favored || favoredIds.includes(item.id),
        })),
    [votedIds, favoredIds, hiddenIds]
  );
  return {
    votedIds,
    favoredIds,
    hiddenIds,
    onVote,
    onFavor,
    onHidden,
    onShare,
    formatCurrentContents,
  };
};
