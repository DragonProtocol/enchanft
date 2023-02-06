/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 18:59:14
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CardBase from '../components/common/card/CardBase';
import DappForm from '../components/dapp/DappForm';
import { MainWrapper } from '../components/layout/Index';
import { createProject } from '../services/api/project';
import { UniprojectStatus, UpdateProjectData } from '../services/types/project';
import { messages } from '../utils/message';

function DappCreate() {
  const initialValues = {
    name: '',
    description: '',
    image: '',
    types: [],
    dappUrl: '',
    url: '',
    status: UniprojectStatus.VISIBLE,
    chains: [],
    mediaLinks: {
      twitter: '',
      discord: '',
      facebook: '',
      telegram: '',
    },
    editorScore: 0,
  };
  const formHandleRef = useRef(null);
  const [pending, setPending] = useState(false);
  const handleReset = () => formHandleRef.current?.resetForm();
  const handleSubmit = useCallback(
    async (form: UpdateProjectData) => {
      if (pending) return;
      try {
        setPending(true);
        const resp = await createProject(form);
        const { code, msg } = resp.data;
        if (code === 0) {
          toast.success(messages.dapp.admin_submit);
          handleReset();
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
    <MainWrapper>
      <CardBase>
        <DappForm
          initialValues={initialValues}
          ref={formHandleRef}
          disabled={pending}
          loading={pending}
          onSubmit={handleSubmit}
          displayReset
        />
      </CardBase>
    </MainWrapper>
  );
}
export default DappCreate;
