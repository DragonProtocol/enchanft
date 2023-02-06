/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-05 10:34:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 19:06:58
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  CreateEventData,
  EventExploreListItemResponse,
  EventStatus,
} from '../services/types/event';
import { updateEvent } from '../services/api/event';
import { useAppDispatch } from '../store/hooks';
import {
  updateOne as updateOneWithEventExplore,
  removeOne as removeOneWithEventExplore,
} from '../features/event/eventExploreList';
import { EVENT_ADMIN_PLUS_SCORE_STEP } from '../utils/event';
import { messages } from '../utils/message';

const cacheEventAdminThumbUpPendingIds = new Set();
const cacheEventAdminDeletePendingIds = new Set();
export default () => {
  const dispatch = useAppDispatch();
  // thumbUp
  const [adminThumbUpPendingIds, setAdminThumbUpPendingIds] = useState([
    ...cacheEventAdminThumbUpPendingIds,
  ]);
  const onAdminThumbUp = useCallback(
    async (data: EventExploreListItemResponse) => {
      const { id } = data;
      if (adminThumbUpPendingIds.includes(id)) return;
      try {
        cacheEventAdminThumbUpPendingIds.add(id);
        setAdminThumbUpPendingIds([...cacheEventAdminThumbUpPendingIds]);
        const editorScore =
          (data.editorScore || 0) + EVENT_ADMIN_PLUS_SCORE_STEP;
        const resp = await updateEvent(id, { editorScore });
        const { code, msg } = resp.data;
        if (code === 0) {
          // update explore event data
          dispatch(updateOneWithEventExplore({ id, editorScore }));
          toast.success(messages.event.admin_add_score);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        cacheEventAdminThumbUpPendingIds.delete(data.id);
        setAdminThumbUpPendingIds([...cacheEventAdminThumbUpPendingIds]);
      }
    },
    [adminThumbUpPendingIds]
  );

  // delete
  const [adminDeletePendingIds, setAdminDeletePendingIds] = useState([
    ...cacheEventAdminDeletePendingIds,
  ]);
  const onAdminDelete = useCallback(
    async (data: EventExploreListItemResponse) => {
      const { id } = data;
      if (adminDeletePendingIds.includes(id)) return;
      try {
        cacheEventAdminDeletePendingIds.add(id);
        setAdminThumbUpPendingIds([...cacheEventAdminDeletePendingIds]);
        const resp = await updateEvent(id, { status: EventStatus.HIDDEN });
        const { code, msg } = resp.data;
        if (code === 0) {
          // remove one explore event
          dispatch(removeOneWithEventExplore(id));
          toast.success(messages.event.hide);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        cacheEventAdminDeletePendingIds.delete(id);
        setAdminDeletePendingIds([...cacheEventAdminDeletePendingIds]);
      }
    },
    [adminDeletePendingIds]
  );

  // edit
  const [adminEditPending, setAdminEditPending] = useState(false);
  const onAdminEdit = useCallback(
    async (id: string | number, data: CreateEventData) => {
      if (adminEditPending) return;
      try {
        setAdminEditPending(true);
        const resp = await updateEvent(id, data);
        const { code, msg } = resp.data;
        if (code === 0) {
          toast.success(messages.event.admin_update);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setAdminEditPending(false);
      }
    },
    [adminDeletePendingIds]
  );

  return {
    adminThumbUpPendingIds,
    adminDeletePendingIds,
    adminEditPending,
    onAdminThumbUp,
    onAdminDelete,
    onAdminEdit,
  };
};
