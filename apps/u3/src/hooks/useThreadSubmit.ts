import { useUs3rThreadContext } from '@us3r-network/thread';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useThreadSubmit() {
  const { createNewThread } = useUs3rThreadContext();

  const createContentThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        const thread = await createNewThread({
          url,
          type: 'content',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createEventThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        const thread = await createNewThread({
          url,
          type: 'event',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createProjectThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        const thread = await createNewThread({
          url,
          type: 'project',
        });
        toast.success(`thread created: ${thread.document.id}`);
      } catch (error) {
        toast.error(`thread create failed: ${error.message}`);
      }
    },
    [createNewThread]
  );

  const createDappThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        const thread = await createNewThread({
          url,
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
    createContentThread,
    createEventThread,
    createProjectThread,
    createDappThread,
  };
}
