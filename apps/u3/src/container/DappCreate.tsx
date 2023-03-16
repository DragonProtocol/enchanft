/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 17:35:45
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import CardBase from '../components/common/card/CardBase';
import DappForm from '../components/dapp/DappForm';
import { MainWrapper } from '../components/layout/Index';
import useThreadSubmit from '../hooks/useThreadSubmit';
import { createDapp } from '../services/api/dapp';
import { createProject } from '../services/api/project';
import { DappStatus, UpdateDappData } from '../services/types/dapp';
import { UpdateProjectData } from '../services/types/project';
import { messages } from '../utils/message';

function DappCreate() {
  const { createDappThread, createProjectThread } = useThreadSubmit();
  const initialValues: UpdateDappData = {
    name: '',
    description: '',
    image: '',
    types: [],
    url: '',
    status: DappStatus.VISIBLE,
    chains: [],
    mediaLinks: {
      twitter: '',
      discord: '',
      facebook: '',
      telegram: '',
    },
    editorScore: 0,
    uniProjectId: undefined,
  };
  const formHandleRef = useRef(null);
  const [pending, setPending] = useState(false);
  const handleReset = () => formHandleRef.current?.resetForm();
  const handleSubmit = useCallback(
    async (form: UpdateDappData, isCreateProject: boolean) => {
      if (pending) return;
      try {
        setPending(true);
        let { uniProjectId } = form;
        // 如果要同步创建project
        if (isCreateProject) {
          const resp = await createProject(
            form as unknown as UpdateProjectData
          );
          const { code, msg, data } = resp.data;
          if (code === 0) {
            toast.success(messages.project.admin_submit);
            uniProjectId = data.id;
            createProjectThread(data.url);
          } else {
            toast.error(msg || messages.common.error);
          }
        }
        const resp = await createDapp({ ...form, uniProjectId });
        const { code, msg, data } = resp.data;
        if (code === 0) {
          toast.success(messages.dapp.admin_submit);
          handleReset();
          createDappThread(data.url);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setPending(false);
      }
    },
    [pending]
  );
  return (
    <ContainerWrapper>
      <CardBase>
        <DappForm
          initialValues={initialValues}
          ref={formHandleRef}
          disabled={pending}
          loading={pending}
          onSubmit={handleSubmit}
          displayReset
          displayCreateProject
        />
      </CardBase>
    </ContainerWrapper>
  );
}
export default DappCreate;
const ContainerWrapper = styled(MainWrapper)`
  height: auto;
`;
