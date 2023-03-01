/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 16:57:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 18:33:32
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getContent } from '../services/api/contents';
import { ContentListItem } from '../services/types/contents';
import useAdminContentHandles from '../hooks/useAdminContentHandles';
import ContentPageMobile from '../components/contents/ContentPageMobile';
import useContentHandles from '../hooks/useContentHandles';

export type ContentPageProps = {
  // Queries
  id: string | number;
  loading: boolean;
  data: ContentListItem | null;
  // Mutations
  votePendingIds?: (string | number)[];
  onVote?: () => void;
  favorPendingIds?: (string | number)[];
  onFavor?: () => void;
  hiddenPendingIds?: (string | number)[];
  onHiddenAction?: () => void;
  onHiddenUndoAction?: () => void;
  onAdminScore?: () => void;
  onAdminDelete?: () => void;
  // Others
  onShare?: () => void;
};

export default function Content() {
  const { id } = useParams();
  const [fetchContentPending, setFetchContentPending] = useState(false);
  const [data, setData] = useState<ContentListItem | null>(null);
  const {
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
  } = useContentHandles();
  useEffect(() => {
    if (id) {
      setFetchContentPending(true);
      getContent(id)
        .then(({ data: { data: d, code, msg } }) => {
          if (code === 0) {
            setData(d);
          } else {
            toast.error(msg);
          }
        })
        .catch((error) => {
          toast.error(error.message || error.msg);
        })
        .finally(() => {
          setFetchContentPending(false);
        });
    }
  }, [id]);

  const handleVote = async () => {
    if (data.upVoted) return;
    await onVote(data);
    setData({ ...data, upVoteNum: data.upVoteNum + 1, upVoted: true });
  };
  const handleFavor = async () => {
    await onFavor(data);
    setData({ ...data, favored: !data.favored });
  };
  return (
    <ContentPageMobile
      id={id}
      loading={fetchContentPending}
      data={data}
      votePendingIds={votePendingIds}
      onVote={handleVote}
      favorPendingIds={favorPendingIds}
      onFavor={handleFavor}
    />
  );
}
