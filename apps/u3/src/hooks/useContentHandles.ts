/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 19:11:35
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
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
  delFavors,
} from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';
import { getContentShareUrl } from '../utils/share';
import { tweetShare } from '../utils/twitter';
import { fetchUserKarma } from '../features/profile/karma';
import { store } from '../store/store';
import { messages } from '../utils/message';

// cache content handle pending ids
const cacheContentVotePendingIds = new Set<number | string>();
const cacheContentFavorPendingIds = new Set<number | string>();
const cacheContentHiddenPendingIds = new Set<number | string>();
const cacheContentHiddenTimer = new Map<number | string, NodeJS.Timeout>();

export default (
  contents?: ContentListItem[],
  setContents?: (newContents: ContentListItem[]) => void
) => {
  const { handleCallbackVerifyLogin } = useLogin();
  const { user } = useWlUserReact();

  const updateOne = useCallback(
    (id: string | number, data: Partial<ContentListItem>) => {
      if (setContents) {
        setContents(
          (contents ?? []).map((item) =>
            item.id === id || item.uuid === id ? { ...item, ...data } : item
          )
        );
      }
    },
    [contents, setContents]
  );

  const deleteOne = useCallback(
    (id: string | number) => {
      if (setContents) {
        setContents(
          (contents ?? []).filter((item) => item.id !== id && item.uuid !== id)
        );
      }
    },
    [contents, setContents]
  );

  // vote
  const [votePendingIds, setVotePendingIds] = useState([
    ...cacheContentVotePendingIds,
  ]);
  const onVote = useCallback(
    (data: ContentListItem) => {
      return new Promise<void>((resolve, reject) => {
        if (
          data.upVoted ||
          cacheContentVotePendingIds.has(data?.uuid || data.id)
        )
          return;
        handleCallbackVerifyLogin(async () => {
          try {
            cacheContentVotePendingIds.add(data?.uuid || data.id);
            setVotePendingIds([...cacheContentVotePendingIds]);
            if (data?.uuid) {
              await personalVote(data.uuid, user.token);
            } else {
              await voteContent(data.id, user.token);
            }
            updateOne(data.uuid || data.id, {
              upVoted: true,
              upVoteNum: data.upVoteNum + 1,
            });
            store.dispatch(fetchUserKarma({ token: user.token }));
            resolve();
          } catch (error) {
            toast.error(error?.message || error?.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentVotePendingIds.delete(data?.uuid || data.id);
            setVotePendingIds([...cacheContentVotePendingIds]);
          }
        });
      });
    },
    [
      user,
      votePendingIds,
      setVotePendingIds,
      handleCallbackVerifyLogin,
      updateOne,
    ]
  );
  // favor
  const [favorPendingIds, setFavorPendingIds] = useState([
    ...cacheContentFavorPendingIds,
  ]);
  const onFavor = useCallback(
    (data: ContentListItem) => {
      return new Promise<void>((resolve, reject) => {
        if (cacheContentFavorPendingIds.has(data?.uuid || data.id)) return;
        handleCallbackVerifyLogin(async () => {
          try {
            cacheContentFavorPendingIds.add(data?.uuid || data.id);
            setFavorPendingIds([...cacheContentFavorPendingIds]);
            if (data.favored && data.id) {
              await delFavors(data.id, user.token);
            } else if (data?.uuid) {
              await personalFavors(data.uuid, user.token);
            } else {
              await favorsContent(data.id, user.token);
            }
            updateOne(data.uuid || data.id, {
              favored: !data.favored,
            });
            resolve();
          } catch (error) {
            toast.error(error?.message || error?.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentFavorPendingIds.delete(data?.uuid || data.id);
            setFavorPendingIds([...cacheContentFavorPendingIds]);
          }
        });
      });
    },
    [
      user,
      favorPendingIds,
      setFavorPendingIds,
      handleCallbackVerifyLogin,
      updateOne,
    ]
  );

  // hidden
  const [hiddenPendingIds, setHiddenPendingIds] = useState([
    ...cacheContentHiddenPendingIds,
  ]);
  const onHidden = useCallback(
    (
      data: ContentListItem,
      callback?: {
        success?: () => void;
        error?: (error: Error) => void;
      }
    ) => {
      return new Promise((resolve, reject) => {
        if (
          data.hidden ||
          cacheContentHiddenPendingIds.has(data?.uuid || data.id)
        )
          return;
        handleCallbackVerifyLogin(async () => {
          try {
            cacheContentHiddenPendingIds.add(data?.uuid || data.id);
            setHiddenPendingIds([...cacheContentHiddenPendingIds]);
            if (data?.uuid) {
              const resp = await personalComplete(data.uuid, user.token);
              resolve(resp);
            } else {
              const resp = await complete(data.id, user.token);
              resolve(resp);
            }
            deleteOne(data.uuid || data.id);
            if (callback && callback.success) {
              callback.success();
            }
          } catch (error) {
            if (callback && callback.error) {
              callback.error(error);
            }
            toast.error(error?.message || error?.msg || messages.common.error);
            reject(error);
          } finally {
            cacheContentHiddenPendingIds.delete(data?.uuid || data.id);
            setHiddenPendingIds([...cacheContentHiddenPendingIds]);
          }
        });
      });
    },
    [
      user,
      hiddenPendingIds,
      setHiddenPendingIds,
      handleCallbackVerifyLogin,
      deleteOne,
    ]
  );
  // hidden action
  const onHiddenAction = useCallback(
    (data: ContentListItem) => {
      handleCallbackVerifyLogin(() => {
        const key = data?.uuid || data?.id;
        updateOne(key, { hidden: true });
        const timer = setTimeout(() => {
          onHidden(data);
        }, 3000);
        cacheContentHiddenTimer.set(key, timer);
      });
    },
    [handleCallbackVerifyLogin, updateOne, onHidden]
  );
  // hidden undo action
  const onHiddenUndoAction = useCallback(
    (data: ContentListItem) => {
      const key = data?.uuid || data?.id;
      if (cacheContentHiddenTimer.has(key)) {
        clearTimeout(cacheContentHiddenTimer.get(key));
        updateOne(key, { hidden: false });
      }
    },
    [handleCallbackVerifyLogin, updateOne]
  );
  // share
  const onShare = useCallback((data: ContentListItem) => {
    tweetShare(data.title, getContentShareUrl(data.id));
  }, []);

  return {
    votePendingIds,
    onVote,
    favorPendingIds,
    onFavor,
    hiddenPendingIds,
    onHiddenAction,
    onHiddenUndoAction,
    onHidden,
    onShare,
    updateOne,
    deleteOne,
  };
};
