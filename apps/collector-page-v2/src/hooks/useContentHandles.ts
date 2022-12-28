/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-28 18:38:38
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { toast } from 'react-toastify';
import useLogin from './useLogin';
import {
  favorsContent,
  voteContent,
  complete,
  personalFavors,
  personalVote,
  personalComplete,
} from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';
import { getContentShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';

export default () => {
  const { handleCallbackVerifyLogin } = useLogin();
  const { user } = useWlUserReact();
  // vote
  const [votedIds, setVotedContentIds] = useState<Array<number | string>>([]);
  const [voteQueueIds, setVoteQueueIds] = useState<Array<number | string>>([]);
  const onVote = useCallback(
    (data: ContentListItem) => {
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setVoteQueueIds([...new Set([...voteQueueIds, data.uuid])]);
            await personalVote(data.uuid, user.token);
            setVotedContentIds([...votedIds, data.uuid]);
          } else {
            setVoteQueueIds([...new Set([...voteQueueIds, data.id])]);
            await voteContent(data.id, user.token);
            setVotedContentIds([...votedIds, data.id]);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setVoteQueueIds([
            ...voteQueueIds.filter((id) =>
              data?.uuid ? id !== data.uuid : id !== data.id
            ),
          ]);
        }
      });
    },
    [
      user,
      votedIds,
      setVotedContentIds,
      voteQueueIds,
      setVoteQueueIds,
      handleCallbackVerifyLogin,
    ]
  );
  // favor
  const [favoredIds, setFavoredContentIds] = useState([]);
  const [favorQueueIds, setFavorQueueIds] = useState<Array<number | string>>(
    []
  );
  const onFavor = useCallback(
    (data: ContentListItem) => {
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setFavorQueueIds([...new Set([...favorQueueIds, data.uuid])]);
            await personalFavors(data.uuid, user.token);
            setFavoredContentIds([...favoredIds, data.uuid]);
          } else {
            setFavorQueueIds([...new Set([...favorQueueIds, data.id])]);
            await favorsContent(data.id, user.token);
            setFavoredContentIds([...favoredIds, data.id]);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setFavorQueueIds([
            ...favorQueueIds.filter((id) =>
              data?.uuid ? id !== data.uuid : id !== data.id
            ),
          ]);
        }
      });
    },
    [
      user,
      favoredIds,
      setFavoredContentIds,
      favorQueueIds,
      setFavorQueueIds,
      handleCallbackVerifyLogin,
    ]
  );

  // hidden
  const [hiddenIds, setHiddenContentIds] = useState([]);
  const [hiddenQueueIds, setHiddenQueueIds] = useState<Array<number | string>>(
    []
  );
  const onHidden = useCallback(
    (
      data: ContentListItem,
      callback?: {
        success?: () => void;
        error?: (error: Error) => void;
      }
    ) => {
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setHiddenQueueIds([...new Set([...hiddenQueueIds, data.uuid])]);
            await personalComplete(data.uuid, user.token);
            setHiddenContentIds([...hiddenIds, data.uuid]);
          } else {
            setHiddenQueueIds([...new Set([...hiddenQueueIds, data.id])]);
            await complete(data.id, user.token);
            setHiddenContentIds([...hiddenIds, data.id]);
          }
          if (callback && callback.success) {
            callback.success();
          }
        } catch (error) {
          if (callback && callback.error) {
            callback.error(error);
          }
          toast.error(error.message);
        } finally {
          setHiddenQueueIds([
            ...hiddenQueueIds.filter((id) =>
              data?.uuid ? id !== data.uuid : id !== data.id
            ),
          ]);
        }
      });
    },
    [
      user,
      hiddenIds,
      setHiddenContentIds,
      hiddenQueueIds,
      setHiddenQueueIds,
      handleCallbackVerifyLogin,
    ]
  );
  // share
  const onShare = useCallback((data: ContentListItem) => {
    tweetShare(data.title, getContentShareUrl(data.id));
  }, []);

  const formatCurrentContents = useCallback(
    (data: ContentListItem[]) =>
      (data || [])
        .filter((item) => !hiddenIds.includes(item?.uuid || item.id))
        .map((item) => ({
          ...item,
          upVoteNum: votedIds.includes(item?.uuid || item.id)
            ? item.upVoteNum + 1
            : item.upVoteNum,
          upVoted: item.upVoted || votedIds.includes(item?.uuid || item.id),
          favored: item.favored || favoredIds.includes(item?.uuid || item.id),
        })),
    [votedIds, favoredIds, hiddenIds]
  );
  return {
    votedIds,
    voteQueueIds,
    onVote,
    favoredIds,
    favorQueueIds,
    onFavor,
    hiddenIds,
    hiddenQueueIds,
    onHidden,
    onShare,
    formatCurrentContents,
  };
};
