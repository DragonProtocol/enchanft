/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 18:47:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 17:45:56
 * @Description: file description
 */
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchContentTags,
  selectState,
  addOne,
} from '../features/content/tags';
import { createContentTag } from '../services/api/contents';
import { AsyncRequestStatus } from '../services/types';
import { messages } from '../utils/message';

export default () => {
  const dispatch = useAppDispatch();
  const { status, tags } = useAppSelector(selectState);
  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchContentTags());
    }
  }, [status]);
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        value: tag,
        label: tag,
      })),
    [tags]
  );
  const [createLoading, setCreateLoading] = useState(false);
  const create = (tag: string) => {
    return new Promise<void>((resolve, reject) => {
      (async () => {
        if (createLoading) return;
        setCreateLoading(true);
        try {
          const resp = await createContentTag(tag);
          if (resp.data.code === 0) {
            dispatch(addOne(tag));
            resolve();
          } else {
            toast.success(messages.content.tag_create);
            reject();
          }
        } catch (error) {
          toast.error(error?.message || error?.msg || messages.common.error);
          reject();
        } finally {
          setCreateLoading(false);
        }
      })();
    });
  };
  return {
    loading,
    tags,
    tagOptions,
    create,
    createLoading,
  };
};
