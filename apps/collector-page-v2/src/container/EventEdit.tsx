/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 18:38:59
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import EventForm from '../components/event/EventForm';
import { fetchOneEvent } from '../services/api/event';
import { CreateEventData } from '../services/types/event';
import useAdminEventHandles from '../hooks/useAdminEventHandles';
import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import { Platform } from '../services/types/common';

export default function EventEdit() {
  const { id } = useParams();
  const [fetchEventPending, setFetchEventPending] = useState(false);
  const [initialValues, setInitialValues] = useState<CreateEventData | null>(
    null
  );
  useEffect(() => {
    if (id) {
      setFetchEventPending(true);
      fetchOneEvent(id)
        .then(({ data: { data, code, msg } }) => {
          if (code === 0) {
            setInitialValues({
              name: data.name || '',
              description: data.description || '',
              image: data.image || '',
              platform: (data.platform.name || '') as unknown as Platform,
              project: (data.project.id || '') as unknown as number,
              link: data.link || '',
              chain: data.chain,
              reward: data.reward,
              startTime: data.startTime,
              endTime: data.endTime,
              supportIframe: data.supportIframe,
              editorScore: data.editorScore,
              types: data.types,
            });
          } else {
            toast.error(msg);
          }
        })
        .catch((error) => {
          toast.error(error.message || error.msg);
        })
        .finally(() => {
          setFetchEventPending(false);
        });
    }
  }, [id]);
  const { adminEditPending, onAdminEdit } = useAdminEventHandles();
  const formHandleRef = useRef(null);
  useEffect(() => {
    if (initialValues && formHandleRef.current) {
      formHandleRef.current?.resetForm();
    }
  }, [initialValues]);

  return fetchEventPending ? (
    <StatusWrapper>
      <Loading />
    </StatusWrapper>
  ) : initialValues ? (
    <EventForm
      initialValues={initialValues}
      loading={adminEditPending}
      onSubmit={(values) => onAdminEdit(id, values)}
      ref={formHandleRef}
    />
  ) : (
    <StatusWrapper>The event query with id {id} failed</StatusWrapper>
  );
}

const StatusWrapper = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
