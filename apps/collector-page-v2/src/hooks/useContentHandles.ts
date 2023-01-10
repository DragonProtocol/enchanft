/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 15:45:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-06 16:04:45
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

// cache content handle pending ids
const cacheContentVotePendingIds = new Set<number | string>();
const cacheContentFavorPendingIds = new Set<number | string>();
const cacheContentHiddenPendingIds = new Set<number | string>();

export default (originList?: ContentListItem[]) => {
  const { handleCallbackVerifyLogin } = useLogin();
  const { user } = useWlUserReact();

  // manage list
  const [newList, setNewList] = useState([...(originList || [])]);
  useEffect(() => {
    setNewList([...(originList || [])]);
  }, [originList]);

  const updateOne = useCallback(
    (id: string | number, data: Partial<ContentListItem>) => {
      setNewList(
        newList.map((item) =>
          item.id === id || item.uuid === id ? { ...item, ...data } : item
        )
      );
    },
    [newList]
  );

  const deleteOne = useCallback(
    (id: string | number) => {
      setNewList(newList.filter((item) => item.id !== id && item.uuid !== id));
    },
    [newList]
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
            resolve();
          } catch (error) {
            toast.error(error?.message || error?.msg);
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
            toast.error(error?.message || error?.msg);
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
            toast.error(error?.message || error?.msg);
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
  // share
  const onShare = useCallback((data: ContentListItem) => {
    tweetShare(data.title, getContentShareUrl(data.id));
  }, []);

  const formatCurrentContents = useCallback(
    (data: ContentListItem[]) => newList,
    [newList]
  );

  return {
    newList,
    votePendingIds,
    onVote,
    favorPendingIds,
    onFavor,
    hiddenPendingIds,
    onHidden,
    onShare,
    formatCurrentContents,
  };
};
