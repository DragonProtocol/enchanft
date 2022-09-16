import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import ProjectName from '../Components/Project/Name';
import ProjectDesc from '../Components/Project/Desc';
import { useCallback, useState } from 'react';
import { useAppConfig } from '../AppProvider';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import { updateProject } from '../api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function ProjectAnnouncementEdit() {
  const { account, updateAccount } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const dispatch = useAppDispatch();
  // TODO fix any
  const [project, setProject] = useState<any>({ ...data });

  const saveProject = useCallback(async () => {
    if (!account.info?.token || !slug) return;
    try {
      await updateProject(project, account.info?.token);
      dispatch(fetchProjectDetail({ slug, token: account.info.token }));
      toast.success('save success!');
    } catch (error) {
      const err: AxiosError = error as any;
      if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        updateAccount({ ...account, info: null });
      }
    }
  }, [account, dispatch, project, slug, updateAccount]);

  return (
    <EditBox>
      <EditTitle title="Edit Announcement" save={saveProject} />
      <div className="info">
        <div className="left">
          <ProjectName
            title="Announcement Title"
            name={project.announcementTitle || ''}
            setName={(n) => {
              setProject({
                ...project,
                announcementTitle: n,
              });
            }}
          />
          <ProjectDesc
            title="Announcement"
            desc={project.announcementText || ''}
            setDesc={(d) => {
              setProject({
                ...project,
                announcementText: d,
              });
            }}
          />
        </div>
      </div>
    </EditBox>
  );
}
