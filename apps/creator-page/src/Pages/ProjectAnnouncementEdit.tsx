import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import ProjectName from '../Components/Project/Name';
import ProjectDesc from '../Components/Project/Desc';
import { useCallback, useEffect, useState } from 'react';
import { useAppConfig } from '../AppProvider';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  fetchProjectDetail,
  ProjectDetail,
  selectProjectDetail,
} from '../redux/projectSlice';
import { updateProject } from '../api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import isEqual from '../utils/isEqual';

export default function ProjectAnnouncementEdit() {
  const { account, updateAccount } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const dispatch = useAppDispatch();

  const [project, setProject] = useState<ProjectDetail | null>(
    data && { ...data }
  );
  const [couldSave, setCouldSave] = useState(false);

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
      } else {
        toast.error('save fail!');
      }
    }
  }, [account, dispatch, project, slug, updateAccount]);

  useEffect(() => {
    if (!isEqual(data, project)) {
      setCouldSave(true);
    } else {
      setCouldSave(false);
    }
  }, [data, project]);

  if (!project) return null;

  return (
    <EditBox>
      <EditTitle
        title="Edit Announcement"
        save={saveProject}
        couldSave={couldSave}
      />
      <div className="info">
        <div className="left">
          <ProjectName
            title="Announcement Title"
            name={project.announcement?.title || ''}
            setName={(n) => {
              setProject({
                ...project,
                announcement: {
                  ...project.announcement,
                  title: n,
                },
              });
            }}
          />
          <ProjectDesc
            title="Announcement"
            desc={project.announcement?.text || ''}
            setDesc={(d) => {
              setProject({
                ...project,
                announcement: {
                  ...project.announcement,
                  text: d,
                },
              });
            }}
          />
        </div>
      </div>
    </EditBox>
  );
}
