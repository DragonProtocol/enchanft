import { getS3LinkModel, useLinkState } from '@us3r-network/link';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useThreadSubmit() {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalAuthed } = useLinkState();
  const validateS3LinkModelPermission = useCallback(() => {
    if (!s3LinkModalAuthed) {
      throw new Error('s3LinkModel not authed');
    }
  }, [s3LinkModalAuthed]);

  const createContentThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3LinkModel.createLink({
          url,
          type: 'content',
          title: '',
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const createEventThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3LinkModel.createLink({
          url,
          type: 'event',
          title: '',
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const createProjectThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3LinkModel.createLink({
          url,
          type: 'project',
          title: '',
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const createDappThread = useCallback(
    async (url: string) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3LinkModel.createLink({
          url,
          type: 'dapp',
          title: '',
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  return {
    createContentThread,
    createEventThread,
    createProjectThread,
    createDappThread,
  };
}
