/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 15:32:46
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
  const [votePendingIds, setVotePendingIds] = useState<Array<number | string>>(
    []
  );
  const onVote = useCallback(
    (data: ContentListItem) => {
      if (
        data.upVoted ||
        votedIds.includes(data?.uuid || data.id) ||
        votePendingIds.includes(data?.uuid || data.id)
      )
        return;
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setVotePendingIds([...new Set([...votePendingIds, data.uuid])]);
            await personalVote(data.uuid, user.token);
            setVotedContentIds([...votedIds, data.uuid]);
          } else {
            setVotePendingIds([...new Set([...votePendingIds, data.id])]);
            await voteContent(data.id, user.token);
            setVotedContentIds([...votedIds, data.id]);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setVotePendingIds([
            ...votePendingIds.filter((id) =>
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
      votePendingIds,
      setVotePendingIds,
      handleCallbackVerifyLogin,
    ]
  );
  // favor
  const [favoredIds, setFavoredContentIds] = useState([]);
  const [favorPendingIds, setFavorPendingIds] = useState<
    Array<number | string>
  >([]);
  const onFavor = useCallback(
    (data: ContentListItem) => {
      if (
        data.favored ||
        favoredIds.includes(data?.uuid || data.id) ||
        favorPendingIds.includes(data?.uuid || data.id)
      )
        return;
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setFavorPendingIds([...new Set([...favorPendingIds, data.uuid])]);
            await personalFavors(data.uuid, user.token);
            setFavoredContentIds([...favoredIds, data.uuid]);
          } else {
            setFavorPendingIds([...new Set([...favorPendingIds, data.id])]);
            await favorsContent(data.id, user.token);
            setFavoredContentIds([...favoredIds, data.id]);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setFavorPendingIds([
            ...favorPendingIds.filter((id) =>
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
      favorPendingIds,
      setFavorPendingIds,
      handleCallbackVerifyLogin,
    ]
  );

  // hidden
  const [hiddenIds, setHiddenContentIds] = useState([]);
  const [hiddenPendingIds, setHiddenPendingIds] = useState<
    Array<number | string>
  >([]);
  const onHidden = useCallback(
    (
      data: ContentListItem,
      callback?: {
        success?: () => void;
        error?: (error: Error) => void;
      }
    ) => {
      if (
        data.hidden ||
        hiddenIds.includes(data?.uuid || data.id) ||
        hiddenPendingIds.includes(data?.uuid || data.id)
      )
        return;
      handleCallbackVerifyLogin(async () => {
        try {
          if (data?.uuid) {
            setHiddenPendingIds([...new Set([...hiddenPendingIds, data.uuid])]);
            await personalComplete(data.uuid, user.token);
            setHiddenContentIds([...hiddenIds, data.uuid]);
          } else {
            setHiddenPendingIds([...new Set([...hiddenPendingIds, data.id])]);
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
          setHiddenPendingIds([
            ...hiddenPendingIds.filter((id) =>
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
      hiddenPendingIds,
      setHiddenPendingIds,
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
    votePendingIds,
    onVote,
    favoredIds,
    favorPendingIds,
    onFavor,
    hiddenIds,
    hiddenPendingIds,
    onHidden,
    onShare,
    formatCurrentContents,
  };
};
