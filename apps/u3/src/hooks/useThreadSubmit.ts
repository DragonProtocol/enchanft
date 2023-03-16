import { useUs3rThreadContext } from '@us3r-network/thread';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  getContentShareUrl,
  getDappShareUrl,
  getEventShareUrl,
  getProjectShareUrl,
} from '../utils/share';

export default function useThreadSubmit() {
  const { createNewThread } = useUs3rThreadContext();

  const createContentDetailPageThread = useCallback(
    async (id: number | string) => {
      try {
        const thread = await createNewThread({
          url: getContentShareUrl(id),
          type: 'content',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createEventDetailPageThread = useCallback(
    async (id: number | string) => {
      try {
        const thread = await createNewThread({
          url: getEventShareUrl(id),
          type: 'event',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createProjectDetailPageThread = useCallback(
    async (id: number | string) => {
      try {
        const thread = await createNewThread({
          url: getProjectShareUrl(id),
          type: 'project',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createDappDetailPageThread = useCallback(
    async (id: number | string) => {
      try {
        const thread = await createNewThread({
          url: getDappShareUrl(id),
          type: 'dapp',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  return {
    createContentDetailPageThread,
    createEventDetailPageThread,
    createProjectDetailPageThread,
    createDappDetailPageThread,
  };
}
