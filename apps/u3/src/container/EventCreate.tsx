/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 14:26:41
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChainType, Platform, Reward } from '../services/types/common';
import EventForm from '../components/event/EventForm';
import useThreadSubmit from '../hooks/useThreadSubmit';
import { CreateEventData } from '../services/types/event';
import { createEvent } from '../services/api/event';
import { messages } from '../utils/message';

function EventCreate() {
  const { createEventDetailPageThread } = useThreadSubmit();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValues = {
    name: '',
    description: '',
    image: '',
    platform: '' as unknown as Platform,
    project: '' as unknown as number,
    link: searchParams.get('url') || '',
    chain: ChainType.EVM,
    reward: Reward.BADGE,
    startTime: Date.now(),
    endTime: Date.now() + 48 * 60 * 60 * 1000,
    supportIframe: true,
    editorScore: 0,
    types: [],
  };
  const formHandleRef = useRef(null);
  const [pending, setPending] = useState(false);
  const handleReset = () => formHandleRef.current?.resetForm();
  const handleSubmit = useCallback(
    async (form: CreateEventData) => {
      if (pending) return;
      try {
        setPending(true);
        const resp = await createEvent(form);
        const { code, msg } = resp.data;
        if (code === 0) {
          toast.success(messages.event.admin_submit);
          handleReset();
          createEventDetailPageThread(resp.data.data.id);
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
    <EventForm
      initialValues={initialValues}
      loading={pending}
      onSubmit={handleSubmit}
      ref={formHandleRef}
    />
  );
}
export default EventCreate;
